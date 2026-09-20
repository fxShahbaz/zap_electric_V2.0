import Image from "next/image";
import type { ReactNode } from "react";

/** Shared top of every inner page: title, one paragraph, optional buttons
 *  and one image. Nothing else. */
export default function PageHeader({
  title,
  intro,
  image,
  imageAlt,
  actions,
}: {
  title: ReactNode;
  intro: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="bg-paper pt-32 md:pt-40">
      <div className="shell">
        <h1 className="title max-w-[16ch] text-[clamp(2.5rem,6.4vw,5rem)]" data-appear>
          {title}
        </h1>

        <p
          className="lead mt-8 max-w-xl text-xl"
          data-appear
          style={{ ["--appear-delay" as string]: "140ms" }}
        >
          {intro}
        </p>

        {actions ? (
          <div
            className="mt-10 flex flex-wrap gap-3"
            data-appear
            style={{ ["--appear-delay" as string]: "240ms" }}
          >
            {actions}
          </div>
        ) : null}

        {image ? (
          <div
            className="relative mt-16 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-mist sm:aspect-[16/9]"
            data-appear
            style={{ ["--appear-delay" as string]: "300ms" }}
          >
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
