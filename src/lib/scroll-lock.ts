/**
 * Lenis drives the page, so a modal cannot just set `overflow: hidden` and
 * expect the background to hold still — the smoothing has to be told to stop.
 *
 * SmoothScroll registers its instance here; anything that opens over the page
 * calls lockScroll/unlockScroll. Counted, so two overlays cannot unlock each
 * other. Under prefers-reduced-motion there is no Lenis at all, and the plain
 * overflow lock is the whole job.
 */

type Scroller = { stop: () => void; start: () => void };

let scroller: Scroller | null = null;
let depth = 0;

/** Returns the matching unregister, for the effect cleanup. */
export function registerScroller(instance: Scroller): () => void {
  scroller = instance;
  return () => {
    if (scroller === instance) scroller = null;
  };
}

export function lockScroll() {
  depth += 1;
  if (depth > 1) return;

  scroller?.stop();

  // Taking the scrollbar away shifts the page left; pay it back as padding.
  const gap = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  if (gap > 0) document.body.style.paddingRight = `${gap}px`;
}

export function unlockScroll() {
  depth = Math.max(0, depth - 1);
  if (depth > 0) return;

  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  scroller?.start();
}
