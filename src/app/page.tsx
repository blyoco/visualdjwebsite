import { Features } from "@/components/site/features";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
    </>
  );
}
