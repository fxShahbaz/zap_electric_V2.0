"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { registerScroller } from "@/lib/scroll-lock";

/**
 * Lenis drives the page, GSAP's ticker drives Lenis, and ScrollTrigger reads
 * from Lenis — one clock, so pinned sections never drift from the smoothing.
 * Also runs the IntersectionObserver that flips [data-reveal] elements on,
 * which lets every non-scrubbed section stay a server component.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    const unregister = registerScroller(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchors ride the same smoothing.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      unregister();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Re-run per route: a client-side navigation swaps in a fresh set of
  // [data-reveal] nodes that the previous observer knows nothing about, and
  // Lenis keeps its own scroll position across the transition.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis && typeof window !== "undefined" && !window.location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }

    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    items.forEach((item) => {
      if (item.getAttribute("data-shown") !== "true") observer.observe(item);
    });

    ScrollTrigger.refresh();

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
