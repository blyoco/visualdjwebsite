import { About } from "@/components/site/about";
import { Beta } from "@/components/site/beta";
import { Faq } from "@/components/site/faq";
import { Features } from "@/components/site/features";
import { Footer } from "@/components/site/footer";
import { Gallery } from "@/components/site/gallery";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Launch } from "@/components/site/launch";
import { Modes } from "@/components/site/modes";
import { More } from "@/components/site/more";
import { Navbar } from "@/components/site/navbar";
import { Showcase } from "@/components/site/showcase";
import { Stars } from "@/components/site/stars";
import { SwarmLogo } from "@/components/site/swarm-logo";
import { WorkModes } from "@/components/site/work-modes";

export default function Home() {
  return (
    <>
      <Navbar />
      <Stars />
      <main>
        <Hero />
        <Launch />
        <Modes />
        <Features />
        <Showcase />
        <WorkModes />
        <HowItWorks />
        <Gallery />
        <More />
        <About />
        <Beta />
        <Faq />
      </main>
      <SwarmLogo>
        <Footer />
      </SwarmLogo>
    </>
  );
}
