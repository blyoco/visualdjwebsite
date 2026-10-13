import { About } from "@/components/site/about";
import { Beta } from "@/components/site/beta";
import { Faq } from "@/components/site/faq";
import { Features } from "@/components/site/features";
import { Footer } from "@/components/site/footer";
import { Gallery } from "@/components/site/gallery";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Modes } from "@/components/site/modes";
import { Navbar } from "@/components/site/navbar";
import { Snakes } from "@/components/site/snakes";
import { SwarmLogo } from "@/components/site/swarm-logo";

export default function Home() {
  return (
    <>
      <Navbar />
      <Snakes />
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
