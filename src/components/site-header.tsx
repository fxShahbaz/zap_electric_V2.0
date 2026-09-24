"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/range", label: "Range" },
  { href: "/dealers", label: "Dealers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const onHome = pathname === "/";
  /** /range/pulse is still "Range". */
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setStuck(scrolled > 8);
      setProgress(Math.min(1, Math.max(0, scrolled / height)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The sheet locks the page; Lenis reads the same document, so this holds it too.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        stuck || open
          ? "border-b border-line bg-paper/85 backdrop-blur-xl"
          : "border-b border-transparent bg-paper/0"
      }`}
    >
      {/* The strip: one line, always green, above everything. */}
      <Link
        href="/dealers#dealer-form"
        className="block bg-zap text-ink transition-colors duration-300 hover:bg-zap-ink hover:text-paper"
      >
        <span className="shell flex h-8 items-center justify-center gap-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
          <span className="truncate">Charge ahead — now appointing dealers across India</span>
          <span aria-hidden className="shrink-0">→</span>
        </span>
      </Link>

      {/* Read-progress hairline — the one piece of chrome that tracks scroll. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-8 h-px origin-left bg-zap transition-opacity duration-300"
        style={{ transform: `scaleX(${progress})`, opacity: stuck ? 1 : 0 }}
      />

      <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
        <Link
          href={onHome ? "#top" : "/"}
          aria-label="Zap Electric — home"
          className="shrink-0"
        >
          <Image
            src="/brand/wordmark.png"
            alt="Zap"
            width={1147}
            height={379}
            priority
            className="h-5 w-auto md:h-[1.375rem]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className={`text-sm transition-colors duration-200 hover:text-ink ${
                isCurrent(link.href) ? "text-ink" : "text-slate"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dealers#dealer-form"
            className="inline-flex rounded-full bg-ink px-4 py-2.5 text-sm text-paper transition-colors duration-300 hover:bg-zap-ink sm:px-5"
          >
            <span className="sm:hidden">Dealers</span>
            <span className="hidden sm:inline">Become a dealer</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-line bg-paper transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? "max-h-[32rem]" : "max-h-0 border-t-transparent"
        }`}
      >
        <nav className="shell flex flex-col py-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="title border-b border-line py-4 text-2xl text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dealers#dealer-form"
            onClick={() => setOpen(false)}
            className="mt-6 rounded-full bg-ink px-5 py-4 text-center text-sm text-paper"
          >
            Become a dealer
          </Link>
        </nav>
      </div>
    </header>
  );
}
