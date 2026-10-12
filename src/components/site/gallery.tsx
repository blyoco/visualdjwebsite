"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { clip, type ClipName } from "@/lib/site";
import { LazyVideo } from "./lazy-video";

// Een cilinder van schermen die meedraait met het scrollen: een avond VisualDJ in tien momenten.

const items: { name: ClipName; label: string }[] = [
  { name: "standard", label: "Standard" },
  { name: "story", label: "Story" },
  { name: "dance", label: "Dance" },
  { name: "follow", label: "Follow" },
  { name: "world", label: "World" },
  { name: "story", label: "Story" },
  { name: "standard", label: "Standard" },
  { name: "follow", label: "Follow" },
  { name: "world", label: "World" },
  { name: "dance", label: "Dance" },
];

export function Gallery() {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: "300px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [20, -300]);
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8]);

  // De kaartbreedte en de straal van de cilinder volgen de schermbreedte.
  const [w, setW] = useState(360);
  useEffect(() => {
    const set = () => setW(window.innerWidth < 640 ? 220 : window.innerWidth < 1024 ? 300 : 380);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  const step = 360 / items.length;
  const radius = Math.round(w / 2 / Math.tan(Math.PI / items.length)) + 40;

  return (
    <section ref={section} data-gallery className="relative h-[300vh] border-t border-line">
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 px-4 text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Rendered by VisualDJ</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tighter sm:text-7xl">One night, many worlds.</h2>
        </div>

        <div className="mt-10 h-[45vh] w-full sm:mt-14" style={{ perspective: 1600 }}>
          <motion.div
            className="relative mx-auto h-full"
            style={{ width: w, rotateY, rotateX: tilt, transformStyle: "preserve-3d" }}
          >
            {items.map((it, i) => (
              <div
                key={i}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, backfaceVisibility: "hidden" }}
              >
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_0_60px_-10px_rgba(255,255,255,0.15)]">
                  {inView ? (
                    <LazyVideo
                      src={clip(it.name).small}
                      poster={clip(it.name).poster}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-video w-full" />
                  )}
                </div>
                <p className="mt-3 text-center font-mono text-[10px] tracking-[0.3em] text-white/60 uppercase">{it.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
