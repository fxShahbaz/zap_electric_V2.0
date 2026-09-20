import { reasons } from "@/lib/content";
import { Icon } from "@/components/icons";

/** Four lines. Anyone who wants the long version can read /about. */
export default function Reasons() {
  return (
    <section id="why" className="scroll-mt-24 bg-mist py-24 md:py-32">
      <div className="shell">
        <h2 className="title max-w-[18ch] text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
          Why people buy one
        </h2>

        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <li
              key={reason.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${index * 70}ms` }}
            >
              <Icon name={reason.icon} className="h-7 w-7 text-zap-ink" />
              <h3 className="title mt-5 text-xl">{reason.title}</h3>
              <p className="lead mt-2">{reason.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
