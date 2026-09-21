import Image from "next/image";
import Link from "next/link";
import type { Scooter } from "@/lib/content";
import CompareToggle from "@/components/compare-toggle";

/** One model: image, name, range — the three things anyone compares first —
 *  and the compare button. Shared by the home page and /range; `detailed`
 *  adds the colour count, for the page where people are choosing. */
export default function ModelCard({
  model,
  index = 0,
  detailed = false,
}: {
  model: Scooter;
  /** Position in its row, for the staggered reveal. */
  index?: number;
  detailed?: boolean;
}) {
  return (
    <li
      data-reveal
      className="relative"
      style={{ ["--reveal-delay" as string]: `${(index % 3) * 70}ms` }}
    >
      <Link href={`/range/${model.id}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
          <Image
            src={model.image}
            alt={model.imageAlt}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover object-[center_30%] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>
        <h3 className="title mt-4 flex items-center gap-2 pr-32 text-xl">
          Zap {model.name}
          <span
            aria-hidden
            className="translate-x-[-0.25rem] text-zap-ink opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            →
          </span>
        </h3>
        <p className="lead mt-1 pr-32 text-sm">
          {model.range}
          {detailed
            ? ` · ${model.colours.length} ${model.colours.length === 1 ? "colour" : "colours"}`
            : null}
        </p>
      </Link>

      <CompareToggle
        id={model.id}
        name={model.name}
        tone="inline"
        className="absolute bottom-2 right-0"
      />
    </li>
  );
}
