"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CTA } from "@/components/ui";
import HeroWord from "@/components/hero-word";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Scroll zoom on the outer wrapper; the CSS drive loop runs on the inner
      // one. Separate nodes, so the two never fight over one transform.
      gsap.fromTo(
        ".hero-scroll",
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          immediateRender: true,
          scrollTrigger: {
            trigger: ".hero-frame",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-paper pt-32 md:pt-40">
      <div className="shell">
        {/* The sentence is read once, plainly; the swapping word is only seen. */}
        <h1
          aria-label="Electric scooters for everyday India"
          className="title text-[clamp(2.75rem,7.5vw,6rem)]"
        >
          <span data-appear-line>
            <span>Electric scooters</span>
          </span>
          <span data-appear-line style={{ ["--appear-delay" as string]: "110ms" }}>
            <span>
              {/* On a phone "India" always takes its own line, so a longer
                  word never re-wraps the headline and shoves the page down. */}
              for <HeroWord /> <br className="sm:hidden" />
              India
            </span>
          </span>
        </h1>

        <p
          className="lead mt-8 max-w-lg text-xl"
          data-appear
          style={{ ["--appear-delay" as string]: "260ms" }}
        >
          Nine models. Up to 120 km on a charge. Charges from the plug point you
          already have.
        </p>

        <div
          className="mt-10 flex flex-wrap gap-3"
          data-appear
          style={{ ["--appear-delay" as string]: "360ms" }}
        >
          <CTA href="#range">See the range</CTA>
          <CTA href="/dealers" variant="outline">
            Become a dealer
          </CTA>
        </div>
      </div>

      <div className="shell mt-16 md:mt-20">
        <div
          className="hero-frame relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-mist sm:aspect-[16/9]"
          data-appear
          style={{ ["--appear-delay" as string]: "300ms" }}
        >
          <div className="hero-scroll absolute inset-0 will-change-transform">
            {/* A slow push toward the lead rider, so the pack reads as coming
                at you rather than as a still. */}
            <div className="hero-drive absolute inset-0">
              <Image
                src="/images/hero.jpg"
                alt="Riders on Zap electric scooters coming through a city gateway"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[62%_center] sm:object-center"
              />

              {/* Speed at the edges: a blurred copy, masked to the rim, that
                  keeps streaming outward. The centre stays sharp. */}
              <div aria-hidden className="hero-rush absolute inset-0">
                <Image
                  src="/images/hero.jpg"
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover object-[62%_center] sm:object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
