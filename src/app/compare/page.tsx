import type { Metadata } from "next";
import CompareTable from "@/components/compare-table";

export const metadata: Metadata = {
  title: "Compare models",
  description:
    "Put two or three Zap models side by side and see exactly where their specifications differ.",
};

export default function ComparePage() {
  return (
    <section className="bg-paper pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="shell">
        <h1 className="title text-[clamp(2.5rem,6.4vw,5rem)]">Compare</h1>
        <p className="lead mt-6 max-w-xl text-xl">
          Two or three models, line by line, straight from the product sheet.
        </p>

        <div className="mt-16">
          <CompareTable />
        </div>
      </div>
    </section>
  );
}
