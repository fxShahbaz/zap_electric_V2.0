# Zap Electric — website (v2.1)

Marketing site for Zap electric scooters. Next.js 16 (App Router) + Tailwind v4,
with Lenis smooth scrolling driven by the GSAP ticker, and ScrollTrigger for the
few sections that cross-fade or count.

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
```

## What changed from v1

- **White, not black.** Paper is the default surface, `mist` the only alternate,
  and ink is reserved for type, the footer and the two panels that need to land
  hard (the dealer pitch, the enquiry form). Headings are sentence case at a
  readable size instead of full-bleed uppercase display type.
- **Low speed is no longer the pitch.** The range is presented as electric
  scooters, full stop. The 25 km/hr class, the licence and the registration
  exemption are facts in the spec table and one benefit out of nine — not the
  headline. Nothing in the copy says "every Zap is low-speed", so a faster
  series can be added without rewriting the site.
- **Series instead of platforms.** `platforms` (a fixed A/B object) became
  `series` (an array). Adding an entry adds it to the range, the spec table,
  the dealer page and the enquiry form's dropdown. Nothing else to touch.
- **Dealer enquiry is a headline feature.** Its own page (`/dealers`), its own
  section on the home page, and a permanent CTA in the header at every width.
- **Six sections, not eleven.** The home page carries the hero, the range, four
  reasons, what separates the two series, the dealer panel and a four-field
  enquiry form. Everything deeper — the nine reasons in full, the hardware
  chapters, standard fitment, the gallery — moved to `/about`, which is where
  someone goes when they want it.
- **Less chrome.** No marquee, no counter band, no mono-uppercase label on every
  block, no card borders around things that read fine on white. Model cards
  carry an image, a name and a range; the spec block shows only what actually
  differs between the two series and puts the shared specs in one sentence.

## Where the content comes from

Every specification on the site is taken from the Zap product sheet
([Google Sheet](https://docs.google.com/spreadsheets/d/1p59HUWxR6E4ghGj11h_wmdURUqfhmei5MyZMgjikyG4/edit?gid=0#gid=0),
tab `gid=0`) and lives in one file: `src/lib/content.ts`. Nothing technical is estimated, rounded or
invented — if a value is not in the sheet, it is not on the site. There are no
prices, warranty terms or service claims anywhere, because the sheet has none.

Nine models across two series:

| Series | Models | Range | Motor | Brakes | Tyres |
| --- | --- | --- | --- | --- | --- |
| 60/90 | Pulse, Volta | 60 / 90 km | 48/60/72V BLDC | Front disc / rear drum | 12" / 10" |
| 70/100/120 | Zygo, Nova, Drift, Nitra, Blaze, Cruise, Glyde | 70 / 100 / 120 km | 60/72V BLDC | Front disc / rear disc | 12" / 12" |

Shared by the whole range: 25 km/hr top speed, GEL or lithium-ion battery, micro
charger with auto cutoff (lead 6–8 hrs, lithium 3–5 hrs), high strength tubular
frame, telescopic front and dual-tube rear suspension, tubeless tyres, digital
colour speedometer, anti-theft alarm, central locking, reverse gear, USB charger,
parking switch, 80 kg.

The sheet repeats all nineteen rows for each of the nine models. Within a
series every row is identical except Colour Options, so `content.ts` stores
them once per series and `specRows(model)` reassembles a model's full sheet
row list, in the sheet's order, for its detail page. Two labels are spelled
correctly on the site where the sheet has typos (`Break System` → Brake system,
`Chasis` → Chassis); every value reads as the sheet has it.

**The one exception:** the dealer-programme copy (`dealerBenefits`,
`dealerSteps`, `dealerFaqs`) is new marketing text. It describes the partnership
in general terms and deliberately names no margin, no deposit, no territory
count and no timeline, because none were supplied. Confirm the commercial detail
before launch.

## Structure

```
src/app/layout.tsx        fonts, metadata, header/footer, smooth-scroll boot,
                          the dealer invitation dialog
src/app/page.tsx          home — section order
src/app/range/[model]/     /range/<id> — one page per model, prerendered
src/app/dealers/page.tsx  /dealers — the dealer programme and its form
src/app/about/page.tsx    /about
src/app/contact/page.tsx  /contact
src/components/           one file per section, plus the shared primitives
                          (range, reasons, specs, dealer-cta, enquire on home;
                           hardware, standard, gallery used by /about)
src/lib/content.ts        the spec sheet, dealer copy, contact channels, FAQs
src/lib/enquiry.ts        the single submit seam for all three forms
src/app/api/enquiry/      the route handler they post to; forwards to the
  route.ts                ZAP_ENQUIRY_WEBHOOK destination
src/components/dealer-modal.tsx
                          the dealer form offered once on arrival
src/lib/scroll-lock.ts    stops Lenis while something is open over the page
src/lib/gsap.ts           the one place GSAP plugins get registered
public/brand/             logo, transparent, light + dark variants
public/images/            photography
```

### The footer

It is a closing section, not a sign-off: the last ride-one-or-sell-them choice
with both CTAs, then three link groups (Explore, Dealers, Get in touch), then
the fine print. `/about` deliberately does **not** repeat that closing CTA —
the footer covers it on every page.

### Shared primitives

- `components/ui.tsx` — just `CTA`. It renders a plain `<a>` for `#hash` links
  so Lenis intercepts them, and a `next/link` for everything else.
- `components/form-fields.tsx` — `Field`, `Select`, `TextArea`, `SubmitButton`,
  `Submitted`. Light-theme controls shared by all three forms.
- `components/faq.tsx` — native `<details>`, so it works without JS.

### Pages

- **/** — hero → the range → why people buy one → what separates the two series
  → dealer panel → enquiry.
- **/range/[model]** — one page per model, statically generated from
  `generateStaticParams`. Title and series line, a full-bleed image, four
  figures, the colours, the complete nineteen-row specification, an enquiry
  form that arrives with that model already selected, the rest of its series,
  and a link to the next model. An unknown slug 404s.
- **/dealers** — header, what comes with the appointment, how it works in four
  steps, the dealer form, dealer FAQ.

### The dealer invitation

The dealer form is also offered as a dialog 1.4s after arrival, from
`src/components/dealer-modal.tsx`. It is a native `<dialog>` opened with
`showModal()`, so the focus trap, Escape and the top layer are the browser's;
the backdrop click and the Lenis scroll lock are ours.

It asks **once**. Being shown is recorded in `localStorage` under
`zap:dealer-invite`, so a returning visitor is never interrupted again, and it
never renders on `/dealers`, where the same form is already on the page. To see
it again while working, clear that key:

```js
localStorage.removeItem("zap:dealer-invite")
```

Change the delay or drop the once-only rule at the top of that file
(`openDelay`, `alreadyAsked`).
- **/about** — statement, the nine reasons in full, the two series in detail,
  hardware, standard fitment, gallery, closing CTA.
- **/contact** — four channels, the message form, FAQ answered from the sheet.

## Scroll system

`components/smooth-scroll.tsx` is the only place scrolling is configured:

- Lenis smooths the page; `gsap.ticker` drives Lenis' RAF and `lenis.on("scroll")`
  updates ScrollTrigger, so pinned sections never drift from the smoothing.
- Anchor clicks (`a[href^="#"]`) are routed through `lenis.scrollTo`.
- One IntersectionObserver flips `[data-reveal]` elements to `data-shown="true"`.
  The transition lives in CSS, so any section can use reveals while staying a
  server component. The observer re-runs on every route change.

**Two rules worth keeping.** Reveals are gated behind `[data-reveal-ready]`, an
attribute set by a tiny inline script in `<head>` before first paint — so if that
script never runs, the bundle fails, or JS is off, content is simply never hidden
(`<html suppressHydrationWarning>` covers the attribute mismatch). Anything above
the fold uses `[data-appear]` / `[data-appear-line]` instead, which animate from
CSS keyframes on parse and never wait for hydration.

Everything is wrapped in `prefers-reduced-motion` guards: no Lenis, no counters,
no chapter dimming — the page renders in its final state instead.

| Section | Effect |
| --- | --- |
| Header | hairline scroll-progress bar, border and blur appear past 8px |
| Hero | headline lines rise on parse, image scales slowly on scroll |
| Everything else | one fade-and-rise on enter, via `[data-reveal]` |
| Hardware (/about) | sticky image column cross-fades as the chapters pass |
| Gallery (/about) | per-image parallax |

## Design tokens

Defined once in `src/app/globals.css` under `@theme`:

`--color-paper #ffffff` · `--color-mist #f6f7f4` · `--color-cloud #eceee8` ·
`--color-line #e4e6e0` · `--color-ink #101310` · `--color-slate #5b615a` ·
`--color-ash #8b918a` · `--color-zap #61b76e` (brand fill) ·
`--color-zap-ink #1c7a3d` (accessible green for text on white) ·
`--color-zap-wash #eef6ef`

Utilities: `shell` (container), `title` (headings), `lead` (body). `eyebrow`
(mono labels), `figure-num` and `card` are still defined but deliberately
unused on the main pages — reach for them only if something genuinely needs
a label or a boxed figure.

Type: **Archivo** for everything visible, **IBM Plex Mono** for labels and
figures. The brand green `#61b76e` is a fill colour only — on white, text and
links use `--color-zap-ink`, which clears contrast.

## Still to replace

- **A destination for the forms.** All three post to `/api/enquiry`, which
  forwards to whatever `ZAP_ENQUIRY_WEBHOOK` points at — an inbox relay, a CRM
  intake URL, a Zapier or Make hook. Set that one variable and every form is
  live. With it unset the route accepts and logs in development, and fails with
  a 503 in production rather than dropping a real dealer behind a green tick.
- **Photography** in `public/images/` is from Unsplash and shows other
  manufacturers' scooters — some carry visible badges. Swap in Zap product
  photography keeping the same filenames (`model-<id>.jpg`, `gallery-*.jpg`,
  `detail-*.jpg`, `hero.jpg`, `cta.jpg`) and nothing else has to change.
  This matters most on `/range/<model>`, where each photo is full width at the
  top of its own page.

  **If you replace a file in place**, Next caches optimized images by URL, so
  `rm -rf .next` (or restart `next dev`) after the swap or the old picture
  keeps being served.
- **Contact details** in `contactChannels` are `.example` placeholders on
  purpose. Swap in the real inboxes, and add a phone number and address if you
  want them on the contact page.
- **Dealer commercial terms** — see the note above.
- Prices, dealer locations and warranty terms are absent by design. Add them to
  `src/lib/content.ts` only when you have the real figures.
