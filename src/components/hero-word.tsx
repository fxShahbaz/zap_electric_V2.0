"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** "everyday" comes first and last round, so the still frame reads as the line. */
const words = ["everyday", "school-run", "market-day", "small-town"];

/** How long each word holds, and how long it takes to leave. */
const holdMs = 2600;
const leaveMs = 420;

/**
 * The swapping word in the hero line — "for ___ India".
 *
 * Letters rise in one after another, a highlighter stroke of Zap green swipes
 * in behind them, and on the way out both lift and wipe away. The slot's
 * width eases between words, so "India" slides over rather than jumping.
 *
 * Purely visual: the <h1> carries the plain sentence for screen readers. With
 * reduced motion it is just "everyday", highlighted, and still.
 */
export default function HeroWord() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const sizer = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let swap: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      // Hidden tab: skip a beat rather than queue up swaps.
      if (document.hidden) return;
      setLeaving(true);
      swap = setTimeout(() => {
        setIndex((current) => (current + 1) % words.length);
        setLeaving(false);
      }, leaveMs);
    }, holdMs + leaveMs);

    return () => {
      clearInterval(cycle);
      clearTimeout(swap);
    };
  }, []);

  // Measure the incoming word before paint, and again when fonts or the
  // viewport change the type size.
  useLayoutEffect(() => {
    const measure = () => {
      if (sizer.current) setWidth(sizer.current.getBoundingClientRect().width);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  const word = words[index];

  return (
    <span
      aria-hidden
      className="hero-word relative inline-block whitespace-nowrap align-bottom transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={width ? { width } : undefined}
    >
      {/* Sets the width: the current word, invisible. */}
      <span ref={sizer} className="invisible absolute left-0 top-0 whitespace-nowrap">
        {word}
      </span>

      <span className="hero-word-mark" data-leaving={leaving || undefined} key={`mark-${index}`} />

      <span className="relative" data-leaving={leaving || undefined}>
        {Array.from(word).map((letter, i) => (
          <span
            key={`${index}-${i}`}
            className="hero-word-letter"
            style={{ ["--i" as string]: i }}
          >
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}
