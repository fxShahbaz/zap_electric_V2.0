import { series, commonSpecs, standardFitment } from "@/lib/content";

/** Only what differs between the two series. Everything shared is one
 *  sentence underneath, rather than eight more table rows. */
const rows = [
  { label: "Range", get: (s: (typeof series)[number]) => s.range },
  { label: "Motor", get: (s: (typeof series)[number]) => s.motor },
  { label: "Brakes", get: (s: (typeof series)[number]) => s.brakes },
  { label: "Tyres", get: (s: (typeof series)[number]) => s.tyreSize },
];

export default function Specs() {
  return (
    <section id="specs" className="scroll-mt-24 bg-paper py-24 md:py-32">
      <div className="shell">
        <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
          The difference between the two series
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2" data-reveal>
          {series.map((item) => (
            <div key={item.id}>
              <h3 className="title text-xl">{item.name}</h3>
              <dl className="mt-6">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between gap-6 border-t border-line py-4"
                  >
                    <dt className="lead text-sm">{row.label}</dt>
                    <dd className="text-right text-sm">{row.get(item)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="lead mt-12 max-w-3xl" data-reveal>
          Everything else is the same on both: a top speed of{" "}
          {commonSpecs.topSpeed}, a micro charger with auto cutoff that takes{" "}
          {commonSpecs.chargingTime.join(" or ").toLowerCase()}, a tubular frame
          on tubeless tyres, and {standardFitment.length} features fitted as
          standard.{" "}
          <a href="/about" className="text-zap-ink underline underline-offset-4">
            Full detail on the about page
          </a>
          .
        </p>
      </div>
    </section>
  );
}
