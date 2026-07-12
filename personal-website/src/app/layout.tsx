import { Metadata } from "next";
import Script from "next/script";
import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
  description: "Portfolio of Jason Zhang: agentic AI systems, computer vision, and full-stack products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${kanit.variable} font-body antialiased bg-[#0C0C0C] text-[#D7E2EA] min-h-screen overflow-x-hidden`}
      >
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

        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
