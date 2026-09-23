import { scooters } from "@/lib/content";
import ModelCard from "@/components/model-card";
import { CTA, Eyebrow } from "@/components/ui";

/** Nine models in one grid, nothing else. Image, name, range — the three
 *  things anyone actually compares first. Everything deeper lives in the
 *  spec table. */
export default function Range() {
  return (
    <section id="range" className="scroll-mt-24 bg-paper py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow data-reveal>The line-up</Eyebrow>
            <h2 className="title mt-5 text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
              Find your <span className="text-zap-ink">Zap</span>.
            </h2>
            <p className="lead mt-4 max-w-md text-lg" data-reveal>
              Nine models, 60 to 120 km on a charge. Open any one for its full
              specification, or pick two or three to compare.
            </p>
          </div>
          <div data-reveal>
            <CTA href="/range" variant="outline">
              View all models
            </CTA>
          </div>
        </div>

        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {scooters.map((model, index) => (
            <ModelCard key={model.id} model={model} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
