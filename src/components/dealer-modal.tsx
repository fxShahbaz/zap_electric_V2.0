"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const onDealersPage = pathname === "/dealers";

  useEffect(() => {
    if (onDealersPage || alreadyAsked()) return;

    const timer = window.setTimeout(() => {
      const dialog = ref.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      titleRef.current?.focus();
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
      className="invite m-auto w-[min(56rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl bg-paper p-0 text-ink"
    >
      {/* Photo beside the form on desktop; on a phone the form is the whole card. */}
      <div className="grid max-h-[calc(100dvh-2rem)] overflow-y-auto lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative hidden lg:block">
          <Image
            src="/images/gallery-parked.jpg"
            alt=""
            fill
            sizes="24rem"
            className="object-cover object-[60%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
          <p className="absolute inset-x-6 bottom-6 text-sm leading-relaxed text-paper/85">
            Nine models, two series, one named person to call.
          </p>
        </div>

        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="dealer-modal-title"
              ref={titleRef}
              tabIndex={-1}
              className="title text-[clamp(1.375rem,2.6vw,1.75rem)] outline-none"
            >
              Sell Zap in your city
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-2xl leading-none text-ash transition-colors hover:bg-mist hover:text-ink"
            >
              <span aria-hidden>&times;</span>
            </button>
          </div>

          <p className="lead mt-2 text-sm">
            We are appointing dealers across India. Tell us your city and we will
            tell you whether it is open.
          </p>

          <div className="mt-6">
            <DealerForm compact />
          </div>

          <p className="lead mt-5 text-xs">
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
      </div>
    </dialog>
  );
}
