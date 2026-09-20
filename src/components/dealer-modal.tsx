"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import DealerForm from "@/components/dealer-form";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/**
 * The dealer invitation, offered once on arrival.
 *
 * A native <dialog> rather than a hand-rolled overlay: the browser gives us the
 * top layer, the focus trap, Escape, and focus returned to where it was. We add
 * the backdrop click, and the Lenis scroll lock.
 *
 * It asks once. Once shown it is remembered, so it never interrupts the same
 * visitor twice, and it never appears on /dealers — the form is already there.
 */

const storageKey = "zap:dealer-invite";
const openDelay = 1400;

/** localStorage throws in private modes and with cookies blocked; never fatal. */
function alreadyAsked() {
  try {
    return window.localStorage.getItem(storageKey) === "asked";
  } catch {
    return false;
  }
}

function rememberAsked() {
  try {
    window.localStorage.setItem(storageKey, "asked");
  } catch {
    /* asking twice is a smaller problem than throwing here */
  }
}

export default function DealerModal() {
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const onDealersPage = pathname === "/dealers";

  useEffect(() => {
    if (onDealersPage || alreadyAsked()) return;

    const timer = window.setTimeout(() => {
      const dialog = ref.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      lockScroll();
      rememberAsked();
    }, openDelay);

    return () => window.clearTimeout(timer);
  }, [onDealersPage, pathname]);

  // Fires for every route out: Escape, the close button, and the backdrop.
  const onClose = useCallback(() => unlockScroll(), []);

  const close = useCallback(() => ref.current?.close(), []);

  // A click landing on the dialog itself is a click on the backdrop; the
  // content sits in a child, so anything inside stops here.
  const onBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === ref.current) ref.current?.close();
  }, []);

  if (onDealersPage) return null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={onBackdropClick}
      aria-labelledby="dealer-modal-title"
      className="invite m-auto w-[min(38rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-visible rounded-2xl bg-paper p-0 text-ink"
    >
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex items-start justify-between gap-6">
          <h2 id="dealer-modal-title" className="title text-[clamp(1.5rem,3.2vw,2rem)]">
            Sell Zap in your city
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="-mr-2 -mt-1 shrink-0 rounded-full p-2 text-2xl leading-none text-ash transition-colors hover:text-ink"
          >
            &times;
          </button>
        </div>

        <p className="lead mt-3 text-[0.9375rem]">
          We are appointing dealers across India. Tell us your city and we will
          tell you whether it is open.
        </p>

        <div className="mt-8">
          <DealerForm />
        </div>

        <p className="lead mt-8 text-sm">
          Just looking?{" "}
          <button type="button" onClick={close} className="text-ink underline underline-offset-4">
            Carry on to the site
          </button>{" "}
          or{" "}
          <Link
            href="/dealers"
            onClick={close}
            className="text-zap-ink underline underline-offset-4"
          >
            read the dealer programme
          </Link>
          .
        </p>
      </div>
    </dialog>
  );
}
