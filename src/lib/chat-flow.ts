import { contactChannels, scooters } from "@/lib/content";

/**
 * What the enquiry chat asks, in order. The field names are the ones the
 * customer and dealer forms already send, so /api/enquiry validates a chat
 * enquiry exactly as it validates a form — no second set of rules.
 *
 * Edit the wording here; the chat component only plays it back.
 */

export type ChatKind = "customer" | "dealer";
export type Answers = Record<string, string>;

export type Question = {
  field: string;
  /** How the answer is labelled in the summary before sending. */
  label: string;
  ask: (answers: Answers) => string;
  /** Free text, typed. Omit for a question answered only by choices. */
  input?: {
    type: "text" | "tel" | "email";
    placeholder: string;
    autoComplete?: string;
    maxLength?: number;
  };
  choices?: { label: string; value: string }[];
  /** Offers a Skip chip; a skipped answer is left out of the enquiry. */
  optional?: boolean;
  /** Returns what to say back when an answer will not do. */
  check?: (value: string) => string | null;
};

const firstName = (answers: Answers) => (answers.name ?? "").trim().split(/\s+/)[0] || "";

const thanks = (answers: Answers) => {
  const name = firstName(answers);
  return name ? `Thanks, ${name}.` : "Thanks.";
};

const enough = (value: string) =>
  value.trim().length >= 2 ? null : "Could you give me a little more than that?";

// Same rule as the forms' pattern ([0-9+\s-]{8,}), plus a sane upper bound.
const phone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return /^[0-9+\s-]+$/.test(value) && digits.length >= 8 && digits.length <= 15
    ? null
    : "That does not look like a phone number. Could you type it again, with at least 8 digits?";
};

const email = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? null
    : "That email address does not look quite right. Could you check it?";

export const intentChoices: { label: string; value: ChatKind }[] = [
  { label: "Buy a scooter", value: "customer" },
  { label: "Become a dealer", value: "dealer" },
];

export const greeting = [
  "Hello. I can take your enquiry here — a few quick questions, about a minute.",
  "Are you looking to buy a Zap, or to sell them?",
];

export const questions: Record<ChatKind, Question[]> = {
  customer: [
    {
      field: "name",
      label: "Name",
      ask: () => "Good. What is your name?",
      input: { type: "text", placeholder: "Your name", autoComplete: "name" },
      check: enough,
    },
    {
      field: "phone",
      label: "Phone",
      ask: (answers) => `${thanks(answers)} What number should we call you on?`,
      input: { type: "tel", placeholder: "+91", autoComplete: "tel" },
      check: phone,
    },
    {
      field: "city",
      label: "City",
      ask: () => "Which city do you ride in?",
      input: { type: "text", placeholder: "City or town", autoComplete: "address-level2" },
      check: enough,
    },
    {
      field: "model",
      label: "Model",
      ask: () => "Any model in mind? It is fine not to know yet.",
      choices: [
        ...scooters.map((scooter) => ({ label: `Zap ${scooter.name}`, value: scooter.name })),
        { label: "Not sure yet", value: "" },
      ],
    },
  ],
  dealer: [
    {
      field: "business",
      label: "Business",
      ask: () => "Good. What is the name of your business?",
      input: {
        type: "text",
        placeholder: "Registered or trading name",
        autoComplete: "organization",
      },
      check: enough,
    },
    {
      field: "name",
      label: "Name",
      ask: () => "And your name?",
      input: { type: "text", placeholder: "Full name", autoComplete: "name" },
      check: enough,
    },
    {
      field: "phone",
      label: "Phone",
      ask: (answers) => `${thanks(answers)} What is the best number to reach you on?`,
      input: { type: "tel", placeholder: "+91", autoComplete: "tel" },
      check: phone,
    },
    {
      field: "email",
      label: "Email",
      ask: () => "Which email address should the terms go to?",
      input: { type: "email", placeholder: "you@business.com", autoComplete: "email" },
      check: email,
    },
    {
      field: "city",
      label: "City",
      ask: () => "Which city is your showroom in?",
      input: { type: "text", placeholder: "City or town", autoComplete: "address-level2" },
      check: enough,
    },
    {
      field: "notes",
      label: "Notes",
      ask: () =>
        "Anything else we should know — brands you already sell, showroom size, workshop capacity? Skip it if not.",
      input: { type: "text", placeholder: "Optional", maxLength: 2000 },
      optional: true,
    },
  ],
};

/** The summary shown before sending: answered questions only, in order. */
export function summarise(kind: ChatKind, answers: Answers): [string, string][] {
  return questions[kind]
    .filter((question) => question.field in answers)
    .filter((question) => answers[question.field] !== "" || question.field === "model")
    .map((question) => [
      question.label,
      answers[question.field] === "" ? "Not sure yet" : answers[question.field],
    ]);
}

export const sentCopy: Record<ChatKind, string> = {
  customer: "Sent. We will be in touch shortly.",
  dealer: "Sent. We will come back on whether your city is open, and with the terms for it.",
};

/** Where to send someone if the chat itself cannot reach us. */
export const fallbackEmail: Record<ChatKind, string> = {
  customer:
    contactChannels.find((channel) => channel.email.startsWith("sales"))?.email ??
    contactChannels[0].email,
  dealer:
    contactChannels.find((channel) => channel.email.startsWith("dealers"))?.email ??
    contactChannels[0].email,
};
