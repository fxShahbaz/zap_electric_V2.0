import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import DealerForm from "@/components/dealer-form";
import Faq from "@/components/faq";
import { CTA } from "@/components/ui";
import { dealerBenefits, dealerSteps, dealerFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dealers",
  description:
    "Become a Zap Electric dealer. Nine models across two series, territory-based appointment, training and spares support.",
};

export default function DealersPage() {
  return (
    <>
      <PageHeader
        title="Sell Zap in your city"
        intro="We are appointing dealers across India. Tell us the city you cover and we will tell you honestly whether it is open."
        image="/images/cta.jpg"
        imageAlt="Electric scooters parked outside a lit storefront"
        actions={<CTA href="#dealer-form">Become a dealer</CTA>}
      />

      {/* What comes with it ---------------------------------------------- */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            What comes with the appointment
          </h2>

          <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {dealerBenefits.map((benefit, index) => (
              <li
                key={benefit.index}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${(index % 3) * 70}ms` }}
              >
                <h3 className="title text-lg">{benefit.title}</h3>
                <p className="lead mt-2 text-[0.9375rem]">{benefit.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works ----------------------------------------------------- */}
      <section className="bg-mist py-24 md:py-32">
        <div className="shell">
          <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            How it works
          </h2>

          <ol className="mt-14 grid gap-10 md:grid-cols-4">
            {dealerSteps.map((step, index) => (
              <li
                key={step.index}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${index * 70}ms` }}
              >
                <span className="text-sm text-zap-ink">{step.index}</span>
                <h3 className="title mt-3 text-lg">{step.title}</h3>
                <p className="lead mt-2 text-[0.9375rem]">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The form ---------------------------------------------------------- */}
      <section
        id="dealer-form"
        className="scroll-mt-32 bg-paper py-24 md:py-32"
        aria-labelledby="dealer-form-title"
      >
        <div className="shell">
          <div className="max-w-2xl">
          <h2 id="dealer-form-title" className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            Become a dealer
          </h2>
          <p className="lead mt-4 text-lg" data-reveal>
            Nothing here commits you to anything. Prefer email?{" "}
            <a
              href="mailto:dealers@zapelectric.example"
              className="text-zap-ink underline underline-offset-4"
            >
              dealers@zapelectric.example
            </a>
          </p>

          <div className="mt-10" data-reveal>
            <DealerForm />
            </div>
          </div>
        </div>
      </section>

      <Faq id="faq" title="Dealer questions" items={dealerFaqs} />
    </>
  );
}
