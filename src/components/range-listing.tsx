"use client";

import { useRef, useState } from "react";
import { scooters, series, type SeriesId } from "@/lib/content";
import ModelCard from "@/components/model-card";

type Filter = "all" | SeriesId;

/** The spec lines that differ by series; everything shared is further down. */
const seriesRows = [
  { label: "Range", get: (s: (typeof series)[number]) => s.range },
  { label: "Motor", get: (s: (typeof series)[number]) => s.motor },
  { label: "Brakes", get: (s: (typeof series)[number]) => s.brakes },
  { label: "Tyres", get: (s: (typeof series)[number]) => s.tyreSize },
  { label: "Battery", get: (s: (typeof series)[number]) => s.battery.join(" · ") },
];

/**
 * Every model, grouped by series, with a filter bar that stays under the
 * header. Filtering hides sections rather than unmounting them: the reveal
 * observer only learns about [data-reveal] elements when the page loads, so a
 * card mounted later would stay invisible. Hidden ones reveal when shown.
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
      window.scrollTo({ top: bar.getBoundingClientRect().top + window.scrollY - 80 });
    }
  };

  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All models", count: scooters.length },
    ...series.map((platform) => ({
      value: platform.id,
      label: platform.name,
      count: scooters.filter((model) => model.series === platform.id).length,
    })),
  ];

  return (
    <div ref={top}>
      <div className="sticky top-16 z-30 border-y border-line bg-paper/85 backdrop-blur-xl md:top-20">
        <div className="shell flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          <span className="mr-2 hidden shrink-0 text-sm text-ash sm:inline">Show</span>
          <div role="group" aria-label="Filter by series" className="flex gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() => choose(option.value)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  filter === option.value
                    ? "bg-ink text-paper"
                    : "border border-line text-ink hover:border-ink"
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

      <div className="shell">
        {series.map((platform, position) => {
          const models = scooters.filter((model) => model.series === platform.id);
          const shown = filter === "all" || filter === platform.id;
          return (
            <section
              key={platform.id}
              hidden={!shown}
              aria-labelledby={`series-${platform.id}`}
              className={`py-16 md:py-24 ${position > 0 && filter === "all" ? "border-t border-line" : ""}`}
            >
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-44">
                    <p className="font-mono text-sm text-zap-ink" data-reveal>
                      {platform.tag} km
                    </p>
                    <h2
                      id={`series-${platform.id}`}
                      className="title mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)]"
                      data-reveal
                    >
                      {platform.name}
                    </h2>
                    <p className="lead mt-4 max-w-sm" data-reveal>
                      {platform.blurb}
                    </p>

                    <dl className="mt-8" data-reveal>
                      {seriesRows.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-line py-3 text-sm"
                        >
                          <dt className="text-ash">{row.label}</dt>
                          <dd className="text-ink">{row.get(platform)}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="lead mt-6 text-sm" data-reveal>
                      {models.length} {models.length === 1 ? "model" : "models"} on this
                      platform.
                    </p>
                  </div>
                </div>

                <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:col-span-8">
                  {models.map((model, index) => (
                    <ModelCard key={model.id} model={model} index={index % 2} detailed />
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
