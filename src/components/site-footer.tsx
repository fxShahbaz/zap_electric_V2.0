import Image from "next/image";
import Link from "next/link";
import { contactChannels } from "@/lib/content";
import { Icon } from "@/components/icons";

/** The footer closes the page rather than just ending it: a strip of facts,
 *  one last choice (ride one / sell them) as two pictures, the map of the
 *  site, then the wordmark, big, as the full stop. */
const columns = [
  {
    title: "Explore",
    links: [
      { label: "The range", href: "/range" },
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

/** Every line here is already said elsewhere on the site. */
const facts = [
  "Up to 120 km per charge",
  "Nine models, two series",
  "Charges from an ordinary plug point",
  "No oil, no clutch, no gearbox",
  "Dealer appointments open across India",
];

const choices = [
  {
    title: "Ride one",
    copy: "Tell us where you ride and we will come back with a model.",
    href: "/#enquire",
    image: "/images/gallery-parked.jpg",
    imageAlt: "Electric scooter parked in front of a domed monument",
    position: "object-[50%_62%]",
  },
  {
    title: "Sell them",
    copy: "Dealer appointments are open across India.",
    href: "/dealers",
    image: "/images/gallery-market.jpg",
    imageAlt: "Electric scooter on a busy market street",
    position: "object-center",
  },
];

function Ticker() {
  // Two identical runs side by side; the track slides by exactly one run and
  // loops, so the seam never shows. The second run is decoration only.
  const run = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {facts.map((fact) => (
        <li key={fact} className="flex items-center whitespace-nowrap text-sm text-paper/60">
          <span className="px-8">{fact}</span>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-zap" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="footer-ticker overflow-hidden border-b border-paper/10 py-5">
      <div className="footer-ticker-track flex w-max">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="overflow-clip bg-ink text-paper">
      {/* overflow-clip, not hidden, here and around the wordmark: hidden makes
          a scroll container, and the wordmark's view() timeline would track
          that instead of the page. */}
      <Ticker />

      <div className="shell pt-20 md:pt-28">
        {/* One last choice */}
        <div className="flex items-end justify-between gap-8">
          <h2 className="title max-w-[12ch] text-[clamp(2.25rem,5.6vw,4.5rem)]">
            Ride one, or sell them.
          </h2>
          <a
            href="#top"
            className="group hidden shrink-0 items-center gap-3 text-sm text-paper/60 transition-colors hover:text-paper sm:inline-flex"
          >
            Back to top
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 transition-colors duration-300 group-hover:border-zap group-hover:bg-zap group-hover:text-ink">
              <Icon name="arrow" className="h-4 w-4 -rotate-90" />
            </span>
          </a>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {choices.map((choice) => (
            <Link
              key={choice.title}
              href={choice.href}
              className="group relative isolate block aspect-[4/3] overflow-hidden rounded-2xl bg-graphite sm:aspect-[16/10]"
            >
              <Image
                src={choice.image}
                alt={choice.imageAlt}
                fill
                sizes="(max-width: 768px) 92vw, 46vw"
                className={`-z-10 object-cover ${choice.position} transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]`}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

              <div className="flex h-full items-end justify-between gap-6 p-6 sm:p-8">
                <div>
                  <h3 className="title text-[clamp(1.75rem,3.2vw,2.5rem)]">{choice.title}</h3>
                  <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-paper/75">
                    {choice.copy}
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-colors duration-300 group-hover:bg-zap">
                  <Icon
                    name="arrow"
                    className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* The map */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <p className="max-w-xs text-[0.9375rem] leading-relaxed text-paper/55 lg:col-span-4">
            Nine electric scooters across two series, sold through dealers who can
            service what they sell.
          </p>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm text-paper/40">{column.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="footer-link text-sm text-paper/75">
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
                    <a href={`mailto:${channel.email}`} className="footer-link text-sm text-paper/75">
                      {channel.email}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/contact" className="footer-link text-sm text-paper/75">
                    All contact details
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* The full stop. The wordmark file is 1147px wide — too small to
            show in colour at this size on a retina screen — so here it is only
            a mask: one flat, faint fill hides the soft edges. The coloured
            logo, at a size the file can carry, is in the fine print below. */}
        <div aria-hidden className="mt-20 overflow-clip md:mt-28">
          <div className="footer-mark aspect-[1147/379] w-full" />
        </div>

        {/* Fine print */}
        <div className="mt-10 flex flex-col gap-6 border-t border-paper/15 py-8 md:flex-row md:items-center md:justify-between">
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
