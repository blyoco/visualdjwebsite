"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "./reveal";

const steps = [
  {
    n: "01",
    title: "Plug in",
    text: "Pick any sound source: your mixer over USB, another audio input, or a track on the laptop. VisualDJ shares the input with your stream or recording and never touches the mixer's settings.",
  },
  {
    n: "02",
    title: "Plan the night",
    text: "Add your DJs, drag their set times on the timeline and drop in their photos, videos and texts. Save the whole night as one show file.",
  },
  {
    n: "03",
    title: "Press Play",
    text: "Send the visuals to the projector and walk away. VisualDJ follows the clock and the beat. Need to step in? Use the remote on your phone.",
  },
];

const shots = [
  { key: "night", label: "The night", src: "/img/app-window.png", alt: "The VisualDJ window: the night on a timeline, DJ folders on the left, the live picture and media on the right" },
  { key: "blocks", label: "Blocks", src: "/img/app-blocks.webp", alt: "A full night of ten DJs on the timeline, with a DJ's text blocks: format, size and movement per block" },
  { key: "render", label: "Render", src: "/img/app-render.webp", alt: "The render page: the track as a waveform, the formats Reel, Story, Post, YouTube and Shorts, and the render folders" },
];

export function HowItWorks() {
  const [tab, setTab] = useState(0);
  const shot = useRef<HTMLDivElement>(null);
  // Het app-venster ligt eerst schuin achterover en klapt recht terwijl het in beeld schuift.
  const { scrollYProgress } = useScroll({ target: shot, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [38, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <section id="how" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">How it works</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tighter sm:text-7xl">Three steps to a full night.</h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="font-mono text-sm text-muted">{s.n}</div>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-white/50 to-transparent" />
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <div ref={shot} className="mt-20" style={{ perspective: 1400 }}>

          <div className="mb-4 flex justify-center gap-2">
            {shots.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setTab(i)}
                aria-pressed={tab === i}
                className={`rounded-full border px-5 py-2 text-sm transition-colors ${tab === i ? "border-white bg-white text-black" : "border-white/20 hover:bg-white/10"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <motion.figure
            style={{ rotateX, scale, y, transformOrigin: "50% 100%" }}
            className="relative overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_40px_160px_-40px_rgba(168,85,247,0.45)] sm:rounded-3xl"
          >
            <div className="aspect-[2000/813] w-full" />
            <AnimatePresence initial={false}>
              <motion.img
                key={shots[tab].key}
                src={shots[tab].src}
                alt={shots[tab].alt}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 size-full object-contain"
              />
            </AnimatePresence>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
