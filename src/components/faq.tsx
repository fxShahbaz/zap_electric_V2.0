/** Native <details> — keyboard accessible, works without JS, no library. */
export default function Faq({
  id,
  title,
  items,
  className = "",
}: {
  id?: string;
  title: string;
  items: { question: string; answer: string }[];
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 bg-paper py-24 md:py-32 ${className}`}>
      <div className="shell">
        <div className="max-w-3xl">
        <h2 className="title text-[clamp(1.875rem,3.6vw,2.75rem)]" data-reveal>
          {title}
        </h2>

        <div className="mt-12 flex flex-col" data-reveal>
          {items.map((item) => (
            <details
              key={item.question}
              className="group border-b border-line py-6 first:border-t first:border-line"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="title text-lg md:text-xl">{item.question}</h3>
                <span
                  aria-hidden
                  className="relative mt-2 block h-3 w-3 shrink-0 text-ash transition-transform duration-300 group-open:rotate-45"
                >
                  <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                  <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
                </span>
              </summary>
              <p className="lead mt-4 text-[0.9375rem]">{item.answer}</p>
            </details>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
