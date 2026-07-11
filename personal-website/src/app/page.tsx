import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Stack from "@/components/Stack";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <span id="top" />
      <Hero />
      <Marquee />
      <About />
      <Stack />
      <Experience />
      <Work />
      <Contact />
      <Footer />
    </>
  );
}
