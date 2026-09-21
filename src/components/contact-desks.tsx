"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { contactChannels } from "@/lib/content";
import { Icon } from "@/components/icons";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const total = String(contactChannels.length).padStart(2, "0");

/** The four desks. Same shape as Hardware on /about: the photograph holds
 *  still while the desks scroll past it, ScrollTrigger only decides which desk
 *  is active, and the cross-fade is a CSS opacity transition. A phone has no
 *  room to stick anything, so there each desk carries its own photograph. */
export default function ContactDesks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const desks = Array.from(
        root.current?.querySelectorAll<HTMLElement>("[data-desk]") ?? [],
      );
      desks.forEach((desk, index) => {
        ScrollTrigger.create({
          trigger: desk,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });
    },
    { scope: root },
  );

  const current = contactChannels[active];

  return (
    <section
      id="desks"
      ref={root}
      className="scroll-mt-24 bg-paper py-24 md:py-32"
      aria-labelledby="desks-title"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-6">
            <h2 id="desks-title" className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
              Four desks
            </h2>
            <p className="lead mt-4 max-w-md text-lg" data-reveal>
              Write to the one that fits and it reaches the person who can answer it.
            </p>

            <ol className="mt-10 md:mt-14">
              {contactChannels.map((channel, index) => (
                <li
                  key={channel.email}
                  data-desk
                  className={`border-t border-line py-12 transition-opacity duration-700 md:py-20 ${
                    active === index ? "opacity-100" : "md:opacity-40 motion-reduce:opacity-100"
                  }`}
                >
                  <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-2xl bg-cloud md:hidden">
                    <Image
                      src={channel.image}
                      alt={channel.imageAlt}
                      fill
                      sizes="92vw"
                      className="object-cover"
                    />
                  </div>

                  <span className="font-mono text-sm text-zap-ink">{channel.index}</span>
                  <h3 className="title mt-3 text-[clamp(1.5rem,2.8vw,2.125rem)]">
                    {channel.title}
                  </h3>
                  <p className="lead mt-4 max-w-md">{channel.copy}</p>

                  <a
                    href={`mailto:${channel.email}`}
                    className="group mt-8 inline-flex items-center gap-3 rounded-full border border-line px-5 py-3 text-sm text-ink transition-colors duration-300 hover:border-ink"
                  >
                    {channel.email}
                    <Icon
                      name="arrow"
                      className="h-4 w-4 text-zap-ink transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div className="hidden md:col-span-6 md:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] max-h-[calc(100dvh-10rem)] w-full overflow-hidden rounded-3xl bg-cloud">
                {contactChannels.map((channel, index) => (
                  <Image
                    key={channel.email}
                    src={channel.image}
                    alt={active === index ? channel.imageAlt : ""}
                    fill
                    sizes="46vw"
                    className={`object-cover transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active === index ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-ink/80 to-transparent p-6">
                  <span className="text-sm text-paper/85">{current.title}</span>
                  <span className="font-mono text-sm text-paper/70">
                    {current.index} / {total}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-2" aria-hidden>
                {contactChannels.map((channel, index) => (
                  <span
                    key={channel.email}
                    className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
                      index <= active ? "bg-ink" : "bg-line"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
