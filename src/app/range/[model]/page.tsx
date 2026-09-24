import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Enquire from "@/components/enquire";
import CompareToggle from "@/components/compare-toggle";
import { CTA } from "@/components/ui";
import {
  scooters,
  scooterById,
  seriesById,
  specRows,
  commonSpecs,
} from "@/lib/content";

type Params = Promise<{ model: string }>;

export function generateStaticParams() {
  return scooters.map((scooter) => ({ model: scooter.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const model = scooterById[(await params).model];
  if (!model) return {};
  const platform = seriesById[model.series];
  return {
    title: `Zap ${model.name}`,
    description: `Zap ${model.name} — ${platform.range}, ${commonSpecs.topSpeed} top speed, GEL or lithium-ion battery. Full specification and colours.`,
  };
}

export default async function ModelPage({ params }: { params: Params }) {
  const model = scooterById[(await params).model];
  if (!model) notFound();

  const platform = seriesById[model.series];
  const rows = specRows(model);
  const siblings = scooters.filter(
    (item) => item.series === model.series && item.id !== model.id,
  );

  const index = scooters.findIndex((item) => item.id === model.id);
  const next = scooters[(index + 1) % scooters.length];

  return (
    <>
      <header className="bg-paper pt-40 md:pt-48">
        <div className="shell">
          <Link
            href="/range"
            className="text-sm text-slate transition-colors hover:text-ink"
          >
            ← The range
          </Link>

          <h1 className="title mt-8 text-[clamp(2.5rem,6.4vw,5rem)]" data-appear>
            Zap {model.name}
          </h1>

          <p
            className="lead mt-6 max-w-xl text-xl"
            data-appear
            style={{ ["--appear-delay" as string]: "120ms" }}
          >
            {platform.name} — {platform.range}, with a GEL or lithium-ion
            battery. {platform.blurb}
          </p>

          <div
            className="mt-8"
            data-appear
            style={{ ["--appear-delay" as string]: "180ms" }}
          >
            <CompareToggle id={model.id} name={model.name} tone="inline" />
          </div>

          <div
            className="relative mt-14 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-mist sm:aspect-[16/9]"
            data-appear
            style={{ ["--appear-delay" as string]: "220ms" }}
          >
            <Image
              src={model.image}
              alt={model.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
          </div>

          {/* The three figures people ask for first */}
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {[
              { label: "Range", value: model.range },
              { label: "Top speed", value: commonSpecs.topSpeed },
              { label: "Weight", value: commonSpecs.weight },
              { label: "Colours", value: String(model.colours.length) },
            ].map((figure) => (
              <div key={figure.label} className="border-t border-line pt-4">
                <dd className="title text-2xl">{figure.value}</dd>
                <dt className="lead mt-1 text-sm">{figure.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Colours ----------------------------------------------------------- */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            Colours
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3" data-reveal>
            {model.colours.map((colour) => (
              <li
                key={colour}
                className="rounded-full border border-line px-5 py-2.5 text-sm"
              >
                {colour}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Full specification ------------------------------------------------ */}
      <section id="specification" className="scroll-mt-32 bg-mist py-24 md:py-32">
        <div className="shell">
          <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
            Full specification
          </h2>
          <p className="lead mt-4 max-w-xl text-lg" data-reveal>
            Every line below is from the Zap product sheet for the {model.name}.
          </p>

          <dl className="mt-12 max-w-3xl" data-reveal>
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 border-t border-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <dt className="lead shrink-0 text-sm sm:w-56">{row.label}</dt>
                <dd className="whitespace-pre-line text-[0.9375rem] sm:flex-1">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Enquiry, model already filled in ---------------------------------- */}
      <Enquire defaultModel={model.name} />

      {/* Siblings ---------------------------------------------------------- */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]">
              Others in the {platform.name}
            </h2>
            <CTA href="/range" variant="outline">
              See all nine
            </CTA>
          </div>

          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((sibling, i) => (
              <li
                key={sibling.id}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }}
              >
                <Link href={`/range/${sibling.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
                    <Image
                      src={sibling.image}
                      alt={sibling.imageAlt}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      className="object-cover object-[center_30%] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="title mt-4 text-xl">Zap {sibling.name}</h3>
                  <p className="lead mt-1 text-sm">{sibling.range}</p>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={`/range/${next.id}`}
            className="mt-16 flex items-center justify-between gap-6 border-t border-line pt-8 text-sm text-slate transition-colors hover:text-ink"
            data-reveal
          >
            <span>Next model</span>
            <span className="title text-lg text-ink">Zap {next.name} →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
