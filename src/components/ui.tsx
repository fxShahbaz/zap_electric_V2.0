import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

const cta = {
  base: "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm transition-colors duration-300",
  solid: "bg-ink text-paper hover:bg-zap-ink",
  green: "bg-zap text-ink hover:bg-paper",
  paper: "bg-paper text-ink hover:bg-zap",
  outline: "border border-line text-ink hover:border-ink",
} as const;

/** A short green rule and a small mono label — the small title that sits
 *  above a section heading. The rule is always Zap green; pass the text
 *  colour for the surface it sits on. */
export function Eyebrow({
  children,
  className = "text-slate",
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`} {...rest}>
      <span aria-hidden className="h-px w-6 shrink-0 bg-zap" />
      {children}
    </p>
  );
}

export function CTA({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof Omit<typeof cta, "base">;
  className?: string;
}) {
  const classes = `${cta.base} ${cta[variant]} ${className}`;
  // Hash links stay plain anchors so Lenis intercepts them.
  return href.startsWith("#") ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
