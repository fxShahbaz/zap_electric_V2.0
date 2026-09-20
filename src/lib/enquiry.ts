/**
 * Single seam for every form on the site.
 *
 * The customer form, the dealer form and the contact form all call this one
 * function, which posts to the route handler at app/api/enquiry/route.ts. That
 * handler is where the destination is configured — see ZAP_ENQUIRY_WEBHOOK.
 *
 * This never throws: it resolves to a result the form can render, so a failed
 * send shows the rider an honest message and a way to reach us instead.
 */

export const ENQUIRY_KINDS = ["customer", "dealer", "contact"] as const;

export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

export type EnquiryResult = { ok: true } | { ok: false; message: string };

const fallbackMessage =
  "We could not send that just now. Please try again, or email us and we will pick it up.";

export async function sendEnquiry(
  kind: EnquiryKind,
  fields: Record<string, FormDataEntryValue>,
): Promise<EnquiryResult> {
  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, fields }),
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
