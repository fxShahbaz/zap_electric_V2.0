"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { scooterById, seriesById, specRows } from "@/lib/content";
import {
  MIN_COMPARE,
  clearCompare,
  removeCompare,
  useCompareIds,
} from "@/lib/compare";

/**
 * The comparison itself, driven by the same selection as the dock.
 *
 * Within a series every specification is identical except the colours, so the
 * "hide identical rows" switch is not a nicety — without it two models from
 * one series look like a table of nineteen matching lines.
 */
export default function CompareTable() {
  const ids = useCompareIds();
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  const models = ids.map((id) => scooterById[id]).filter((m) => m !== undefined);

  if (!models.length) {
    return (
      <Empty
        title="Nothing selected yet"
        copy="Pick two or three models from the range and they will line up here, side by side."
      />
    );
  }

  // Every model yields the same rows in the same order, but look values up by
  // label rather than by index so a future series cannot silently misalign.
  const labels = specRows(models[0]).map((row) => row.label);
  const valuesByModel = models.map(
    (model) => new Map(specRows(model).map((row) => [row.label, row.value])),
  );

  const rows = labels.map((label) => {
    const values = valuesByModel.map((map) => map.get(label) ?? "—");
    const identical = values.every((value) => value === values[0]);
    return { label, values, identical };
  });

  const shown = onlyDifferences ? rows.filter((row) => !row.identical) : rows;
  const differences = rows.filter((row) => !row.identical).length;
  const short = models.length < MIN_COMPARE;
  // The empty "add a model" slot takes a column only while one model is picked.
  const columns = models.length + (short ? 1 : 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="lead text-sm">
          {short ? (
            <>
              One model selected.{" "}
              <Link href="/range" className="text-zap-ink underline underline-offset-4">
                Add another
              </Link>{" "}
              to compare.
            </>
          ) : (
            <>
              {models.length} models · {differences}{" "}
              {differences === 1 ? "difference" : "differences"}
            </>
          )}
        </p>

        <div className="flex items-center gap-5">
          {!short && differences > 0 ? (
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate">
              <input
                type="checkbox"
                checked={onlyDifferences}
                onChange={(event) => setOnlyDifferences(event.target.checked)}
                className="h-4 w-4 accent-[var(--color-zap-ink)]"
              />
              Hide identical rows
            </label>
          ) : null}

          <button
            type="button"
            onClick={clearCompare}
            className="text-sm text-slate underline underline-offset-4 transition-colors hover:text-ink"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* A grid with table roles rather than a <table>: the name row has to
          stick under the site header, and sticky cannot work inside the
          sideways-scrolling box a wide table needs on a phone. Here nothing
          scrolls sideways — on a phone each spec's label takes its own line
          and the values sit side by side beneath it. */}
      <div
        role="table"
        aria-label="Specifications compared across the selected Zap models"
        className="mt-10"
        style={{ ["--cols" as string]: columns }}
      >
        {/* Photos scroll away; the names below them stay. Every row is a
            direct child of the table, because a sticky row only sticks
            within its parent. */}
        <div role="row" className={rowGrid}>
          <div role="presentation" className="hidden md:block" />
          {models.map((model) => (
            <div key={model.id} role="presentation" className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-mist md:rounded-xl">
                <Image
                  src={model.image}
                  alt={model.imageAlt}
                  fill
                  sizes="(max-width: 768px) 45vw, 25vw"
                  className="object-cover object-[center_30%]"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCompare(model.id)}
                aria-label={`Remove Zap ${model.name}`}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-paper/90 text-lg leading-none text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-paper md:right-2 md:top-2"
              >
                <span aria-hidden>&times;</span>
              </button>
            </div>
          ))}
          {short ? (
            <Link
              href="/#range"
              className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-line text-center text-sm text-slate transition-colors hover:border-ink hover:text-ink md:rounded-xl"
            >
              + Add a model
            </Link>
          ) : null}
        </div>

        <div
          role="row"
          className="sticky top-16 z-20 -mx-5 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur-xl md:top-20 md:-mx-8 md:px-8 md:py-4 xl:-mx-12 xl:px-12"
        >
          <div className={rowGrid}>
            <div role="columnheader" className="hidden self-end md:block">
              <span className="text-sm text-ash">Specification</span>
            </div>
            {models.map((model) => (
              <div key={model.id} role="columnheader" className="min-w-0">
                <Link href={`/range/${model.id}`} className="group block">
                  <span className="title block truncate text-base group-hover:text-zap-ink md:text-lg">
                    Zap {model.name}
                  </span>
                  <span className="lead block truncate text-xs md:text-sm">
                    {seriesById[model.series].name}
                  </span>
                </Link>
              </div>
            ))}
            {short ? <div role="presentation" /> : null}
          </div>
        </div>

        {shown.map((row) => (
          <div
            key={row.label}
            role="row"
            className={`${rowGrid} border-b border-line py-4 md:py-5`}
          >
            <div
              role="rowheader"
              className="col-span-full mb-2 flex items-center gap-2 md:col-span-1 md:mb-0"
            >
              {!row.identical ? (
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-zap" />
              ) : null}
              <span className="text-xs text-ash md:text-sm">{row.label}</span>
              {!row.identical ? <span className="sr-only">(differs between models)</span> : null}
            </div>

            {row.values.map((value, i) => (
              <div
                key={models[i].id}
                role="cell"
                className={`min-w-0 whitespace-pre-line break-words text-sm md:text-[0.9375rem] ${
                  row.identical ? "text-slate" : "text-ink"
                }`}
              >
                {value}
              </div>
            ))}
            {short ? <div role="presentation" /> : null}
          </div>
        ))}
      </div>

      {onlyDifferences && !shown.length ? (
        <p className="lead mt-10">
          These models share every line of the specification — only the colours
          they come in differ, and you have hidden the rows that match.
        </p>
      ) : null}
    </div>
  );
}

/** Same columns on every row, from --cols on the table: values only on a
 *  phone (the label spans the full width above them), label first from md. */
const rowGrid =
  "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-3 sm:gap-x-5 md:grid-cols-[10rem_repeat(var(--cols),minmax(0,1fr))] md:gap-x-6";

function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="max-w-md">
      <h2 className="title text-2xl">{title}</h2>
      <p className="lead mt-4">{copy}</p>
      <Link
        href="/range"
        className="mt-8 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-zap-ink"
      >
        See the range
      </Link>
    </div>
  );
}
