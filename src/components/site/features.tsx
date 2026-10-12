"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { AudioLines, CalendarClock, Images } from "lucide-react";
import { clip, type ClipName } from "@/lib/site";
import { LazyVideo } from "./lazy-video";

// Kaarten die bij het scrollen over elkaar heen schuiven: de vorige zakt iets weg en kantelt naar achteren.

const features: { icon: typeof AudioLines; title: string; text: string; video: ClipName }[] = [
  {
    icon: AudioLines,
    title: "Hears the beat",
    text: "Plug in your mixer over USB. VisualDJ finds every kick, locks onto the tempo within seconds and cuts the visuals on the beat. Got a Pioneer DJM? It can read the mixer's own BPM too.",
    video: "dance",
  },
  {
    icon: CalendarClock,
    title: "Runs the whole night",
    text: "Put your DJs on a timeline with their set times. The visuals follow the clock: each DJ gets their own look, their own media, and a clean handover to the next. Running late? Hit Extend.",
    video: "world",
  },
  {
    icon: Images,
    title: "Your media, mixed in",
    text: "Drop in photos, videos, logos and texts per DJ or for the whole event. VisualDJ weaves them through the animations, with forty ways to bring text on screen, always on the one.",
    video: "story",
  },
];

function Card({ f, i, progress }: { f: (typeof features)[number]; i: number; progress: MotionValue<number> }) {
  const n = features.length;
  const start = i / n;
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - i - 1) * 0.06]);
  const rotateX = useTransform(progress, [start, 1], [0, (n - i - 1) * 6]);
  const dim = useTransform(progress, [start, 1], [0, (n - i - 1) * 0.25]);
  return (
    <div className="sticky top-24 flex h-[78vh] items-start justify-center pt-[calc(var(--i)*1.75rem)]" style={{ "--i": i } as React.CSSProperties}>
      <motion.article
        style={{ scale, rotateX, transformPerspective: 1200, transformOrigin: "50% 0%" }}
        className="group relative h-[62vh] w-full overflow-hidden rounded-[2rem] border border-white/15 bg-black shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <LazyVideo
          src={clip(f.video).src}
          poster={clip(f.video).poster}
          className="absolute inset-0 size-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
        <div className="relative flex h-full flex-col justify-end p-7 sm:p-12">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/20 bg-black/50 backdrop-blur">
              <f.icon className="size-5" />
            </span>
            <span className="font-mono text-xs tracking-[0.3em] text-white/60">0{i + 1}</span>
          </div>
          <h3 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">{f.title}</h3>
          <p className="mt-4 max-w-xl text-lg text-white/80">{f.text}</p>
        </div>
      </motion.article>
    </div>
  );
}

export function Features() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  return (
    <section id="features" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Features</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tighter sm:text-7xl">Set it up once. Play all night.</h2>
        </div>
        <div ref={container} className="relative mt-16">
          {features.map((f, i) => (
            <Card key={f.title} f={f} i={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
