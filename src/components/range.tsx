import Image from "next/image";
import Link from "next/link";
import { scooters, series } from "@/lib/content";

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
          Nine models in two series. Open any one for its full specification.
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
                  <li
                    key={model.id}
                    data-reveal
                    style={{ ["--reveal-delay" as string]: `${(index % 3) * 70}ms` }}
                  >
                    <Link href={`/range/${model.id}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
                        <Image
                          src={model.image}
                          alt={model.imageAlt}
                          fill
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                          className="object-cover object-[center_30%] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                        />
                      </div>
                      <h3 className="title mt-4 flex items-center gap-2 text-xl">
                        Zap {model.name}
                        <span
                          aria-hidden
                          className="translate-x-[-0.25rem] text-zap-ink opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        >
                          →
                        </span>
                      </h3>
                      <p className="lead mt-1 text-sm">{model.range}</p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
