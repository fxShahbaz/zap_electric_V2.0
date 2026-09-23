import Image from "next/image";
import { CTA, Eyebrow } from "@/components/ui";

/** One rider, one line, one green button. The photo is the point; the type
 *  sits on the shaded half so the rider stays clear. */
export default function Spotlight() {
  return (
    <section className="bg-paper pb-24 md:pb-32">
      <div className="shell">
        <div
          className="relative min-h-[28rem] overflow-hidden rounded-2xl bg-ink text-paper sm:min-h-[32rem]"
          data-reveal
        >
          <Image
            src="/images/gallery-rider.jpg"
            alt="Rider on a Zap electric scooter on a city street"
            fill
            sizes="(max-width: 1344px) 100vw, 1344px"
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10 lg:bg-gradient-to-r lg:from-ink lg:via-ink/70 lg:to-transparent" />

          <div className="relative flex h-full min-h-[28rem] flex-col justify-end gap-6 px-8 py-12 sm:min-h-[32rem] md:px-14 md:py-16 lg:max-w-xl lg:justify-center">
            <Eyebrow className="text-paper/60">Zap, out there</Eyebrow>
            <h2 className="title text-[clamp(2rem,4.4vw,3.5rem)]">
              Made for everyday <span className="text-zap">India</span>.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-paper/70">
              From the office run to the weekend plan, Zap is designed for the
              way people actually move.
            </p>
            <div>
              <CTA href="#why" variant="green">
                What makes Zap different
              </CTA>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
