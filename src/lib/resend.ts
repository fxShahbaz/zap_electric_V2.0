/**
 * The one call we make to Resend: POST /emails. Plain fetch rather than the
 * SDK — it is a single request, and this keeps it dependency-free.
 * https://resend.com/docs/api-reference/emails/send-email
 *
 * Server only: it needs RESEND_API_KEY, which must never reach the browser.
 */

export type Email = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Resend drops a repeat of the same key and body for 24 hours, so a
   *  double-tap or a retry after a timeout cannot send the email twice. */
  idempotencyKey?: string;
};

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; status: number; message: string };

export async function sendEmail(apiKey: string, email: Email): Promise<SendResult> {
  const headers: Record<string, string> = {
    authorization: `Bearer ${apiKey}`,
    "content-type": "application/json",
  };
  if (email.idempotencyKey) headers["idempotency-key"] = email.idempotencyKey.slice(0, 256);

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    return { ok: false, status: 0, message: `Resend unreachable: ${String(error)}` };
  }

  const body = (await response.json().catch(() => null)) as
    | { id?: unknown; message?: unknown; name?: unknown }
    | null;

  if (!response.ok) {
    const detail = [body?.name, body?.message].filter((part) => typeof part === "string").join(": ");
    return { ok: false, status: response.status, message: detail || `HTTP ${response.status}` };
  }

  return { ok: true, id: typeof body?.id === "string" ? body.id : "" };
}
