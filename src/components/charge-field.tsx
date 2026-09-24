"use client";

import { useEffect, useRef } from "react";

/**
 * The footer wordmark as a battery that is charging.
 *
 * Drawn on a canvas that sits inside `.footer-mark`, so the logo mask clips
 * every pixel of it to the letters — nothing here needs to know their shape.
 *
 *  - Charge: a green liquid that fills to a level which rises, holds, and
 *    drains on a slow cycle, with a moving, doubled-sine surface.
 *  - Current: glowing dust that streams left to right. Inside the liquid it is
 *    bright, quick and rises like bubbles; above it, it is faint and slow.
 *
 * Under the P's bowl — the one empty patch in the logo's box — sits a readout:
 * a bolt and a percentage that track the liquid. It lives outside the masked
 * element (the mask would cut it to the letters), and the draw loop writes to
 * it directly, only when the whole-number value changes, so React never
 * re-renders per frame.
 *
 * It only runs while on screen and while the tab is visible. Under
 * prefers-reduced-motion it paints one still frame — half charged — and stops.
 *
 * `mode="once"` is the home page preloader: one climb from empty to full,
 * `onFull` when the readout hits 100, and the field keeps running so the
 * overlay has something alive under it while it lifts. `tone="paper"` is the
 * same thing on a white surface.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
};

const CYCLE = 11_000; // one charge/drain, ms
const ONCE = 4_800; // the preloader's climb to full, ms

const LOW = 0.18;
const FULL = 0.88;

type Phase = "charging" | "full" | "draining";

/** Level (0 empty … 1 full of the box) over the cycle: ease up, hold, drain. */
function chargeState(t: number): { level: number; phase: Phase } {
  const p = (t % CYCLE) / CYCLE;
  const ease = (x: number) => x * x * (3 - 2 * x);
  if (p < 0.62) return { level: LOW + (FULL - LOW) * ease(p / 0.62), phase: "charging" };
  if (p < 0.8) return { level: FULL, phase: "full" };
  return { level: FULL - (FULL - LOW) * ease((p - 0.8) / 0.2), phase: "draining" };
}

/** Once: ease up from empty to full and stay there. */
function chargeOnce(elapsed: number): { level: number; phase: Phase } {
  const p = Math.min(1, elapsed / ONCE);
  // Slow start, steady middle, gentle landing — the number should be
  // readable as it climbs, not a blur that lands on 100.
  const ease = p * p * (3 - 2 * p);
  return { level: LOW + (FULL - LOW) * ease, phase: p < 1 ? "charging" : "full" };
}

/** The level the letters show, as the percentage a battery would. */
const toPercent = (level: number) =>
  Math.round(8 + 92 * Math.min(1, Math.max(0, (level - LOW) / (FULL - LOW))));

const phaseLabel: Record<Phase, string> = {
  charging: "Charging",
  full: "Fully charged",
  draining: "On the road",
};

/** Pre-rendered glow sprite, so each particle is one drawImage. */
function makeGlow(colour: string) {
  const size = 32;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${colour}, 1)`);
  grad.addColorStop(0.25, `rgba(${colour}, 0.55)`);
  grad.addColorStop(1, `rgba(${colour}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function ChargeField({
  mode = "loop",
  tone = "ink",
  onFull,
}: {
  mode?: "loop" | "once";
  tone?: "ink" | "paper";
  onFull?: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const readout = useRef<HTMLDivElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const full = useRef(onFull);
  useEffect(() => {
    full.current = onFull;
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const once = mode === "once";
    const t0 = performance.now();
    let reachedFull = false;
    const hot = makeGlow("190, 255, 196");
    const dust = makeGlow("255, 255, 255");

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let shownPercent = -1;
    let shownPhase = "";

    // Straight to the DOM, and only on change: the loop runs at 60fps, the
    // number changes a few times a second.
    const report = (level: number, cyclePhase: Phase) => {
      const value = toPercent(level);
      // The fill eases in, so the number rounds up to 100 a moment before the
      // cycle leaves "charging" — and a draining battery still reads 100 for
      // a beat. At 100 it is full: steady bolt, no pulse, whatever the cycle.
      const phase: Phase = value >= 100 ? "full" : cyclePhase;
      if (value !== shownPercent && percent.current) {
        shownPercent = value;
        percent.current.textContent = `${value}%`;
      }
      if (phase !== shownPhase && readout.current && label.current) {
        shownPhase = phase;
        readout.current.dataset.phase = phase;
        label.current.textContent = phaseLabel[phase];
      }
      if (once && value >= 100 && !reachedFull) {
        reachedFull = true;
        full.current?.();
      }
    };

    const spawn = (anywhere: boolean): Particle => ({
      x: anywhere ? Math.random() * w : -10,
      y: Math.random() * h,
      vx: 18 + Math.random() * 42, // px/s, rightward: the current
      vy: -(4 + Math.random() * 12),
      r: 0.6 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density follows area, so a phone is not a snowstorm.
      const count = Math.round(Math.min(220, Math.max(60, (w * h) / 2600)));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const surfaceAt = (x: number, t: number, level: number) => {
      const base = h * (1 - level);
      return (
        base +
        Math.sin(x * 0.012 + t * 0.0016) * h * 0.022 +
        Math.sin(x * 0.027 - t * 0.0023) * h * 0.012
      );
    };

    const draw = (t: number, dt: number) => {
      // Not laid out yet: every gradient below would be fed NaN. The resize
      // observer paints again once the canvas has a size.
      if (!w || !h) return;
      const { level, phase } = still
        ? { level: once ? FULL : 0.55, phase: (once ? "full" : "charging") as Phase }
        : once
          ? chargeOnce(t - t0)
          : chargeState(t);
      report(level, phase);
      ctx.clearRect(0, 0, w, h);

      // --- the charge ------------------------------------------------------
      const base = h * (1 - level);
      const front = (x: number) => surfaceAt(x, t, level);
      // A second, paler wave just behind the first, out of phase: depth.
      const behind = (x: number) => surfaceAt(x + w * 0.37, t * 0.82 + 1700, level) - h * 0.02;

      const liquid = (surface: (x: number) => number) => {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, surface(x));
        ctx.lineTo(w, h);
        ctx.closePath();
      };

      liquid(behind);
      ctx.fillStyle = "rgba(150, 236, 162, 0.22)";
      ctx.fill();

      // Bright just under the surface, emerald through the body, deep at the
      // bottom — lit from above, the way a coloured liquid in glass reads.
      const body = ctx.createLinearGradient(0, base - h * 0.04, 0, h);
      body.addColorStop(0, "rgba(176, 252, 184, 0.96)");
      body.addColorStop(0.1, "rgba(112, 208, 124, 0.93)");
      body.addColorStop(0.55, "rgba(52, 146, 78, 0.92)");
      body.addColorStop(1, "rgba(12, 66, 38, 0.96)");
      liquid(front);
      ctx.fillStyle = body;
      ctx.fill();

      // Caustics: soft light drifting through the body, kept inside it.
      ctx.save();
      ctx.clip();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 5; i++) {
        const cx = ((t * (0.012 + i * 0.004) + i * w * 0.23) % (w * 1.3)) - w * 0.15;
        const cy = base + (h - base) * (0.3 + 0.12 * Math.sin(t * 0.0007 + i * 1.9));
        const r = h * (0.22 + 0.06 * i);
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        glow.addColorStop(0, "rgba(190, 255, 200, 0.14)");
        glow.addColorStop(1, "rgba(190, 255, 200, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
      ctx.restore();

      // The meniscus: a glowing edge, then a fine bright line on top of it.
      const edge = () => {
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const y = front(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };
      ctx.save();
      edge();
      ctx.shadowColor = "rgba(140, 255, 160, 0.9)";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "rgba(170, 255, 185, 0.7)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
      edge();
      ctx.strokeStyle = "rgba(240, 255, 242, 0.95)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glass: a slow vertical glint across the whole tube, full or empty.
      const gx = ((t * 0.05) % (w * 2)) - w * 0.5;
      const glint = ctx.createLinearGradient(gx - w * 0.08, 0, gx + w * 0.08, 0);
      glint.addColorStop(0, "rgba(255, 255, 255, 0)");
      glint.addColorStop(0.5, "rgba(255, 255, 255, 0.07)");
      glint.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glint;
      ctx.fillRect(0, 0, w, h);

      // --- the current -----------------------------------------------------
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        const inCharge = p.y > surfaceAt(p.x, t, level);
        if (!still) {
          const speed = inCharge ? 1.9 : 0.6;
          p.x += p.vx * speed * dt;
          p.y += (p.vy * (inCharge ? 1.6 : 0.5) + Math.sin(t * 0.002 + p.phase) * 6) * dt;
          if (p.x > w + 10) Object.assign(p, spawn(false));
          if (p.y < -10) p.y = h + 5;
          if (p.y > h + 10) p.y = -5;
        }
        const flicker = 0.65 + 0.35 * Math.sin(t * 0.006 + p.phase);
        const size = p.r * (inCharge ? 7 : 4.5);
        ctx.globalAlpha = (inCharge ? 0.95 : 0.22) * flicker;
        ctx.drawImage(inCharge ? hot : dust, p.x - size / 2, p.y - size / 2, size, size);

        // Quick ones in the charge leave a short trail — the "running" bit.
        if (inCharge && p.vx > 45 && !still) {
          ctx.globalAlpha = 0.35 * flicker;
          ctx.strokeStyle = "rgb(190, 255, 196)";
          ctx.lineWidth = p.r * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 0.12, p.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(performance.now(), 0);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now(), 0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mode]);

  const light = tone === "paper";

  return (
    <div className="charge relative aspect-[1147/379] w-full" data-tone={tone}>
      <div className="footer-mark">
        <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />
      </div>

      {/* Under the P's bowl: x 76–100%, y 64–100% of the logo box is empty. */}
      <div
        ref={readout}
        data-phase="charging"
        className="charge-readout absolute left-[77%] top-[67%] flex items-center gap-[0.9cqw]"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="charge-bolt h-[4.2cqw] w-[4.2cqw] shrink-0">
          <path
            d="M13.2 2.5 5.4 13.1h5.3l-1.2 8.4 7.9-10.9h-5.4l1.2-8.1z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex flex-col">
          <span
            ref={percent}
            className={`title text-[5.2cqw] leading-none tabular-nums ${light ? "text-ink" : "text-paper"}`}
          >
            8%
          </span>
          <span
            ref={label}
            className={`mt-[0.5cqw] text-[max(0.7rem,1.05cqw)] leading-none ${light ? "text-slate" : "text-paper/50"}`}
          >
            Charging
          </span>
        </div>
      </div>
    </div>
  );
}
