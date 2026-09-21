"use client";

import { useEffect, useRef } from "react";

/** Below this speed (px per 60fps frame) the page counts as still. */
const deadZone = 0.75;
/** Speed at which the blur is at full strength. */
const fullAt = 10;
/** Per-frame easing towards the target: quick to arrive, quicker to leave. */
const attack = 0.35;
const release = 0.45;

/**
 * A soft blur along the bottom edge of the screen while the page is moving.
 *
 * Driven by scroll *speed*, measured every frame, not by scroll events: Lenis
 * keeps firing those for about a second after you let go while it eases to a
 * stop, so a "stopped scrolling" timer would hang on through the whole tail.
 * Speed falls away as soon as the motion does, and so does the blur.
 *
 * Strength is written straight to a CSS variable, so there is no React render
 * per frame, and the loop only runs while there is something to animate.
 *
 * Each layer fades *itself*: opacity on the wrapper would make it a backdrop
 * root, and the layers inside would then blur nothing at all until it reached
 * full opacity — which is what made an earlier version pop rather than blend.
 */
export default function ScrollBlur() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let lastY = window.scrollY;
    let lastTime = 0;
    let strength = 0;

    const tick = (time: number) => {
      const y = window.scrollY;
      const elapsed = lastTime ? time - lastTime : 16.7;
      const speed = (Math.abs(y - lastY) / Math.max(elapsed, 1)) * 16.7;
      lastY = y;
      lastTime = time;

      const target = Math.min(1, Math.max(0, (speed - deadZone) / (fullAt - deadZone)));
      strength += (target - strength) * (target > strength ? attack : release);
      if (strength < 0.01 && target === 0) strength = 0;

      node.style.setProperty("--strength", strength.toFixed(3));

      if (strength === 0) {
        frame = 0;
        lastTime = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-28 [--strength:0] md:h-36"
    >
      <div className="scroll-blur-layer scroll-blur-1" />
      <div className="scroll-blur-layer scroll-blur-2" />
      <div className="scroll-blur-layer scroll-blur-3" />
      <div className="scroll-blur-layer scroll-blur-4" />
    </div>
  );
}
