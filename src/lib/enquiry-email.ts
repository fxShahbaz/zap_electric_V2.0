import type { EnquiryKind, EnquiryVia } from "./enquiry";

/**
 * Turns an enquiry into the email the Zap team reads. Written for the inbox:
 * the subject says who and where, the body is a plain table, and Reply goes
 * straight to the enquirer when they gave an email address.
 */

export type Enquiry = {
  kind: EnquiryKind;
  via: EnquiryVia;
  fields: Record<string, string>;
  receivedAt: string;
  source: string | null;
};

const kindTitle: Record<EnquiryKind, string> = {
  customer: "Customer enquiry",
  dealer: "Dealer enquiry",
  contact: "Contact message",
};

/** Known fields in the order a person reads them; anything else follows. */
const labels: [string, string][] = [
  ["business", "Business"],
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["city", "City"],
  ["model", "Model"],
  ["topic", "Topic"],
  ["notes", "Notes"],
  ["message", "Message"],
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function rows(fields: Record<string, string>): [string, string][] {
  const known = labels
    .filter(([key]) => fields[key])
    .map(([key, label]): [string, string] => [label, fields[key]]);
  const knownKeys = new Set(labels.map(([key]) => key));
  const rest = Object.entries(fields).filter(([key]) => !knownKeys.has(key));
  return [...known, ...rest];
}

function when(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export function enquiryEmail(enquiry: Enquiry) {
  const { kind, via, fields } = enquiry;
  const who = fields.business || fields.name || "Someone";
  const subject = `${kindTitle[kind]}: ${who}${fields.city ? `, ${fields.city}` : ""}`;
  const channel = via === "chat" ? "the chat on the website" : "a form on the website";
  const received = `${when(enquiry.receivedAt)} IST`;
  const table = rows(fields);

  const text = [
    `${kindTitle[kind]}, sent from ${channel}.`,
    "",
    ...table.map(([label, value]) => `${label}: ${value}`),
    "",
    `Received: ${received}`,
    ...(enquiry.source ? [`Page: ${enquiry.source}`] : []),
  ].join("\n");

  const cell = "padding:10px 0;border-bottom:1px solid #e4e6e0;vertical-align:top;";
  const html = `<!doctype html>
<html><body style="margin:0;background:#f6f7f4;font-family:Helvetica,Arial,sans-serif;color:#101310;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="margin:0;font-size:13px;color:#5b615a;">Sent from ${escape(channel)}</p>
    <h1 style="margin:8px 0 24px;font-size:22px;line-height:1.3;">${escape(subject)}</h1>
    <table role="presentation" style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:12px;padding:8px 20px;">
      ${table
        .map(
          ([label, value]) => `<tr>
        <td style="${cell}width:30%;font-size:13px;color:#5b615a;">${escape(label)}</td>
        <td style="${cell}font-size:15px;white-space:pre-wrap;">${escape(value)}</td>
      </tr>`,
        )
        .join("\n      ")}
    </table>
    <p style="margin:20px 0 0;font-size:13px;color:#8b918a;">Received ${escape(received)}${
      enquiry.source ? ` · ${escape(enquiry.source)}` : ""
    }</p>
  </div>
</body></html>`;

  const replyTo = fields.email && emailPattern.test(fields.email) ? fields.email : undefined;

  return { subject, html, text, replyTo };
}
