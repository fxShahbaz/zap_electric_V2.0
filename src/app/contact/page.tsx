import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import ContactForm from "@/components/contact-form";
import Faq from "@/components/faq";
import { contactChannels, faqs } from "@/lib/content";

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
      />

      <section className="bg-paper py-16 md:py-20">
        <div className="shell">
          <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
            {contactChannels.map((channel, index) => (
              <li
                key={channel.email}
                className="border-t border-line py-6"
                data-reveal
                style={{ ["--reveal-delay" as string]: `${(index % 4) * 60}ms` }}
              >
                <h2 className="title text-lg">{channel.title}</h2>
                <a
                  href={`mailto:${channel.email}`}
                  className="lead mt-2 block text-sm text-zap-ink underline underline-offset-4"
                >
                  {channel.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="message"
        className="scroll-mt-24 bg-mist py-24 md:py-32"
        aria-labelledby="message-title"
      >
        <div className="shell">
          <div className="max-w-2xl">
          <h2 id="message-title" className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            Send a message
          </h2>
          <p className="lead mt-4 text-lg" data-reveal>
            Applying for a dealership? The{" "}
            <Link href="/dealers#dealer-form" className="text-zap-ink underline underline-offset-4">
              dealer form
            </Link>{" "}
            asks the questions we actually need.
          </p>

          <div className="mt-10" data-reveal>
            <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Faq title="Common questions" items={faqs} />
    </>
  );
}
