"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";

const SwarmScene = dynamic(() => import("./swarm-scene"), { ssr: false });

// Het laatste scherm: de zwerm boven, de footer eronder. De zwerm laadt ruim van tevoren (dus nooit ineens in beeld),
// vloeit zacht in zodra het scherm onder de FAQ omhoog komt, en komt geleidelijk samen: compleet op 70% van het
// laatste scherm, dus al voor je helemaal onderaan bent (0 = wolk, 1 = onderaan). Een veer maakt het vloeiend, ook bij schokkerig scrollen.
export function SwarmLogo({ children }: { children?: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const near = useInView(section, { margin: "1500px 0px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const textOpacity = useTransform(progress, [0.6, 0.8], [0, 1]);
  const textY = useTransform(progress, [0.6, 0.8], [20, 0]);

  return (
    <section ref={section} aria-label="VisualDJ" className="relative flex flex-col sm:min-h-dvh">
      <div className="relative h-[34vh] sm:h-auto sm:min-h-[55vh] sm:flex-1">
        <motion.div className="absolute inset-0" style={{ opacity: sceneOpacity }}>
          {near && <SwarmScene progress={progress} />}
        </motion.div>
        <motion.p
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-x-0 bottom-6 text-center font-mono text-xs tracking-[0.5em] text-white/70 uppercase"
        >
          See the music.
        </motion.p>
      </div>
      {children}
    </section>
  );
}
