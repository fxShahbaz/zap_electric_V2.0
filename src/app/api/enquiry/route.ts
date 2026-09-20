import type { NextRequest } from "next/server";
import { ENQUIRY_KINDS, type EnquiryKind } from "@/lib/enquiry";

/**
 * The destination for every enquiry on the site — customer, dealer and contact.
 *
 * Delivery is one hop: set ZAP_ENQUIRY_WEBHOOK to an inbox relay, a CRM intake
 * URL or a Zapier/Make hook and enquiries start arriving there. Nothing else in
 * the app needs to change.
 *
 * With no destination configured we refuse to pretend: in development the
 * enquiry is logged and accepted so the form can be worked on, but in
 * production the request fails loudly (503) rather than dropping a real dealer
 * on the floor behind a green tick.
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

  const { kind, fields: rawFields } = (body ?? {}) as { kind?: unknown; fields?: unknown };

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

  const enquiry = {
    kind,
    fields,
    receivedAt: new Date().toISOString(),
    source: request.headers.get("referer") ?? null,
  };

  const webhook = process.env.ZAP_ENQUIRY_WEBHOOK;

  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[zap] ZAP_ENQUIRY_WEBHOOK is not set — enquiry refused, not delivered", {
        kind,
      });
      return Response.json(
        { ok: false, error: "We could not send that just now." },
        { status: 503 },
      );
    }
    console.info("[zap] no ZAP_ENQUIRY_WEBHOOK set — accepted in dev, delivered nowhere", enquiry);
    return Response.json({ ok: true, delivered: false });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(enquiry),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("[zap] enquiry webhook rejected the enquiry", {
        kind,
        status: response.status,
      });
      return Response.json(
        { ok: false, error: "We could not send that just now." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[zap] enquiry webhook unreachable", { kind, error });
    return Response.json({ ok: false, error: "We could not send that just now." }, { status: 502 });
  }

  return Response.json({ ok: true, delivered: true });
}
