import type { SVGProps } from "react";

/* Monoline icons, drawn here rather than pulled from a library: four of them do
   not justify a dependency, and these match the site's line weight. Each is a
   24-unit box, stroked in currentColor, so colour and size come from the class
   on the element. */

export type IconName =
  | "rupee"
  | "home-charge"
  | "spanner"
  | "quiet"
  | "arrow"
  | "chat"
  | "close"
  | "restart"
  | "moped"
  | "route"
  | "gauge"
  | "factory"
  | "gear"
  | "team"
  | "check";

function Glyph({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** A rupee on a coin — what it costs to run. */
function Rupee(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M9.4 8.6h5.2M9.4 11h5.2M13 8.6c0 2.9-1.9 4.3-3.6 4.3l4.6 4.3" />
    </Glyph>
  );
}

/** A house with a bolt in it — an ordinary socket at home. */
function HomeCharge(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M3.75 11 12 4.5l8.25 6.5" />
      <path d="M5.9 10.2V19.5h12.2v-9.3" />
      <path d="M12.9 12.4 10.5 16h3l-2.4 3.6" />
    </Glyph>
  );
}

/** A spanner — or rather, how rarely you need one. */
function Spanner(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M16.9 4.4a5.2 5.2 0 0 0-6.4 6.8l-6.1 6.1a2.1 2.1 0 0 0 3 3l6.1-6.1a5.2 5.2 0 0 0 6.8-6.4l-3.1 3.1-2.5-.9-.9-2.5z" />
    </Glyph>
  );
}

/** A speaker, struck through — nothing to wake the street. */
function Quiet(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M4.25 9.5h3L11 6.25v11.5L7.25 14.5h-3z" />
      <path d="m15.5 9.75 4.25 4.5M19.75 9.75l-4.25 4.5" />
    </Glyph>
  );
}

/** A plain right arrow, for links that go somewhere. */
function Arrow(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />
    </Glyph>
  );
}

/** A speech bubble — the enquiry chat. */
function Chat(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M6.75 16.5a2.25 2.25 0 0 1-2.25-2.25v-7.5A2.25 2.25 0 0 1 6.75 4.5h10.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25H10.5l-4 3.25V16.5z" />
      <path d="M8.75 10.5h.01M12 10.5h.01M15.25 10.5h.01" strokeWidth={2.25} />
    </Glyph>
  );
}

function Close(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </Glyph>
  );
}

/** A circular arrow — start the conversation again. */
function Restart(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M4.75 12a7.25 7.25 0 1 0 2.2-5.2" />
      <path d="M4.5 4.25V8.5h4.25" />
    </Glyph>
  );
}

/** A scooter, side on — the models. */
function Moped(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="6.25" cy="17" r="2.25" />
      <circle cx="17.75" cy="17" r="2.25" />
      <path d="M8.5 17h3l1.75-5h2.25a3 3 0 0 1 3 3v2" />
      <path d="M13.25 12 11.5 7.25h2.75" />
    </Glyph>
  );
}

/** An arrow heading off the page — how far a charge goes. */
function Route(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M4.5 19.5 19 5" strokeDasharray="3 3" />
      <path d="M12.5 5H19v6.5" />
    </Glyph>
  );
}

/** A speedometer needle — top speed. */
function Gauge(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M4.5 16.5a7.5 7.5 0 1 1 15 0" />
      <path d="M12 16.5 15.75 11" />
      <path d="M12 7.5v1.25M6.6 10.6l.9.9M17.4 10.6l-.9.9" />
    </Glyph>
  );
}

/** A saw-tooth roof and a stack — where the scooters are built. */
function Factory(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M4 19.5v-8l4-2.5v2.5l4-2.5v2.5l4-2.5v10.5" />
      <path d="M4 19.5h16" />
      <path d="M16.5 8.5V4.75h2.25V7" />
      <path d="M7.5 15.5h1.5M11.5 15.5H13" />
    </Glyph>
  );
}

/** A cog — checked at every stage. */
function Gear(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 4.75v2M12 17.25v2M19.25 12h-2M6.75 12h-2M17.13 6.87l-1.42 1.42M8.29 15.71l-1.42 1.42M17.13 17.13l-1.42-1.42M8.29 8.29 6.87 6.87" />
    </Glyph>
  );
}

/** Two people — the team. */
function Team(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="9" cy="8" r="2.75" />
      <circle cx="16.25" cy="9" r="2.25" />
      <path d="M3.75 19v-1a4.25 4.25 0 0 1 4.25-4.25h2A4.25 4.25 0 0 1 14.25 18v1" />
      <path d="M15.5 14a3.25 3.25 0 0 1 4.75 2.9V19" />
    </Glyph>
  );
}

/** A tick in a ring — designed for real use. */
function Check(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m8.25 12.25 2.5 2.5 5-5.5" />
    </Glyph>
  );
}

const glyphs: Record<IconName, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  rupee: Rupee,
  "home-charge": HomeCharge,
  spanner: Spanner,
  quiet: Quiet,
  arrow: Arrow,
  chat: Chat,
  close: Close,
  restart: Restart,
  moped: Moped,
  route: Route,
  gauge: Gauge,
  factory: Factory,
  gear: Gear,
  team: Team,
  check: Check,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Drawn = glyphs[name];
  return <Drawn className={className} />;
}
