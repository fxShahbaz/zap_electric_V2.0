import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import RangeListing from "@/components/range-listing";
import Enquire from "@/components/enquire";
import { CTA } from "@/components/ui";
import { commonSpecs, scooters, series, standardFitment } from "@/lib/content";

export const metadata: Metadata = {
  title: "The range",
  description: `All ${scooters.length} Zap electric scooters across ${series.length} series — up to 120 km per charge, ${commonSpecs.topSpeed} top speed, GEL or lithium-ion battery.`,
};

/** Small counts read as words, like the rest of the site's copy ("Nine models"). */
const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const say = (count: number) => words[count] ?? String(count);
const Say = (count: number) => say(count).charAt(0).toUpperCase() + say(count).slice(1);

/** What every model shares, straight off the spec sheet. */
const shared = [
  { label: "Top speed", value: commonSpecs.topSpeed },
  { label: "Charging time", value: commonSpecs.chargingTime.join(" · ") },
  { label: "Charger", value: commonSpecs.charger },
  { label: "Weight", value: commonSpecs.weight },
  { label: "Suspension", value: commonSpecs.suspension },
  { label: "Tyres", value: commonSpecs.tyre },
  { label: "Chassis", value: commonSpecs.chassis },
  { label: "Speedometer", value: commonSpecs.speedometer },
];

export default function RangePage() {
  return (
    <>
      <PageHeader
        title="The range"
        intro={`${Say(scooters.length)} electric scooters, 60 to 120 km on a charge. Open any model for its full specification, or choose two or three to compare.`}
        actions={
          <>
            <CTA href="#enquire">Enquire</CTA>
            <CTA href="/compare" variant="outline">
              Compare models
            </CTA>
          </>
        }
      />

      <div className="mt-16 md:mt-20">
        <RangeListing />
      </div>

      {/* What every model shares ------------------------------------------ */}
      <section className="border-t border-line bg-paper py-24 md:py-32" aria-labelledby="shared-title">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2
                id="shared-title"
                className="title text-[clamp(1.875rem,3.6vw,2.75rem)]"
                data-reveal
              >
                Standard on every model
              </h2>
              <p className="lead mt-4 max-w-sm" data-reveal>
                Whichever you choose, this comes with it.
              </p>
            </div>

            <div className="lg:col-span-8">
              <dl className="grid gap-x-10 sm:grid-cols-2" data-reveal>
                {shared.map((item) => (
                  <div key={item.label} className="border-t border-line py-4">
                    <dt className="text-sm text-ash">{item.label}</dt>
                    <dd className="mt-1 text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-10 flex flex-wrap gap-2" data-reveal>
                {standardFitment.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink"
                  >
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-zap" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Enquire />
    </>
  );
}
