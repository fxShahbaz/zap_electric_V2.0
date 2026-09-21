import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import DealerModal from "@/components/dealer-modal";
import CompareDock from "@/components/compare-dock";
import EnquiryChat from "@/components/enquiry-chat";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zapelectric.example"),
  title: {
    default: "Zap Electric — Electric scooters, and dealerships across India",
    template: "%s · Zap Electric",
  },
  description:
    "Nine electric scooters across two series, up to 120 km per charge, charging from an ordinary plug point. Dealer appointments open across India.",
  openGraph: {
    title: "Zap Electric",
    description:
      "Nine electric scooters across two series, up to 120 km per charge. Dealer appointments open across India.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable}`}
      // The head script below adds data-reveal-ready before hydration, which
      // React would otherwise report as a server/client attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint: only then does the CSS hide [data-reveal]
            elements, so a slow or failed bundle can never leave a blank page. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'document.documentElement.setAttribute("data-reveal-ready","")',
          }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink">
        <SmoothScroll />
        <SiteHeader />
        <main id="top">{children}</main>
        <SiteFooter />
        <DealerModal />
        <CompareDock />
        <EnquiryChat />
      </body>
    </html>
  );
}
