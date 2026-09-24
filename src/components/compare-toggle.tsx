"use client";

import { MAX_COMPARE, toggleCompare, useCompareIds } from "@/lib/compare";

/**
 * Add/remove one model. Sits on the range cards and on each model page.
 *
 * On a card it sits beside the name as a sibling of the <Link>, never a child — a button inside an
 * anchor is invalid, and nesting it would swallow the click.
 */
export default function CompareToggle({
  id,
  name,
  className = "",
  tone = "overlay",
}: {
  id: string;
  name: string;
  className?: string;
  /** "overlay" sits on a photo; "inline" sits on the page background. */
  tone?: "overlay" | "inline";
}) {
  const ids = useCompareIds();
  const selected = ids.includes(id);
  const full = !selected && ids.length >= MAX_COMPARE;

  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors duration-200 disabled:cursor-not-allowed";

  const look = selected
    ? "bg-zap-ink text-paper hover:bg-ink"
    : tone === "overlay"
      ? "bg-paper/85 text-zap-ink backdrop-blur-sm hover:bg-paper disabled:bg-paper/50 disabled:text-ash"
      : "bg-zap text-ink hover:bg-zap-ink hover:text-paper disabled:bg-mist disabled:text-ash";

  return (
    <button
      type="button"
      onClick={() => toggleCompare(id)}
      disabled={full}
      aria-pressed={selected}
      aria-label={
        selected ? `Remove Zap ${name} from comparison` : `Compare Zap ${name}`
      }
      title={full ? `You can compare up to ${MAX_COMPARE} models` : undefined}
      className={`${base} ${look} ${className}`}
    >
      <span aria-hidden className="text-base leading-none">
        {selected ? "✓" : "+"}
      </span>
      {selected ? "Added" : "Compare"}
    </button>
  );
}
