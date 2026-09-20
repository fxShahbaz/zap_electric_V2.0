"use client";

import { useState } from "react";
import { readForm, sendEnquiry } from "@/lib/enquiry";
import { Field, FormError, Select, SubmitButton, Submitted, TextArea } from "@/components/form-fields";

const topics = [
  "Buying a scooter",
  "Dealership enquiry",
  "Service or spares",
  "Fleet or bulk order",
  "Something else",
];

export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError("");
    const result = await sendEnquiry("contact", readForm(form));
    setPending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSent(true);
    form.reset();
  }

  if (sent) {
    return (
      <Submitted
        title="Message received"
        copy="We will reply to the address you gave us. If it is about a dealership, it goes straight to the dealer desk."
        onReset={() => setSent(false)}
        resetLabel="Send another message"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your name" autoComplete="name" />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required={false}
          placeholder="+91"
          pattern="[0-9+\s-]{8,}"
          autoComplete="tel"
        />
        <Select label="What is it about" name="topic" required defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </Select>
      </div>

      <TextArea
        label="Message"
        name="message"
        rows={4}
        required
        placeholder="Tell us what you need."
      />

      {error ? <FormError message={error} /> : null}

      <SubmitButton pending={pending} className="mt-2 self-start">
        Send message
      </SubmitButton>
    </form>
  );
}
