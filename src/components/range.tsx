import { scooters, series } from "@/lib/content";
import ModelCard from "@/components/model-card";
import { CTA } from "@/components/ui";

/** Nine models, nothing else. Image, name, range — the three things anyone
 *  actually compares first. Everything deeper lives in the spec table. */
export default function Range() {
  return (
    <section id="range" className="scroll-mt-24 bg-paper py-24 md:py-32">
      <div className="shell">
        <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
          The range
        </h2>
        <p className="lead mt-4 max-w-md text-lg" data-reveal>
          Nine models in two series. Open any one for its full specification,
          or pick two or three to compare.
        </p>

        {series.map((platform) => (
          <div key={platform.id} className="mt-16 md:mt-20">
            <p className="lead text-sm" data-reveal>
              {platform.name} — {platform.range}
            </p>

            <ul className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {scooters
                .filter((model) => model.series === platform.id)
                .map((model, index) => (
                  <ModelCard key={model.id} model={model} index={index} />
                ))}
            </ul>
          </div>
        ))}

        <div className="mt-16" data-reveal>
          <CTA href="/range" variant="outline">
            The full range, series by series
          </CTA>
        </div>
      </div>
    </section>
  );
}
