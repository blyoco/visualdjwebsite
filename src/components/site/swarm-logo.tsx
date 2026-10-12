"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";

const SwarmScene = dynamic(() => import("./swarm-scene"), { ssr: false });

// De afsluiter: de zwerm komt samen tot het logo terwijl je naar beneden scrolt.
export function SwarmLogo() {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: "200px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end end"] });
  const textOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.75, 0.95], [30, 0]);

  return (
    <section ref={section} aria-label="VisualDJ" className="relative h-[200vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">{inView && <SwarmScene progress={scrollYProgress} />}</div>
        <motion.p
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-x-0 bottom-[18%] text-center font-mono text-xs tracking-[0.5em] text-white/70 uppercase"
        >
          See the music.
        </motion.p>
      </div>
    </section>
  );
}
