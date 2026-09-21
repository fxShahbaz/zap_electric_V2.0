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

      {/* Wide on purpose: on a phone this scrolls sideways with the spec
          column pinned, rather than squeezing values to two words a line. */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[46rem] table-fixed border-collapse text-left">
          <caption className="sr-only">
            Specifications compared across the selected Zap models
          </caption>

          {/* Fixed layout, so the label column cannot help itself to a third
              of a phone screen and squeeze the values into two words a line. */}
          <colgroup>
            <col className="w-36" />
            {models.map((model) => (
              <col key={model.id} />
            ))}
            {short ? <col /> : null}
          </colgroup>

          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-paper pb-6 pr-6 align-bottom">
                <span className="text-sm text-ash">Specification</span>
              </th>

              {models.map((model) => (
                <th
                  key={model.id}
                  scope="col"
                  className="bg-paper pb-6 pr-6 align-bottom font-normal"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-mist">
                    <Image
                      src={model.image}
                      alt={model.imageAlt}
                      fill
                      sizes="(max-width: 640px) 12rem, 15rem"
                      className="object-cover object-[center_30%]"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompare(model.id)}
                      aria-label={`Remove Zap ${model.name}`}
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-paper/90 text-lg leading-none text-ink backdrop-blur-sm transition-colors hover:bg-paper"
                    >
                      <span aria-hidden>&times;</span>
                    </button>
                  </div>

                  <Link href={`/range/${model.id}`} className="group mt-4 block">
                    <span className="title block text-lg group-hover:text-zap-ink">
                      Zap {model.name}
                    </span>
                    <span className="lead mt-1 block text-sm">
                      {seriesById[model.series].name}
                    </span>
                  </Link>
                </th>
              ))}

              {short ? (
                <th scope="col" className="bg-paper pb-6 align-bottom font-normal">
                  <Link
                    href="/range"
                    className="grid aspect-[4/3] w-full place-items-center rounded-xl border border-dashed border-line text-sm text-slate transition-colors hover:border-ink hover:text-ink"
                  >
                    + Add a model
                  </Link>
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {shown.map((row) => (
              <tr key={row.label} className="align-top">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-paper py-4 pr-6 font-normal"
                >
                  <span className="text-sm text-ash">{row.label}</span>
                </th>

                {row.values.map((value, i) => (
                  <td
                    key={models[i].id}
                    className={`whitespace-pre-line border-t border-line py-4 pr-6 text-[0.9375rem] ${
                      row.identical ? "text-slate" : "text-ink"
                    }`}
                  >
                    {value}
                    {!row.identical && i === 0 ? (
                      <span className="sr-only"> (differs between models)</span>
                    ) : null}
                  </td>
                ))}

                {short ? (
                  <td className="border-t border-line" />
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
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
