"use client";

import Image from "next/image";
import { useRef } from "react";
import { gallery } from "@/lib/content";
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
        {gallery.map((item, index) => (
          <div
            key={item.image}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${(index % 4) * 70}ms` }}
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
