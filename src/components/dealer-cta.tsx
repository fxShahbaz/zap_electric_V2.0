import Image from "next/image";
import { purposePoints } from "@/lib/content";
import { Icon } from "@/components/icons";
import { CTA, Eyebrow } from "@/components/ui";

/** Two panels in one frame: what stands behind the scooters, on ink, and the
 *  dealer invitation under it, on paper. Each has its photograph alongside so
 *  neither reads as an empty slab. */
export default function DealerCta() {
  return (
    <section id="dealers" className="scroll-mt-24 bg-paper pb-24 md:pb-32">
      <div className="shell">
        <div className="overflow-hidden rounded-2xl ring-1 ring-line" data-reveal>
          {/* Built with purpose ------------------------------------------ */}
          <div className="grid bg-ink text-paper lg:grid-cols-12">
            <div className="flex flex-col items-start justify-center gap-6 px-8 py-14 md:px-14 md:py-16 lg:col-span-5">
              <Eyebrow className="text-paper/55">Built with purpose</Eyebrow>
              <h2 className="title text-[clamp(2rem,4vw,3.25rem)]">
                From idea to the final ride.
              </h2>
              <p className="max-w-sm text-lg leading-relaxed text-paper/70">
                Zap is backed by a manufacturing setup focused on building
                practical, reliable electric scooters for the Indian market.
              </p>
              <CTA href="/about" variant="paper">
                Inside Zap <span aria-hidden className="ml-2">→</span>
              </CTA>
            </div>

            <div className="relative order-first min-h-[15rem] sm:min-h-[20rem] lg:order-none lg:col-span-4 lg:min-h-full">
              <Image
                src="/images/detail-frame.jpg"
                alt="A Zap electric scooter, finished and ready"
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-transparent lg:to-ink/40" />
            </div>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-paper/10 px-8 py-10 md:px-14 lg:col-span-3 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:px-8 lg:py-14">
              {purposePoints.map((point) => (
                <li key={point.label} className="flex items-start gap-4">
                  <Icon name={point.icon} className="h-7 w-7 shrink-0 text-zap" />
                  <span className="text-sm leading-snug text-paper/85">{point.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dealer opportunity ------------------------------------------ */}
          <div className="grid border-t border-line bg-paper text-ink lg:grid-cols-2">
            <div className="flex flex-col items-start justify-center gap-6 px-8 py-14 md:px-14 md:py-16">
              <Eyebrow>Dealer opportunity</Eyebrow>
              <h2 className="title text-[clamp(2rem,4vw,3.25rem)]">
                Build your EV business with <span className="text-zap-ink">Zap</span>.
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-slate">
                We are appointing dealers across India. Bring a growing range
                of electric scooters to your city.
              </p>
              <div className="flex flex-wrap gap-3">
                <CTA href="/dealers#dealer-form">
                  Become a dealer <span aria-hidden className="ml-2">→</span>
                </CTA>
                <CTA href="/dealers" variant="outline">
                  Learn more
                </CTA>
              </div>
            </div>

            <div className="relative min-h-[15rem] sm:min-h-[20rem] lg:min-h-full">
              <Image
                src="/images/cta.jpg"
                alt="An electric scooter parked outside a lit storefront at night"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[55%_center]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
