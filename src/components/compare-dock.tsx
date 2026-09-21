"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scooterById } from "@/lib/content";
import {
  MIN_COMPARE,
  clearCompare,
  removeCompare,
  useCompareIds,
} from "@/lib/compare";

/**
 * The floating dock: what is currently selected, and the way through to the
 * table. Mounted once in the root layout so the selection follows you from the
 * range to a model page and back.
 *
 * It hides itself when nothing is selected and on /compare, where the table
 * itself already shows the same models.
 */
export default function CompareDock() {
  const pathname = usePathname();
  const ids = useCompareIds();

  const models = ids.map((id) => scooterById[id]).filter((m) => m !== undefined);
  if (!models.length || pathname === "/compare") return null;

  const ready = models.length >= MIN_COMPARE;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-5 pl-4 pr-[5.5rem] sm:px-4 sm:pb-6"
      role="region"
      aria-label="Comparison tray"
    >
      <div className="pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-3 rounded-full bg-ink py-2 pl-2.5 pr-2 text-paper shadow-[0_12px_40px_rgba(16,19,16,0.28)] sm:gap-4">
        <div className="flex items-center gap-3">
          {/* Phones get the count and the buttons only; at that width the
              thumbnails were being squeezed into slivers. */}
          <ul className="hidden shrink-0 items-center gap-1.5 sm:flex">
            {models.map((model) => (
              <li key={model.id} className="relative shrink-0">
                <Image
                  src={model.image}
                  alt=""
                  width={96}
                  height={72}
                  className="h-9 w-9 max-w-none rounded-full object-cover object-[center_30%]"
                />
                <button
                  type="button"
                  onClick={() => removeCompare(model.id)}
                  aria-label={`Remove Zap ${model.name}`}
                  className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-paper text-xs leading-none text-ink transition-colors hover:bg-zap"
                >
                  <span aria-hidden>&times;</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="whitespace-nowrap pl-3 text-sm text-paper/60 sm:pl-0">
            {ready ? (
              <>
                {models.length} selected
              </>
            ) : (
              <>Add one more</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearCompare}
            className="rounded-full px-3 py-2 text-sm text-paper/60 transition-colors hover:text-paper"
          >
            Clear
          </button>

          {ready ? (
            <Link
              href="/compare"
              className="rounded-full bg-zap px-5 py-2 text-sm text-ink transition-colors hover:bg-paper"
            >
              Compare
            </Link>
          ) : (
            <span
              aria-disabled
              className="cursor-not-allowed rounded-full bg-paper/15 px-5 py-2 text-sm text-paper/40"
            >
              Compare
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
