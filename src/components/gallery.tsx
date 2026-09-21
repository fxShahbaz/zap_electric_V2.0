"use client";

import Image from "next/image";
import { useRef } from "react";
import { commonSpecs, gallery } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Gallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((media) => {
          gsap.fromTo(
            media,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: media.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="gallery" ref={root} className="bg-paper py-24 md:py-32">
      <div className="shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ChargeTile />
        {gallery.map((item, index) => (
          <div
            key={item.image}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${((index + 1) % 4) * 70}ms` }}
          >
            <div
              data-parallax
              className="absolute inset-x-0 -inset-y-[8%] transform-gpu will-change-transform [backface-visibility:hidden]"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The first tile: a battery that fills from a sliver to full, over and over,
 * with the charging times from the spec sheet beneath it. The percentage is
 * pure CSS — a registered custom property animated as an integer and printed
 * with counter() — so this stays free of timers.
 */
function ChargeTile() {
  const [lead, lithium] = commonSpecs.chargingTime;

  return (
    <div
      className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl bg-ink p-7 text-paper md:p-8"
      data-reveal
    >
      {/* A soft green glow that breathes with the charge. */}
      <div aria-hidden className="charge-glow pointer-events-none absolute inset-0" />

      <p className="eyebrow relative text-zap">Plug in at home</p>

      <div aria-hidden className="charge-battery relative">
        <div className="flex items-center gap-1.5">
          <div className="relative h-20 flex-1 overflow-hidden rounded-xl border-2 border-paper/25 p-1.5">
            <div className="charge-fill relative h-full rounded-lg" />
            <svg
              viewBox="0 0 24 24"
              className="charge-bolt absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-paper"
              fill="currentColor"
            >
              <path d="M13.5 2 5 13.5h6L9.5 22 19 9.5h-6.2z" />
            </svg>
          </div>
          <div className="h-7 w-1.5 rounded-r-md bg-paper/25" />
        </div>
        <p className="charge-pct figure-num mt-4 text-sm text-paper/60" />
      </div>

      <div className="relative">
        <p className="figure-num text-[clamp(2.5rem,4vw,3.25rem)]">
          {lithium.replace(/^Lithium\s*/i, "")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-paper/60">
          Lithium-ion, from an ordinary socket. {lead.replace(/^Lead/i, "GEL")}.
        </p>
      </div>
    </div>
  );
}
