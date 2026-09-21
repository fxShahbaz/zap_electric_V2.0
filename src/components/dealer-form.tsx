"use client";

import { useState } from "react";
import { readForm, sendEnquiry } from "@/lib/enquiry";
import { Field, FormError, SubmitButton, Submitted, TextArea } from "@/components/form-fields";

/** `onSent` lets a host (the invitation dialog) react to a successful send.
 *  `compact` tightens spacing and fields for the dialog's narrower column. */
export default function DealerForm({
  onSent,
  compact = false,
}: {
  onSent?: () => void;
  compact?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError("");
    const result = await sendEnquiry("dealer", readForm(form));
    setPending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSent(true);
    form.reset();
    onSent?.();
  }

  if (sent) {
    return (
      <Submitted
        title="Dealer enquiry received"
        copy="We will come back on whether your territory is open, and with the terms for it."
        onReset={() => setSent(false)}
        resetLabel="Send another enquiry"
      />
    );
  }

  const gap = compact ? "gap-4" : "gap-6";

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col ${gap} ${
        compact ? "[&_input]:py-2.5 [&_textarea]:py-2.5" : ""
      }`}
    >
      <div className={`grid ${gap} sm:grid-cols-2`}>
        <Field
          label="Business name"
          name="business"
          placeholder="Registered or trading name"
          autoComplete="organization"
        />
        <Field label="Your name" name="name" placeholder="Full name" autoComplete="name" />
      </div>

      {/* Phone and city pair up; email gets a full row since addresses run long. */}
      <div className={`grid ${gap} sm:grid-cols-2`}>
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+91"
          pattern="[0-9+\s-]{8,}"
          autoComplete="tel"
        />
        <Field
          label="City"
          name="city"
          placeholder="City or town"
          autoComplete="address-level2"
        />
      </div>

      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="you@business.com"
        autoComplete="email"
      />

      <TextArea
        label="Anything else"
        name="notes"
        rows={compact ? 2 : 3}
        placeholder="Brands you already sell, showroom size, workshop capacity."
      />

      {error ? <FormError message={error} /> : null}

      <SubmitButton pending={pending} className={compact ? "mt-1 self-start" : "mt-2 self-start"}>
        Submit dealer enquiry
      </SubmitButton>
    </form>
  );
}
