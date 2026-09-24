"use client";

import { useEffect, useState } from "react";
import ChargeField from "@/components/charge-field";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const SEEN = "zap-preloaded";
/** However the animation goes, the page is never held longer than this. */
const LIMIT = 9_000;

type State = "charging" | "leaving" | "done";

// One overlay per page, so the hold is module state rather than a ref.
let held = false;

function hold() {
  held = true;
  document.documentElement.setAttribute("data-preloading", "");
  lockScroll();
}

function release() {
  if (!held) return;
  held = false;
  document.documentElement.removeAttribute("data-preloading");
  unlockScroll();
  try {
    sessionStorage.setItem(SEEN, "1");
  } catch {}
}

/**
 * The wordmark charging to 100% over the home page, once per session.
 *
 * While it is up the page is locked and the hero's entrance animations are
 * paused (globals.css, [data-preloading]); they resume as the overlay lifts,
 * so the hero arrives from behind it. Reduced motion skips it altogether.
 */
export default function Preloader() {
  const [state, setState] = useState<State>("charging");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = setTimeout(() => setState("done"), 0);
      return () => clearTimeout(skip);
    }

    hold();
    const limit = setTimeout(() => setState("leaving"), LIMIT);
    return () => {
      clearTimeout(limit);
      release();
    };
  }, []);

  useEffect(() => {
    if (state === "leaving") document.documentElement.removeAttribute("data-preloading");
    if (state === "done") release();
  }, [state]);

  if (state === "done") return null;

  return (
    <div
      aria-hidden
      data-leaving={state === "leaving" || undefined}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && state === "leaving") setState("done");
      }}
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-paper px-6"
    >
      <div className="w-full max-w-4xl">
        <ChargeField
          mode="once"
          tone="paper"
          onFull={() => setTimeout(() => setState("leaving"), 1_100)}
        />
      </div>
    </div>
  );
}
