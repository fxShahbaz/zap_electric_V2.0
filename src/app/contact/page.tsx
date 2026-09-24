import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import ContactDesks from "@/components/contact-desks";
import ContactForm from "@/components/contact-form";
import Faq from "@/components/faq";
import { CTA } from "@/components/ui";
import { contactSteps, faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Zap Electric about buying a scooter, stocking the range, service and spares, or a fleet order.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Tell us what you need"
        intro="Four desks, so your message lands with the person who can answer it."
        image="/images/gallery-market.jpg"
        imageAlt="Electric scooter on a busy market street"
        actions={
          <>
            <CTA href="#message">Send a message</CTA>
            <CTA href="#desks" variant="outline">
              Find the right desk
            </CTA>
          </>
        }
      />

      <ContactDesks />

      {/* The form, with what happens next held beside it ------------------ */}
      <section
        id="message"
        className="scroll-mt-32 bg-mist py-24 md:py-32"
        aria-labelledby="message-title"
      >
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <h2
                  id="message-title"
                  className="title text-[clamp(1.875rem,3.6vw,2.75rem)]"
                  data-reveal
                >
                  Send a message
                </h2>
                <p className="lead mt-4 text-lg" data-reveal>
                  Not sure which desk? Write here and pick a topic.
                </p>

                <ol className="mt-10" data-reveal>
                  {contactSteps.map((step) => (
                    <li key={step.index} className="flex gap-5 border-t border-line py-5">
                      <span className="font-mono text-sm text-zap-ink">{step.index}</span>
                      <div>
                        <h3 className="title text-base">{step.title}</h3>
                        <p className="lead mt-1 text-[0.9375rem]">{step.copy}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="lead mt-6 text-sm" data-reveal>
                  Applying for a dealership? The{" "}
                  <Link
                    href="/dealers#dealer-form"
                    className="text-zap-ink underline underline-offset-4"
                  >
                    dealer form
                  </Link>{" "}
                  asks the questions we actually need.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-paper p-6 sm:p-10" data-reveal>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq title="Common questions" items={faqs} />
    </>
  );
}
