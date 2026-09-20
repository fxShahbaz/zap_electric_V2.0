import Image from "next/image";
import Link from "next/link";
import { contactChannels } from "@/lib/content";

/** The footer closes the page rather than just ending it: one last choice
 *  (ride one / sell them), then the map of the site, then the fine print. */
const columns = [
  {
    title: "Explore",
    links: [
      { label: "The range", href: "/#range" },
      { label: "Specifications", href: "/#specs" },
      { label: "About Zap", href: "/about" },
    ],
  },
  {
    title: "Dealers",
    links: [
      { label: "The programme", href: "/dealers" },
      { label: "Apply now", href: "/dealers#dealer-form" },
      { label: "Dealer questions", href: "/dealers#faq" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="shell pt-20 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-24">
          {/* One last choice */}
          <div>
            <h2 className="title max-w-[10ch] text-[clamp(2rem,4vw,3rem)]">
              Ride one, or sell them.
            </h2>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/#enquire"
                className="inline-flex rounded-full bg-zap px-7 py-3.5 text-sm text-ink transition-colors duration-300 hover:bg-paper"
              >
                Enquire
              </Link>
              <Link
                href="/dealers"
                className="inline-flex rounded-full border border-paper/25 px-7 py-3.5 text-sm text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
              >
                Become a dealer
              </Link>
            </div>
          </div>

          {/* The map */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-16">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm text-paper/40">{column.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-paper/75 transition-colors duration-200 hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm text-paper/40">Get in touch</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {contactChannels.slice(0, 2).map((channel) => (
                  <li key={channel.email}>
                    <a
                      href={`mailto:${channel.email}`}
                      className="text-sm text-paper/75 transition-colors duration-200 hover:text-paper"
                    >
                      {channel.email}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-paper/75 transition-colors duration-200 hover:text-paper"
                  >
                    All contact details
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fine print */}
        <div className="mt-16 flex flex-col gap-6 border-t border-paper/15 py-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" aria-label="Zap Electric — home" className="shrink-0">
            <Image
              src="/brand/wordmark-light.png"
              alt="Zap"
              width={1147}
              height={379}
              className="h-5 w-auto opacity-80 transition-opacity hover:opacity-100"
            />
          </Link>

          <div className="flex flex-col gap-2 text-sm text-paper/40 md:flex-row md:items-center md:gap-8">
            <p>Specifications from the current product sheet</p>
            <p>© {new Date().getFullYear()} Zap Electric</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
