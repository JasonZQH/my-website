import { Metadata } from "next";
import Script from "next/script";
import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LiquidBackdrop from "@/components/LiquidBackdrop";

// v3 uses a single family — Kanit — for display, body, and labels alike.
// Only the weights actually used ship: light/normal/medium/semibold/black.
const kanit = Kanit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "900"],
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: "Jason Zhang — AI/ML Software Engineer",
  description:
    "A product-focused portfolio exploring AI systems, interactive software, computer vision, and agent orchestration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${kanit.variable} font-body antialiased text-[#E5E6EA] min-h-screen overflow-x-hidden`}
      >
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <LiquidBackdrop />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
