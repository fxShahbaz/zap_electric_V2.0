"use client";

import { useState } from "react";
import Link from "next/link";
import { scooters } from "@/lib/content";
import { readForm, sendEnquiry } from "@/lib/enquiry";
import { Field, FormError, Select, SubmitButton, Submitted } from "@/components/form-fields";

/** Four fields. Anything else we can ask when we call back.
 *  A model page passes `defaultModel` so the select arrives already filled. */
export default function Enquire({ defaultModel = "" }: { defaultModel?: string }) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [model, setModel] = useState(defaultModel);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError("");
    const result = await sendEnquiry("customer", readForm(form));
    setPending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSent(true);
    form.reset();
    setModel(defaultModel);
  }

  return (
    <section
      id="enquire"
      className="scroll-mt-24 bg-mist py-24 md:py-32"
      aria-labelledby="enquire-title"
    >
      <div className="shell">
        <div className="max-w-2xl">
        <h2 id="enquire-title" className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
          Enquire
        </h2>
        <p className="lead mt-4 text-lg" data-reveal>
          Leave four details and we will come back with a model, a battery and
          where to see one.
        </p>

        <div className="mt-10" data-reveal>
          {sent ? (
            <Submitted
              title="Enquiry received"
              copy="We will be in touch shortly."
              onReset={() => setSent(false)}
            />
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" name="name" placeholder="Your name" autoComplete="name" />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+91"
                  pattern="[0-9+\s-]{8,}"
                  autoComplete="tel"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="City"
                  name="city"
                  placeholder="Where you ride"
                  autoComplete="address-level2"
                />
                <Select label="Model" name="model" value={model} onChange={setModel}>
                  <option value="">Not sure yet</option>
                  {scooters.map((scooter) => (
                    <option key={scooter.id} value={scooter.name}>
                      Zap {scooter.name}
                    </option>
                  ))}
                </Select>
              </div>

              {error ? <FormError message={error} /> : null}

              <SubmitButton pending={pending} className="mt-2 self-start">
                Send enquiry
              </SubmitButton>

              <p className="lead text-sm">
                Want to sell Zap instead?{" "}
                <Link href="/dealers" className="text-zap-ink underline underline-offset-4">
                  Dealer programme
                </Link>
                .
              </p>
            </form>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
