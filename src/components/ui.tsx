import Link from "next/link";
import type { ReactNode } from "react";

const cta = {
  base: "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm transition-colors duration-300",
  solid: "bg-ink text-paper hover:bg-zap-ink",
  green: "bg-zap text-ink hover:bg-paper",
  outline: "border border-line text-ink hover:border-ink",
} as const;

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
