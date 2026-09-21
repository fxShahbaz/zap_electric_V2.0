/**
 * Single seam for every form on the site.
 *
 * The customer, dealer and contact forms and the enquiry chat all call this
 * one function, which posts to the route handler at app/api/enquiry/route.ts.
 * That handler is where delivery is configured — Resend email, a webhook, or
 * both; see .env.example.
 *
 * This never throws: it resolves to a result the form can render, so a failed
 * send shows the rider an honest message and a way to reach us instead.
 */

export const ENQUIRY_KINDS = ["customer", "dealer", "contact"] as const;

export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

/** How it reached us — the email says so, so nobody wonders where a lead came from. */
export type EnquiryVia = "form" | "chat";

export type EnquiryResult = { ok: true } | { ok: false; message: string };

const fallbackMessage =
  "We could not send that just now. Please try again, or email us and we will pick it up.";

export async function sendEnquiry(
  kind: EnquiryKind,
  fields: Record<string, FormDataEntryValue>,
  /** `key` makes a retry safe: the same key is delivered at most once. */
  options: { via?: EnquiryVia; key?: string } = {},
): Promise<EnquiryResult> {
  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, fields, via: options.via ?? "form", key: options.key }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = (body as { error?: unknown } | null)?.error;
      return { ok: false, message: typeof message === "string" ? message : fallbackMessage };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: fallbackMessage };
  }
}

/** Pulls a plain object out of a form, ready for sendEnquiry. */
export function readForm(form: HTMLFormElement): Record<string, FormDataEntryValue> {
  return Object.fromEntries(new FormData(form).entries());
}
