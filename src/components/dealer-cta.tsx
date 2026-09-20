import Image from "next/image";
import { CTA } from "@/components/ui";

/** One panel, one idea, one button — with the storefront alongside it so the
 *  dark block reads as a place rather than an empty slab. */
export default function DealerCta() {
  return (
    <section id="dealers" className="scroll-mt-24 bg-paper pb-24 md:pb-32">
      <div className="shell">
        <div className="overflow-hidden rounded-2xl bg-ink text-paper" data-reveal>
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col items-start gap-8 px-8 py-16 md:px-14 md:py-20">
              <h2 className="title text-[clamp(2rem,4.4vw,3.5rem)]">
                Sell Zap in your city
              </h2>
              <p className="max-w-lg text-lg leading-relaxed text-paper/70">
                We are appointing dealers across India. Tell us your territory
                and we will tell you whether it is open.
              </p>
              <CTA href="/dealers" variant="green">
                Dealer programme
              </CTA>
            </div>

            <div className="relative order-first min-h-[15rem] sm:min-h-[20rem] lg:order-none lg:min-h-full">
              <Image
                src="/images/cta.jpg"
                alt="An electric scooter parked outside a lit storefront at night"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[55%_center]"
              />
              {/* Keeps the type side clean where the image meets it. */}
              <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/20 to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/30 lg:to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
