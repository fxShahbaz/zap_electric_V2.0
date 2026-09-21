/**
 * The compare selection: which models the visitor has put side by side.
 *
 * It outlives a page view (you pick a model, read its page, pick another), so
 * it lives in localStorage rather than in React state, and it is shared by the
 * card buttons, the dock and the table through `useSyncExternalStore`.
 *
 * Two rules the UI depends on: at most three, and only ids that are actually
 * in the range — a stale id from an older build is dropped on read rather than
 * rendering an empty column.
 */

import { useSyncExternalStore } from "react";
import { scooterById } from "@/lib/content";

export const MAX_COMPARE = 3;
/** Below this a comparison has nothing to compare, so the button stays off. */
export const MIN_COMPARE = 2;

const storageKey = "zap:compare";
const listeners = new Set<() => void>();

/** The snapshot. Only ever replaced, never mutated, so React can compare it. */
let ids: string[] = [];
const empty: string[] = [];
let hydrated = false;

/** localStorage throws in private modes and with cookies blocked; never fatal. */
function read(): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return empty;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return empty;
    const clean = parsed.filter(
      (id): id is string => typeof id === "string" && Boolean(scooterById[id]),
    );
    return clean.length ? clean.slice(0, MAX_COMPARE) : empty;
  } catch {
    return empty;
  }
}

function publish(next: string[]) {
  ids = next;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    /* the selection still works for this page view */
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  // First subscriber runs after hydration, so the server and the first client
  // render both see an empty list and React has nothing to complain about.
  if (!hydrated) {
    hydrated = true;
    ids = read();
  }

  listeners.add(listener);

  // Another tab changed the selection.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    ids = read();
    for (const l of listeners) l();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCompareIds(): string[] {
  return useSyncExternalStore(
    subscribe,
    () => ids,
    () => empty,
  );
}

/** Adds if there is room, removes if already there. Unknown ids are ignored. */
export function toggleCompare(id: string) {
  if (!scooterById[id]) return;
  if (ids.includes(id)) {
    publish(ids.filter((item) => item !== id));
  } else if (ids.length < MAX_COMPARE) {
    publish([...ids, id]);
  }
}

export function removeCompare(id: string) {
  if (!ids.includes(id)) return;
  publish(ids.filter((item) => item !== id));
}

export function clearCompare() {
  if (ids.length) publish(empty);
}
