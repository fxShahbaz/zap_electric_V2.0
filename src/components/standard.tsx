import { standardFitment } from "@/lib/content";

/** Fitted to every model. A plain list — it does not need eight boxes. */
export default function Standard() {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="shell">
        <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
          Fitted as standard
        </h2>
        <p className="lead mt-4 max-w-md text-lg" data-reveal>
          On all nine models, in both series, with either battery.
        </p>

        <ul className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
          {standardFitment.map((item) => (
            <li key={item} className="border-t border-line py-4 text-[0.9375rem]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
