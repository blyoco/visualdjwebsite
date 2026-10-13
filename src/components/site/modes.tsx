"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { clip, type ClipName } from "@/lib/site";
import { LazyVideo } from "./lazy-video";

// De vijf soorten beeld van de app. Het scherm blijft staan; scrollen veegt het volgende beeld er in een cirkel overheen.

const modes: { name: ClipName; title: string; text: string }[] = [
  {
    name: "standard",
    title: "Standard",
    text: "Sixty-four shapes and worlds that switch on the beat, every 4, 8, 12 or 16 counts. Never the same twice in a row.",
  },
  {
    name: "story",
    title: "Story",
    text: "One continuous journey. A living camera rides along, feels the build-up, the drop and the breakdown, and shapes flow into each other.",
  },
  {
    name: "follow",
    title: "Follow",
    text: "The same journey with a line of fire curling from the centre and a calm camera. The world bends around it and lights up on the kick.",
  },
  {
    name: "dance",
    title: "Dance",
    text: "The swarm dances all the time: twenty moves in stories that land on the bar. Something calm in a break, a peak on the drop.",
  },
  {
    name: "world",
    title: "World",
    text: "Full worlds of shapes that switch and break open on the beat, with a swarm dancing through them in flashes.",
  },
];

function Layer({ name, i, progress }: { name: ClipName; i: number; progress: MotionValue<number> }) {
  // Laag 0 staat er altijd; laag 1 en 2 vegen in een cirkel naar binnen.
  const from = (i - 0.5) / modes.length + 0.05;
  const to = from + 0.14;
  const r = useTransform(progress, [from, to], ["0%", "150%"]);
  const clipPath = useTransform(r, (v) => `circle(${v} at 50% 50%)`);
  const scale = useTransform(progress, [from, to + 0.2], [1.25, 1]);
  return (
    <motion.div className="absolute inset-0" style={i === 0 ? undefined : { clipPath }}>
      <LazyVideo
        src={clip(name).src}
        poster={clip(name).poster}
        style={{ scale: i === 0 ? undefined : scale }}
        className="size-full object-cover"
      />
    </motion.div>
  );
}

export function Modes() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(modes.length - 1, Math.floor(v * modes.length * 0.999 + 0.1))));

  return (
    <section id="modes" ref={section} className="relative h-[560vh] scroll-mt-0">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {modes.map((m, i) => (
          <Layer key={m.name} name={m.name} i={i} progress={scrollYProgress} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 sm:px-6 md:justify-center md:pb-0">
          <p className="font-mono text-xs tracking-[0.4em] text-white/70 uppercase">Five kinds of picture</p>
          <div className="relative mt-4 h-[17rem] max-w-lg sm:h-[15rem]">
            {modes.map((m, i) => (
              <motion.div
                key={m.name}
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : active > i ? -40 : 40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
                aria-hidden={active !== i}
              >
                <h2 className="text-6xl font-semibold tracking-tighter sm:text-8xl">{m.title}</h2>
                <p className="mt-5 text-lg text-white/80">{m.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex gap-2">
            {modes.map((m, i) => (
              <div key={m.name} className="h-1 w-10 overflow-hidden sm:w-14 rounded-full bg-white/20">
                <motion.div
                  className="h-full bg-white"
                  initial={false}
                  animate={{ width: active >= i ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
