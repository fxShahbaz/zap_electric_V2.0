"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { chapters } from "@/lib/content";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Sticky image column on the right, chapters scrolling past on the left.
 *  ScrollTrigger only decides which chapter is active; the cross-fade itself
 *  is a CSS opacity transition. */
export default function Hardware() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const blocks = Array.from(
        root.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? [],
      );
      blocks.forEach((block, index) => {
        ScrollTrigger.create({
          trigger: block,
          start: "top 62%",
          end: "bottom 42%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="hardware"
      ref={root}
      className="scroll-mt-32 bg-paper py-24 md:py-32"
    >
      <div className="shell">
        <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
          What is under the panels
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:order-2 md:col-span-6">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-cloud">
                {chapters.map((chapter, index) => (
                  <Image
                    key={chapter.index}
                    src={chapter.image}
                    alt={chapter.imageAlt}
                    fill
                    sizes="(max-width: 768px) 92vw, 46vw"
                    className={`object-cover transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active === index ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-ink/80 to-transparent p-5">
                  <span className="text-sm text-paper/85">
                    {chapters[active].title}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:order-1 md:col-span-6">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.index}
                data-chapter
                className={`border-t border-line py-10 transition-opacity duration-700 first:border-t-0 first:pt-0 md:py-16 ${
                  active === index
                    ? "opacity-100"
                    : "md:opacity-45 motion-reduce:opacity-100"
                }`}
              >
                <h3 className="title text-[clamp(1.375rem,2.6vw,1.875rem)]">
                  {chapter.title}
                </h3>
                <p className="lead mt-4 max-w-md">{chapter.copy}</p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {chapter.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-ink">
                      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-zap" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
