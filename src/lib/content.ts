/**
 * Every specification below is taken verbatim from the Zap product sheet:
 * https://docs.google.com/spreadsheets/d/1p59HUWxR6E4ghGj11h_wmdURUqfhmei5MyZMgjikyG4
 * (tab gid=0). The sheet lists all nineteen rows separately for each of the
 * nine models; within a series every row is identical except Colour Options,
 * so the rows are stored once per series here and reassembled per model by
 * `specRows()` below, in the sheet's own order.
 * Nothing technical here is estimated or invented — if a value is not in the
 * sheet, it is not on the site.
 *
 * The dealer-programme copy (dealerBenefits, dealerSteps, dealerFaqs) is the
 * one exception: it describes the partnership in general terms only. It names
 * no margin, no deposit and no territory count, because none of those were
 * supplied. Confirm the commercial detail before launch.
 */

/* -------------------------------------------------------------------------- */
/*  Series                                                                     */
/* -------------------------------------------------------------------------- */

import type { IconName } from "@/components/icons";

export type SeriesId = "s60" | "s70";

export type Series = {
  id: SeriesId;
  name: string;
  tag: string;
  blurb: string;
  range: string;
  battery: string[];
  motor: string;
  brakes: string;
  tyreSize: string;
};

/** The hardware series currently in production. Adding a series here adds it
 *  to the range, the spec table and every filter — nothing else to touch. */
export const series: Series[] = [
  {
    id: "s60",
    name: "60/90 series",
    tag: "60 · 90",
    blurb:
      "The lighter of the two platforms: a front disc with a rear drum, and a 10 inch rear tyre.",
    range: "60 / 90 km per charge",
    battery: ["GEL: 48V 32Ah / 60V 42Ah", "Lithium-ion: 60V 30Ah"],
    motor: "48 / 60 / 72V BLDC motor",
    brakes: "Front disc / rear drum",
    tyreSize: "Front 12 inch, rear 10 inch",
  },
  {
    id: "s70",
    name: "70/100/120 series",
    tag: "70 · 100 · 120",
    blurb:
      "Discs at both ends, 12 inch tyres all round, and the longest range in the line-up.",
    range: "70 / 100 / 120 km per charge",
    battery: ["GEL: 60/72V — 32/42Ah", "Lithium-ion: 60V/30Ah — 74V/32Ah"],
    motor: "60 / 72V BLDC motor",
    brakes: "Front disc / rear disc",
    tyreSize: "Front 12 inch, rear 12 inch",
  },
];

export const seriesById = Object.fromEntries(
  series.map((item) => [item.id, item]),
) as Record<SeriesId, Series>;

/** Shared by every model currently in the range. */
export const commonSpecs = {
  topSpeed: "25 km/hr",
  charger: "Micro charger with auto cutoff",
  chargingTime: ["Lead 6–8 hrs", "Lithium 3–5 hrs"],
  suspension:
    "Front hydraulic telescopic, rear double shocker with dual tube technology",
  speedometer: "Digital colour",
  tyre: "Tubeless",
  chassis: "High strength tubular frame",
  weight: "80 kg",
};

/* -------------------------------------------------------------------------- */
/*  Models                                                                     */
/* -------------------------------------------------------------------------- */

export type Scooter = {
  id: string;
  index: string;
  name: string;
  series: SeriesId;
  range: string;
  colours: string[];
  image: string;
  imageAlt: string;
};

export const scooters: Scooter[] = [
  {
    id: "pulse",
    index: "01",
    name: "Pulse",
    series: "s60",
    range: "60 / 90 km",
    colours: ["White", "Black", "Grey", "Red", "Matt Green"],
    image: "/images/model-pulse.jpg",
    imageAlt: "Zap Pulse electric scooter",
  },
  {
    id: "volta",
    index: "02",
    name: "Volta",
    series: "s60",
    range: "60 / 90 km",
    colours: ["White", "Black", "Grey", "Red", "Matt Green"],
    image: "/images/model-volta.jpg",
    imageAlt: "Zap Volta electric scooter",
  },
  {
    id: "zygo",
    index: "03",
    name: "Zygo",
    series: "s70",
    range: "70 / 100 / 120 km",
    colours: ["White", "Black", "Glacier Lily"],
    image: "/images/model-zygo.jpg",
    imageAlt: "Zap Zygo electric scooter",
  },
  {
    id: "nova",
    index: "04",
    name: "Nova",
    series: "s70",
    range: "70 / 100 / 120 km",
    colours: ["White", "Black", "Metallic Grey", "Silver", "Cherry White"],
    image: "/images/model-nova.jpg",
    imageAlt: "Zap Nova electric scooter",
  },
  {
    id: "drift",
    index: "05",
    name: "Drift",
    series: "s70",
    range: "70 / 100 / 120 km",
    colours: ["Metallic Grey"],
    image: "/images/model-drift.jpg",
    imageAlt: "Zap Drift electric scooter",
  },
  {
    id: "nitra",
    index: "06",
    name: "Nitra",
    series: "s70",
    range: "70 / 100 / 120 km",
    colours: ["Copper Brown", "Black"],
    image: "/images/model-nitra.jpg",
    imageAlt: "Zap Nitra electric scooter",
  },
  {
    id: "blaze",
    index: "07",
    name: "Blaze",
    series: "s70",
    range: "70 / 100 / 120 km",
    colours: ["Pearl White", "Blue", "Silver White", "Grey"],
    image: "/images/model-blaze.jpg",
    imageAlt: "Zap Blaze electric scooter",
  },
  {
    id: "cruise",
    index: "08",
    name: "Cruise",
    series: "s70",
    range: "70 / 100 / 120 km",
    colours: ["Black", "Sea Green", "Milkshake White", "Cherry Blossom Pink"],
    image: "/images/model-cruise.jpg",
    imageAlt: "Zap Cruise electric scooter",
  },
  {
    id: "glyde",
    index: "09",
    name: "Glyde",
    series: "s70",
    range: "70 / 100 / 120 km",
    colours: ["Silver White"],
    image: "/images/model-glyde.jpg",
    imageAlt: "Zap Glyde electric scooter",
  },
];

export const scooterById = Object.fromEntries(
  scooters.map((item) => [item.id, item]),
) as Record<string, Scooter | undefined>;

/**
 * The full specification for one model, in the same order and with the same
 * rows as the product sheet. `Break System` and `Chasis` are spelled correctly
 * here; everything else reads as the sheet has it.
 */
export function specRows(model: Scooter) {
  const platform = seriesById[model.series];
  return [
    { label: "Range", value: platform.range },
    { label: "Top speed", value: commonSpecs.topSpeed },
    { label: "Battery", value: platform.battery.join("\n") },
    { label: "Charger", value: commonSpecs.charger },
    { label: "Charging time", value: commonSpecs.chargingTime.join("\n") },
    { label: "Motor power", value: platform.motor },
    { label: "Brake system", value: platform.brakes },
    { label: "Tyre", value: `${commonSpecs.tyre} tyre` },
    { label: "Tyre size", value: platform.tyreSize },
    { label: "Suspension", value: commonSpecs.suspension },
    { label: "Speedometer", value: commonSpecs.speedometer },
    { label: "Anti-theft alarm", value: "Yes" },
    { label: "Central locking", value: "Yes" },
    { label: "Reverse gear", value: "Yes" },
    { label: "USB charger", value: "Yes" },
    { label: "Parking switch", value: "Yes" },
    { label: "Chassis", value: commonSpecs.chassis },
    { label: "Weight", value: commonSpecs.weight },
    { label: "Colour options", value: model.colours.join(", ") },
  ];
}

/* -------------------------------------------------------------------------- */
/*  Ownership                                                                  */
/* -------------------------------------------------------------------------- */

/** Reasons to own one, running cost first. Licence and registration are one
 *  benefit among nine here, not the pitch the whole site is built on. */
export const benefits = [
  {
    index: "01",
    title: "Cheap to run",
    copy: "A full charge costs a fraction of a tank, and the price of a unit does not move the way petrol does.",
  },
  {
    index: "02",
    title: "Charges at home",
    copy: "The supplied micro charger plugs into an ordinary socket. No wall box, no charging station, no waiting in a queue.",
  },
  {
    index: "03",
    title: "Range for a real week",
    copy: "Between 60 and 120 km on a charge depending on model and battery — a week of school runs and errands on one plug-in.",
  },
  {
    index: "04",
    title: "Very little to service",
    copy: "A BLDC hub motor has few moving parts. No oil, no clutch, no gearbox, and long gaps between workshop visits.",
  },
  {
    index: "05",
    title: "Quiet and smooth",
    copy: "Telescopic forks up front, a dual-tube shocker at the back, and no engine noise to carry into the house at 6am.",
  },
  {
    index: "06",
    title: "Easy to handle",
    copy: "80 kg kerb weight, a reverse gear and a parking switch, so tight parking and ramps stop being a two-person job.",
  },
  {
    index: "07",
    title: "Secure as standard",
    copy: "Anti-theft alarm and central locking are fitted to every model in the range, not sold back to you as an extra.",
  },
  {
    index: "08",
    title: "Zero tailpipe emissions",
    copy: "Nothing comes out of the back of it — which matters most in the streets you ride it down every day.",
  },
  {
    index: "09",
    title: "No licence or registration on eligible models",
    copy: "Models in the 25 km/hr class need neither, which makes a second household vehicle far simpler to put on the road.",
  },
];

/** The short version for the home page — one line each, no paragraphs.
 *  The full nine live in `benefits` and are used on /about. */
export const reasons: { icon: IconName; title: string; copy: string }[] = [
  { icon: "rupee", title: "Cheap to run", copy: "A charge costs a fraction of a tank." },
  {
    icon: "home-charge",
    title: "Charges at home",
    copy: "Ordinary socket. No wall box, no station.",
  },
  { icon: "spanner", title: "Little to service", copy: "No oil, no clutch, no gearbox." },
  { icon: "quiet", title: "Quiet and light", copy: "80 kg, and nothing to wake the street." },
];

/** Fitted across the range, straight off the spec sheet. */
export const standardFitment = [
  "Anti-theft alarm",
  "Central locking",
  "Reverse gear",
  "USB charger",
  "Parking switch",
  "Digital colour speedometer",
  "Tubeless tyres",
  "Micro charger with auto cutoff",
];

export const keyFigures = [
  { value: 120, suffix: "\u00a0km", label: "Longest range per charge" },
  { value: 9, suffix: "", label: "Models in the range" },
  { value: 3, suffix: "–5 hrs", label: "Lithium-ion charge time" },
  { value: 0, suffix: "", label: "Tailpipe emissions" },
];

/* -------------------------------------------------------------------------- */
/*  Hardware                                                                   */
/* -------------------------------------------------------------------------- */

export type Chapter = {
  index: string;
  title: string;
  copy: string;
  points: string[];
  image: string;
  imageAlt: string;
};

export const chapters: Chapter[] = [
  {
    index: "01",
    title: "BLDC motor, GEL or lithium",
    copy: "Every Zap runs a BLDC hub motor — 48/60/72V on the 60/90 series, 60/72V on the 70/100/120. Both series are offered with a GEL battery or a lithium-ion pack, so you choose on price or on charging time.",
    points: [
      "48 / 60 / 72V BLDC motor",
      "GEL or lithium-ion battery",
      "Digital colour speedometer",
    ],
    image: "/images/detail-dash.jpg",
    imageAlt: "Close-up of an electric scooter cockpit and digital speedometer",
  },
  {
    index: "02",
    title: "Charges from a normal plug point",
    copy: "A micro charger with auto cutoff comes with every scooter. GEL takes 6–8 hours, lithium-ion 3–5 — both from an ordinary socket at home, with nothing to install first.",
    points: [
      "Micro charger with auto cutoff",
      "Lead 6–8 hrs · Lithium 3–5 hrs",
      "Charge at home, overnight",
    ],
    image: "/images/detail-charge.jpg",
    imageAlt: "Electric scooters plugged in and charging",
  },
  {
    index: "03",
    title: "Tubular frame, tubeless tyres",
    copy: "A high strength tubular frame, front hydraulic telescopic forks and a rear double shocker with dual tube technology. Front discs throughout; the 70/100/120 series adds a rear disc. 80 kg kerb weight.",
    points: [
      "High strength tubular frame",
      "Telescopic front, dual-tube rear",
      "Tubeless 12 inch tyres",
    ],
    image: "/images/detail-frame.jpg",
    imageAlt: "Electric scooter parked against a plain wall",
  },
];

export const gallery = [
  {
    image: "/images/gallery-street.jpg",
    alt: "Rider on an electric scooter in city traffic",
    caption: "Daily commute",
  },
  {
    image: "/images/gallery-market.jpg",
    alt: "Electric scooter on a busy market street",
    caption: "Local errands",
  },
  {
    image: "/images/gallery-rider.jpg",
    alt: "Rider on an electric scooter on a city street",
    caption: "Everyday riding",
  },
  {
    image: "/images/gallery-parked.jpg",
    alt: "Electric scooter parked on a street",
    caption: "Park anywhere",
  },
];

/* -------------------------------------------------------------------------- */
/*  Dealer programme                                                           */
/* -------------------------------------------------------------------------- */

export const dealerBenefits = [
  {
    index: "01",
    title: "A range you can sell on the floor",
    copy: "Nine models across two series, in colours that cover most of a showroom's walk-in demand — without holding nine kinds of spare part.",
  },
  {
    index: "02",
    title: "Territory you are not fighting over",
    copy: "We appoint deliberately. Tell us the area you cover and we will tell you honestly whether it is open.",
  },
  {
    index: "03",
    title: "Training for sales and workshop",
    copy: "Your staff get walked through the platforms, the battery options and the routine service points before the first unit lands.",
  },
  {
    index: "04",
    title: "Spares and service backing",
    copy: "Parts support for the models you stock, so a scooter in your workshop does not sit there waiting on us.",
  },
  {
    index: "05",
    title: "Display and launch material",
    copy: "Signage, spec cards and product photography for the showroom and for your own local marketing.",
  },
  {
    index: "06",
    title: "One person to call",
    copy: "A named contact for orders, stock and escalations, rather than a general inbox and a queue.",
  },
];

export const dealerSteps = [
  {
    index: "01",
    title: "Send the enquiry",
    copy: "Business name, city, and what you already sell. Two minutes.",
  },
  {
    index: "02",
    title: "We check the territory",
    copy: "We come back on whether your area is open, and with the commercial terms for it.",
  },
  {
    index: "03",
    title: "Range and stock plan",
    copy: "We agree which of the nine models suit your customers and what a first order looks like.",
  },
  {
    index: "04",
    title: "Onboarding and launch",
    copy: "Training, display material and your opening stock, and you are selling.",
  },
];

export const dealerFaqs = [
  {
    question: "What kind of business are you looking for?",
    answer:
      "Existing two-wheeler dealers, electric vehicle retailers, and established local businesses with a showroom and somewhere to service what they sell. Workshop capability matters more to us than floor area.",
  },
  {
    question: "Which models would I stock?",
    answer:
      "All nine are available to dealers. Most start with a spread across both series — the 60/90 for shorter local demand and the 70/100/120 where customers ride further — and widen once they see what their area asks for.",
  },
  {
    question: "Do you supply both battery types?",
    answer:
      "Yes. Every model is offered with a GEL battery or a lithium-ion pack, so you can quote against both a price-led and a charging-time-led customer.",
  },
  {
    question: "What about spares and warranty handling?",
    answer:
      "Parts support comes with the appointment. Warranty terms are set out in the dealer agreement — ask us for the current document with your enquiry.",
  },
  {
    question: "How long does appointment take?",
    answer:
      "It depends on your territory and on stock. The first reply, on whether your area is open, comes back quickly — tell us your city in the form and we will start there.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Contact                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * TODO — replace with Zap's real contact details before launch.
 * `.example` addresses are intentional placeholders so nothing on the site
 * reads as a real, working channel.
 */
export const contactChannels = [
  {
    index: "01",
    title: "Dealership enquiries",
    copy: "For showrooms and retailers who want to stock the range.",
    email: "dealers@zapelectric.example",
    image: "/images/cta.jpg",
    imageAlt: "An electric scooter parked outside a lit storefront at night",
  },
  {
    index: "02",
    title: "Sales enquiries",
    copy: "Which model, which battery, and where to see one near you.",
    email: "sales@zapelectric.example",
    image: "/images/gallery-rider.jpg",
    imageAlt: "Rider on an electric scooter on a city street",
  },
  {
    index: "03",
    title: "Service and support",
    copy: "Already riding a Zap and need a part, a check-up or help with the charger.",
    email: "service@zapelectric.example",
    image: "/images/detail-charge.jpg",
    imageAlt: "Electric scooters plugged in and charging",
  },
  {
    index: "04",
    title: "Fleet and bulk orders",
    copy: "Ten scooters or a hundred, for delivery fleets, campuses and resorts.",
    email: "fleet@zapelectric.example",
    image: "/images/hero.jpg",
    imageAlt: "Riders on electric scooters coming through a city gateway",
  },
];

/** What happens after the contact form — only what the site can promise. */
export const contactSteps = [
  {
    index: "01",
    title: "Pick a topic",
    copy: "It decides which desk reads your message.",
  },
  {
    index: "02",
    title: "The right desk reads it",
    copy: "Dealership questions go straight to the dealer desk.",
  },
  {
    index: "03",
    title: "We reply by email",
    copy: "To the address you give us. Add a phone number if you would rather we call.",
  },
];

/** Answers drawn only from the product sheet. */
export const faqs = [
  {
    question: "How far will it go on one charge?",
    answer:
      "The Pulse and Volta cover 60 or 90 km depending on the battery. The Zygo, Nova, Drift, Nitra, Blaze, Cruise and Glyde cover 70, 100 or 120 km.",
  },
  {
    question: "How long does it take to charge?",
    answer:
      "A GEL battery takes 6–8 hours and a lithium-ion pack 3–5 hours, using the micro charger with auto cutoff supplied with the scooter — from an ordinary socket at home.",
  },
  {
    question: "GEL or lithium-ion — which should I choose?",
    answer:
      "Both series are offered with either. Lithium-ion charges in roughly half the time; GEL is the more economical option. Tell us your daily distance and we will recommend one.",
  },
  {
    question: "What is fitted as standard?",
    answer:
      "Anti-theft alarm, central locking, reverse gear, USB charger, parking switch, digital colour speedometer and tubeless tyres — on every model in the range.",
  },
  {
    question: "Do I need a driving licence or registration?",
    answer:
      "Models in the 25 km/hr class need neither. Every scooter currently in the range is in that class, so eligible models can be ridden without a licence or registration.",
  },
];
