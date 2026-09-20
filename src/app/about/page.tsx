import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import Hardware from "@/components/hardware";
import Standard from "@/components/standard";
import Gallery from "@/components/gallery";
import { series, benefits } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zap Electric builds nine electric scooters across two series, sold through appointed dealers across India.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Built for the trip you actually make"
        intro="Most journeys are short, local and repeated every day. We build electric scooters for exactly those — nine of them, across two series, sold through dealers who can service what they sell."
        image="/images/gallery-street.jpg"
        imageAlt="Rider on an electric scooter in city traffic"
      />

      {/* The nine reasons, in full --------------------------------------- */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <h2 className="title max-w-[20ch] text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            Nine reasons it makes sense on a normal week
          </h2>

          <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
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

      {/* The two series --------------------------------------------------- */}
      <section className="bg-mist py-24 md:py-32">
        <div className="shell">
          <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            Two series, room for more
          </h2>
          <p className="lead mt-4 max-w-xl text-lg" data-reveal>
            Everything in production today sits on one of these two.
          </p>

          <div className="mt-12 grid gap-12 md:grid-cols-2">
            {series.map((item) => (
              <div key={item.id} data-reveal>
                <h3 className="title text-xl">{item.name}</h3>
                <p className="lead mt-3">{item.blurb}</p>
                <dl className="mt-6">
                  {[
                    ["Range", item.range],
                    ["Motor", item.motor],
                    ["Brakes", item.brakes],
                    ["Tyres", item.tyreSize],
                    ["Battery", item.battery.join(" · ")],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-6 border-t border-line py-4"
                    >
                      <dt className="lead shrink-0 text-sm">{label}</dt>
                      <dd className="text-right text-sm">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Hardware />
      <Standard />
      <Gallery />

    </>
  );
}
