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

const tones = {
  plain: { card: "bg-mist text-ink", muted: "text-slate" },
  ink: { card: "bg-ink text-paper", muted: "text-paper/60" },
  wash: { card: "bg-zap-wash text-ink", muted: "text-slate" },
  zap: { card: "bg-zap text-ink", muted: "text-ink/70" },
} as const;

/** Laid out to fill a three-column grid exactly: each big card spans two, so
 *  every row is one big and one small, or three small. The figures are the
 *  ones already in the copy, not new claims. */
const bento: { index: string; figure?: { value: string; unit: string; tone: keyof typeof tones } }[] = [
  { index: "01" },
  { index: "03", figure: { value: "120", unit: "km on a charge", tone: "ink" } },
  { index: "02" },
  { index: "04" },
  { index: "05" },
  { index: "06", figure: { value: "80", unit: "kg kerb weight", tone: "wash" } },
  { index: "07" },
  { index: "08" },
  { index: "09", figure: { value: "25", unit: "km/hr class", tone: "zap" } },
];

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

          {/* A bento, not a wall of nine equal paragraphs: the three reasons
              that come with a number get a big card and the number itself. */}
          <ul className="mt-14 grid gap-3 sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-3">
            {bento.map(({ index, figure }, position) => {
              const benefit = benefits.find((item) => item.index === index)!;
              const tone = figure ? tones[figure.tone] : tones.plain;
              return (
                <li
                  key={index}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${(position % 3) * 70}ms` }}
                  className={`flex flex-col justify-between gap-10 rounded-2xl p-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:p-8 ${tone.card} ${
                    figure ? "sm:col-span-2" : ""
                  }`}
                >
                  {figure ? (
                    <p className="flex items-baseline gap-2">
                      <span className="figure-num text-[clamp(3.5rem,7vw,5.5rem)]">
                        {figure.value}
                      </span>
                      <span className={`text-lg ${tone.muted}`}>{figure.unit}</span>
                    </p>
                  ) : (
                    <span className={`font-mono text-xs tracking-[0.14em] ${tone.muted}`}>
                      {index}
                    </span>
                  )}

                  <div className={figure ? "max-w-md" : ""}>
                    <h3 className="title text-lg">{benefit.title}</h3>
                    <p className={`mt-2 text-[0.9375rem] leading-relaxed ${tone.muted}`}>
                      {benefit.copy}
                    </p>
                  </div>
                </li>
              );
            })}
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
