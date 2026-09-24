import Preloader from "@/components/preloader";
import Hero from "@/components/hero";
import Range from "@/components/range";
import Spotlight from "@/components/spotlight";
import Reasons from "@/components/reasons";
import Specs from "@/components/specs";
import DealerCta from "@/components/dealer-cta";
import Enquire from "@/components/enquire";

export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <Range />
      <Spotlight />
      <Reasons />
      <Specs />
      <DealerCta />
      <Enquire />
    </>
  );
}
