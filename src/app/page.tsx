import { About } from "@/components/site/about";
import { Beta } from "@/components/site/beta";
import { Faq } from "@/components/site/faq";
import { Features } from "@/components/site/features";
import { Footer } from "@/components/site/footer";
import { Gallery } from "@/components/site/gallery";
import { Helix } from "@/components/site/helix";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Modes } from "@/components/site/modes";
import { Navbar } from "@/components/site/navbar";
import { SwarmLogo } from "@/components/site/swarm-logo";

export default function Home() {
  return (
    <>
      <Navbar />
      <Helix />
      <main>
        <Hero />
        <Modes />
        <Features />
        <HowItWorks />
        <Gallery />
        <About />
        <Beta />
        <Faq />
        <SwarmLogo />
      </main>
      <Footer />
    </>
  );
}
