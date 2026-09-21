"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons";
import { sendEnquiry } from "@/lib/enquiry";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import {
  fallbackEmail,
  greeting,
  intentChoices,
  questions,
  sentCopy,
  summarise,
  type Answers,
  type ChatKind,
} from "@/lib/chat-flow";

/**
 * The enquiry chat: a floating button bottom right, and a panel that asks the
 * customer or dealer form's questions one at a time, checks each answer as it
 * comes, reads the lot back, and sends it through the same /api/enquiry the
 * forms use (so it arrives by Resend email, webhook, or both).
 *
 * Mounted in the root layout, not the header: the header turns on
 * backdrop-filter once scrolled, which would make it the containing block for
 * anything fixed inside it. On a phone the panel fills the screen and holds the
 * page still; on a desktop it opens upward from the button and the page stays
 * usable behind it.
 */

type Line =
  | { from: "bot" | "user"; text: string; tone?: "error" }
  | { from: "bot"; summary: [string, string][] };

type Message = Line & { id: number };

type BotLine = string | { text: string; tone: "error" } | { summary: [string, string][] };

type Stage =
  | { name: "intent" }
  | { name: "ask"; kind: ChatKind; index: number }
  | { name: "review"; kind: ChatKind }
  | { name: "sending"; kind: ChatKind }
  | { name: "sent"; kind: ChatKind }
  | { name: "failed"; kind: ChatKind };

type Chip = {
  label: string;
  primary?: boolean;
  /** A link chip (mailto) instead of an action. */
  href?: string;
  action?:
    | { type: "intent"; kind: ChatKind }
    | { type: "answer"; value: string }
    | { type: "send" }
    | { type: "restart" }
    | { type: "close" };
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** randomUUID only exists on secure origins; a LAN dev URL is not one. */
function newKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export default function EnquiryChat() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>({ name: "intent" });
  const [answers, setAnswers] = useState<Answers>({});
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const nextId = useRef(0);
  /** Bumped on every restart, so a reply still "typing" from before is dropped. */
  const conversation = useRef(0);
  const sendKey = useRef("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const locked = useRef(false);

  const append = useCallback((line: Line) => {
    const id = nextId.current++;
    setMessages((current) => [...current, { ...line, id }]);
  }, []);

  const userSays = useCallback(
    (text: string) => append({ from: "user", text }),
    [append],
  );

  /** Plays bot lines with a short "typing" beat each. False if a restart cut it off. */
  const botSays = useCallback(
    async (lines: BotLine[]) => {
      const token = conversation.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setTyping(true);
      for (const line of lines) {
        const length = typeof line === "string" ? line.length : "text" in line ? line.text.length : 40;
        await wait(reduced ? 120 : Math.min(900, 380 + length * 6));
        if (conversation.current !== token) return false;
        if (typeof line === "string") append({ from: "bot", text: line });
        else if ("summary" in line) append({ from: "bot", summary: line.summary });
        else append({ from: "bot", text: line.text, tone: line.tone });
      }
      setTyping(false);
      return true;
    },
    [append],
  );

  const start = useCallback(() => {
    conversation.current += 1;
    setMessages([]);
    setAnswers({});
    setDraft("");
    setTyping(false);
    setStage({ name: "intent" });
    void botSays(greeting);
  }, [botSays]);

  const chooseIntent = (kind: ChatKind, label: string) => {
    userSays(label);
    setStage({ name: "ask", kind, index: 0 });
    void botSays([questions[kind][0].ask(answers)]);
  };

  const answer = (value: string, shown?: string) => {
    if (stage.name !== "ask") return;
    const question = questions[stage.kind][stage.index];
    const trimmed = value.trim();
    userSays(shown ?? trimmed);

    const problem = trimmed === "" && question.optional ? null : question.check?.(trimmed);
    if (problem) {
      void botSays([{ text: problem, tone: "error" }]);
      return;
    }

    const next = { ...answers };
    if (trimmed === "" && question.optional) delete next[question.field];
    else next[question.field] = trimmed;
    setAnswers(next);

    const index = stage.index + 1;
    if (index < questions[stage.kind].length) {
      setStage({ name: "ask", kind: stage.kind, index });
      void botSays([questions[stage.kind][index].ask(next)]);
      return;
    }

    sendKey.current = newKey();
    setStage({ name: "review", kind: stage.kind });
    void botSays([
      "That is everything. Here is what I will send:",
      { summary: summarise(stage.kind, next) },
      "Shall I send it?",
    ]);
  };

  const send = async (label: string) => {
    if (stage.name !== "review" && stage.name !== "failed") return;
    const { kind } = stage;
    const token = conversation.current;
    userSays(label);
    setStage({ name: "sending", kind });
    setTyping(true);

    const result = await sendEnquiry(kind, answers, { via: "chat", key: sendKey.current });
    if (conversation.current !== token) return;
    setTyping(false);

    if (result.ok) {
      setStage({ name: "sent", kind });
      void botSays([sentCopy[kind]]);
    } else {
      setStage({ name: "failed", kind });
      void botSays([{ text: result.message, tone: "error" }]);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    answer(draft);
    setDraft("");
  };

  // Open / close ------------------------------------------------------------

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const toggle = () => {
    if (open) {
      close();
      return;
    }
    setOpen(true);
    setSeen(true);
    if (messages.length === 0) start();
  };

  // The phone layout fills the screen, so the page behind it should not move.
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(max-width: 639px)").matches) {
      lockScroll();
      locked.current = true;
    }
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      if (locked.current) {
        unlockScroll();
        locked.current = false;
      }
    };
  }, [open]);

  // New line in the log: keep the latest in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const question = stage.name === "ask" ? questions[stage.kind][stage.index] : null;
  const wantsText = !typing && question?.input !== undefined;

  // Keep focus in the conversation. A typed answer wanted: caret in the box.
  // Otherwise, if focus fell to <body> — a clicked chip is removed from the
  // page, taking focus with it — catch it on the panel, so Tab and Escape
  // still work from where the person was.
  useEffect(() => {
    if (!open || typing) return;
    if (wantsText) {
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) panel.focus({ preventScroll: true });
  }, [open, typing, wantsText, stage]);

  // Escape closes — from inside the panel, or while focus is nowhere in
  // particular. Not when a real modal (the dealer invitation) is on top.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (document.querySelector("dialog[open]")) return;
      const active = document.activeElement;
      if (active && active !== document.body && !panelRef.current?.contains(active)) return;
      close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Render ------------------------------------------------------------------

  // Chips are data; one handler runs them, so nothing is wired up in render.
  const chips: Chip[] = [];
  if (!typing) {
    if (stage.name === "intent" && messages.length > 0) {
      for (const choice of intentChoices) {
        chips.push({ label: choice.label, action: { type: "intent", kind: choice.value } });
      }
    }
    if (question?.choices) {
      for (const choice of question.choices) {
        chips.push({ label: choice.label, action: { type: "answer", value: choice.value } });
      }
    }
    if (question?.optional) chips.push({ label: "Skip", action: { type: "answer", value: "" } });
    if (stage.name === "review") {
      chips.push({ label: "Send it", primary: true, action: { type: "send" } });
      chips.push({ label: "Start over", action: { type: "restart" } });
    }
    if (stage.name === "failed") {
      chips.push({ label: "Try again", primary: true, action: { type: "send" } });
      chips.push({ label: "Email us instead", href: `mailto:${fallbackEmail[stage.kind]}` });
    }
    if (stage.name === "sent") {
      chips.push({ label: "Start a new enquiry", action: { type: "restart" } });
      chips.push({ label: "Close", action: { type: "close" } });
    }
  }

  const run = (chip: Chip) => {
    const action = chip.action;
    if (!action) return;
    if (action.type === "intent") chooseIntent(action.kind, chip.label);
    else if (action.type === "answer") answer(action.value, chip.label);
    else if (action.type === "send") void send(chip.label);
    else if (action.type === "restart") start();
    else close();
  };

  const panel = (
    <div
      ref={panelRef}
      id="enquiry-chat"
      role="dialog"
      aria-label="Enquiry chat"
      tabIndex={-1}
      className="chat-panel fixed z-[60] flex flex-col overflow-hidden bg-paper text-ink outline-none"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-zap">
            <Icon name="chat" className="h-[1.125rem] w-[1.125rem]" />
          </span>
          <div>
            <p className="title text-[0.9375rem]">Enquire with Zap</p>
            <p className="text-xs text-ash">About a minute, start to finish</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 1 ? (
            <button
              type="button"
              onClick={start}
              aria-label="Start over"
              title="Start over"
              className="grid h-9 w-9 place-items-center rounded-full text-ash transition-colors hover:bg-mist hover:text-ink"
            >
              <Icon name="restart" className="h-[1.125rem] w-[1.125rem]" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={close}
            aria-label="Close chat"
            className="grid h-9 w-9 place-items-center rounded-full text-ash transition-colors hover:bg-mist hover:text-ink"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        data-lenis-prevent
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain px-5 py-5"
      >
        {messages.map((message) =>
          "summary" in message ? (
            <dl
              key={message.id}
              className="chat-in mr-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-2xl border border-line p-4 text-sm"
            >
              {message.summary.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-ash">{label}</dt>
                  <dd className="break-words text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p
              key={message.id}
              className={`chat-in max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed ${
                message.from === "user"
                  ? "self-end rounded-br-md bg-ink text-paper"
                  : message.tone === "error"
                    ? "self-start rounded-bl-md bg-flag-wash text-flag"
                    : "self-start rounded-bl-md bg-mist text-ink"
              }`}
            >
              {message.text}
            </p>
          ),
        )}

        {typing ? (
          <p className="chat-in self-start rounded-2xl rounded-bl-md bg-mist px-4 py-3.5" aria-label="Typing">
            <span className="chat-dots" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </p>
        ) : null}

        {chips.length > 0 ? (
          <div className="chat-in mt-1 flex flex-wrap gap-2">
            {chips.map((chip) =>
              chip.href ? (
                <a
                  key={chip.label}
                  href={chip.href}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
                >
                  {chip.label}
                </a>
              ) : (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => run(chip)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    chip.primary
                      ? "bg-ink text-paper hover:bg-zap-ink"
                      : "border border-line text-ink hover:border-ink"
                  }`}
                >
                  {chip.label}
                </button>
              ),
            )}
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line p-3">
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!wantsText}
          type={question?.input?.type ?? "text"}
          inputMode={question?.input?.type === "tel" ? "tel" : undefined}
          autoComplete={question?.input?.autoComplete ?? "off"}
          maxLength={question?.input?.maxLength ?? 200}
          enterKeyHint="send"
          aria-label={question ? question.label : "Message"}
          placeholder={
            wantsText
              ? question?.input?.placeholder
              : stage.name === "sending"
                ? "Sending…"
                : "Pick an option above"
          }
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-[0.9375rem] outline-none transition-colors placeholder:text-ash/70 focus:border-zap-ink disabled:bg-mist"
        />
        <button
          type="submit"
          disabled={!wantsText || !draft.trim()}
          aria-label="Send"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-zap-ink disabled:bg-cloud disabled:text-ash"
        >
          <Icon name="arrow" className="h-[1.125rem] w-[1.125rem]" />
        </button>
      </form>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={open ? "Close enquiry chat" : "Open enquiry chat"}
        aria-expanded={open}
        aria-controls="enquiry-chat"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-ink text-paper shadow-[0_12px_32px_-8px_rgba(16,19,16,0.45)] transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-zap-ink sm:bottom-6 sm:right-6"
      >
        <Icon name={open ? "close" : "chat"} className="h-6 w-6" />
        {!seen ? (
          <span aria-hidden className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-ink bg-zap" />
        ) : null}
      </button>
      {open ? createPortal(panel, document.body) : null}
    </>
  );
}
