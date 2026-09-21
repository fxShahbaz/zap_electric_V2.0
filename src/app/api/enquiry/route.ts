import type { NextRequest } from "next/server";
import { ENQUIRY_KINDS, type EnquiryKind, type EnquiryVia } from "@/lib/enquiry";
import { enquiryEmail, type Enquiry } from "@/lib/enquiry-email";
import { sendEmail } from "@/lib/resend";

/**
 * The destination for every enquiry on the site — the customer, dealer and
 * contact forms, and the enquiry chat.
 *
 * Two ways out, either or both:
 *   · Email through Resend — RESEND_API_KEY and ENQUIRY_EMAIL_TO
 *     (ENQUIRY_EMAIL_FROM optional; see .env.example).
 *   · A webhook — ZAP_ENQUIRY_WEBHOOK, for a CRM or a Zapier/Make hook.
 * An enquiry counts as delivered when at least one of them takes it, so a
 * flaky second destination never costs us the lead; failures are logged.
 *
 * With nothing configured we refuse to pretend: in development the enquiry is
 * logged and accepted so the forms can be worked on, but in production the
 * request fails loudly (503) rather than dropping a real dealer on the floor
 * behind a green tick.
 */

/** Fields we will not accept an empty value for, per kind. */
const required: Record<EnquiryKind, readonly string[]> = {
  customer: ["name", "phone", "city"],
  dealer: ["business", "name", "phone", "email", "city"],
  contact: ["name", "email", "topic", "message"],
};

/** Everything else is capped at this; free text gets more room. */
const defaultMaxLength = 200;
const longFields: Record<string, number> = { notes: 2000, message: 2000 };

type Destination = { name: string; deliver: (enquiry: Enquiry, key?: string) => Promise<boolean> };

/** What is configured right now. Read per request, so env changes need no rebuild logic. */
function destinations(): Destination[] {
  const found: Destination[] = [];

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.ENQUIRY_EMAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (apiKey && to.length > 0) {
    // Resend's shared test sender only delivers to your own Resend account
    // address. Set ENQUIRY_EMAIL_FROM on a verified domain for real use.
    const from = process.env.ENQUIRY_EMAIL_FROM || "Zap Electric <onboarding@resend.dev>";
    found.push({
      name: "resend",
      deliver: async (enquiry, key) => {
        const result = await sendEmail(apiKey, {
          from,
          to,
          ...enquiryEmail(enquiry),
          idempotencyKey: key ? `enquiry-${key}` : undefined,
        });
        if (!result.ok) {
          console.error("[zap] Resend refused the enquiry email", {
            kind: enquiry.kind,
            status: result.status,
            message: result.message,
          });
        }
        return result.ok;
      },
    });
  } else if (apiKey || to.length > 0) {
    console.error(
      "[zap] Resend is half-configured — set both RESEND_API_KEY and ENQUIRY_EMAIL_TO",
    );
  }

  const webhook = process.env.ZAP_ENQUIRY_WEBHOOK;
  if (webhook) {
    found.push({
      name: "webhook",
      deliver: async (enquiry) => {
        try {
          const response = await fetch(webhook, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(enquiry),
            signal: AbortSignal.timeout(10_000),
          });
          if (!response.ok) {
            console.error("[zap] enquiry webhook rejected the enquiry", {
              kind: enquiry.kind,
              status: response.status,
            });
          }
          return response.ok;
        } catch (error) {
          console.error("[zap] enquiry webhook unreachable", { kind: enquiry.kind, error });
          return false;
        }
      },
    });
  }

  return found;
}

function isEnquiryKind(value: unknown): value is EnquiryKind {
  return typeof value === "string" && (ENQUIRY_KINDS as readonly string[]).includes(value);
}

/** Keeps string fields only, trimmed and capped. Returns null if a value is unusable. */
function cleanFields(input: unknown): Record<string, string> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return null;

  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (trimmed === "") continue;
    cleaned[key] = trimmed.slice(0, longFields[key] ?? defaultMaxLength);
  }
  return cleaned;
}

function missingFrom(kind: EnquiryKind, fields: Record<string, string>): string[] {
  return required[kind].filter((name) => !fields[name]);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Could not read that request." }, { status: 400 });
  }

  const {
    kind,
    fields: rawFields,
    via: rawVia,
    key: rawKey,
  } = (body ?? {}) as { kind?: unknown; fields?: unknown; via?: unknown; key?: unknown };

  const via: EnquiryVia = rawVia === "chat" ? "chat" : "form";
  // A client-made id; only ever used as Resend's idempotency key, so keep it tame.
  const key =
    typeof rawKey === "string" && /^[A-Za-z0-9-]{8,100}$/.test(rawKey) ? rawKey : undefined;

  if (!isEnquiryKind(kind)) {
    return Response.json({ ok: false, error: "Unknown enquiry type." }, { status: 400 });
  }

  const fields = cleanFields(rawFields);
  if (!fields) {
    return Response.json({ ok: false, error: "Could not read that form." }, { status: 400 });
  }

  const missing = missingFrom(kind, fields);
  if (missing.length > 0) {
    return Response.json(
      { ok: false, error: "Some required details are missing.", missing },
      { status: 400 },
    );
  }

  const enquiry: Enquiry = {
    kind,
    via,
    fields,
    receivedAt: new Date().toISOString(),
    source: request.headers.get("referer") ?? null,
  };

  const outs = destinations();

  if (outs.length === 0) {
    if (process.env.NODE_ENV === "production") {
      console.error("[zap] no enquiry destination configured — enquiry refused, not delivered", {
        kind,
      });
      return Response.json(
        { ok: false, error: "We could not send that just now." },
        { status: 503 },
      );
    }
    console.info("[zap] no enquiry destination set — accepted in dev, delivered nowhere", enquiry);
    return Response.json({ ok: true, delivered: false });
  }

  const results = await Promise.all(outs.map((out) => out.deliver(enquiry, key)));
  const deliveredTo = outs.filter((_, index) => results[index]).map((out) => out.name);

  if (deliveredTo.length === 0) {
    return Response.json({ ok: false, error: "We could not send that just now." }, { status: 502 });
  }

  return Response.json({ ok: true, delivered: true });
}
