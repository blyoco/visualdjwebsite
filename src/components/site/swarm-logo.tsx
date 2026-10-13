"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";

const SwarmScene = dynamic(() => import("./swarm-scene"), { ssr: false });

// Het laatste scherm: de zwerm boven, de footer eronder. De zwerm blijft een wolk tot je echt helemaal onderaan bent;
// dan komt hij in ruim twee seconden samen tot het logo (0 = wolk, 1 = logo). Weer omhoog = hij valt uit elkaar.
export function SwarmLogo({ children }: { children?: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: "200px" });
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);
  const atBottom = useRef(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const bottom = document.documentElement.scrollHeight - window.innerHeight;
    const now = bottom - y < 6;
    if (now === atBottom.current) return;
    atBottom.current = now;
    animate(progress, now ? 1 : 0, now ? { duration: 2.4, ease: [0.22, 1, 0.36, 1] } : { duration: 0.9, ease: "easeIn" });
  });
  const textOpacity = useTransform(progress, [0.85, 1], [0, 1]);
  const textY = useTransform(progress, [0.85, 1], [20, 0]);

  return (
    <section ref={section} aria-label="VisualDJ" className="relative flex flex-col sm:min-h-dvh">
      <div className="relative h-[34vh] sm:h-auto sm:min-h-[55vh] sm:flex-1">
        <div className="absolute inset-0">{inView && <SwarmScene progress={progress} />}</div>
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
