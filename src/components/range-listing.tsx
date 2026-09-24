"use client";

import { useRef, useState } from "react";
import { scooters, series, type SeriesId } from "@/lib/content";
import ModelCard from "@/components/model-card";

type Filter = "all" | SeriesId;

/**
 * Every model in one grid, with a filter bar that stays under the header.
 * Filtering hides cards rather than unmounting them: the reveal observer only
 * learns about [data-reveal] elements when the page loads, so a card mounted
 * later would stay invisible. Hidden ones reveal when shown.
 */
export default function RangeListing() {
  const [filter, setFilter] = useState<Filter>("all");
  const top = useRef<HTMLDivElement>(null);

  const choose = (next: Filter) => {
    setFilter(next);
    // If the bar is stuck, the list above it just changed height; start the
    // new list from its top rather than wherever the old one left the page.
    const bar = top.current;
    if (bar && bar.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: bar.getBoundingClientRect().top + window.scrollY - 112 });
    }
  };

  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All models", count: scooters.length },
    ...series.map((platform) => ({
      value: platform.id,
      label: `${platform.tag} km`,
      count: scooters.filter((model) => model.series === platform.id).length,
    })),
  ];

  return (
    <div ref={top}>
      <div className="sticky top-24 z-30 border-y border-line bg-paper/85 backdrop-blur-xl md:top-28">
        <div className="shell flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          <span className="mr-2 hidden shrink-0 text-sm text-ash sm:inline">Range</span>
          <div role="group" aria-label="Filter by range" className="flex gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() => choose(option.value)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  filter === option.value
                    ? "bg-zap-ink text-paper"
                    : "border border-line text-ink hover:border-zap-ink"
                }`}
              >
                {option.label}
                <span
                  className={`font-mono text-xs ${
                    filter === option.value ? "text-paper/60" : "text-ash"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shell py-16 md:py-24">
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {scooters.map((model, index) => (
            <ModelCard
              key={model.id}
              model={model}
              index={index}
              detailed
              hidden={filter !== "all" && model.series !== filter}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
