"use client";

import { useState } from "react";
import { readForm, sendEnquiry } from "@/lib/enquiry";
import { Field, FormError, SubmitButton, Submitted, TextArea } from "@/components/form-fields";

/** `onSent` lets a host (the invitation dialog) react to a successful send. */
export default function DealerForm({ onSent }: { onSent?: () => void }) {
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

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Business name"
          name="business"
          placeholder="Registered or trading name"
          autoComplete="organization"
        />
        <Field label="Your name" name="name" placeholder="Full name" autoComplete="name" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+91"
          pattern="[0-9+\s-]{8,}"
          autoComplete="tel"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@business.com"
          autoComplete="email"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="City"
          name="city"
          placeholder="City or town"
          autoComplete="address-level2"
        />
      </div>

      <TextArea
        label="Anything else"
        name="notes"
        rows={3}
        placeholder="Brands you already sell, showroom size, workshop capacity."
      />

      {error ? <FormError message={error} /> : null}

      <SubmitButton pending={pending} className="mt-2 self-start">
        Submit dealer enquiry
      </SubmitButton>
    </form>
  );
}
