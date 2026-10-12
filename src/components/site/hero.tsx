"use client";

import { motion } from "motion/react";
import { VideoClip } from "./video-clip";

const DEMO = "/video/demo.mp4";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* De video vergroot en wazig achter alles: zo geven de visuals de pagina zijn kleur. */}
      <video
        src={DEMO}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full scale-125 object-cover opacity-35 blur-3xl"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.p {...fade(0)} className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
          Automatic VJ software
        </motion.p>
        <motion.h1 {...fade(0.1)} className="mt-5 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl lg:text-8xl">
          Visuals that hear the music.
        </motion.h1>
        <motion.p {...fade(0.2)} className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          VisualDJ listens to your mixer, locks onto the kick and plays a full night of visuals, with your DJs&apos;
          photos, videos and texts mixed in. You set up the night. It runs the show.
        </motion.p>
        <motion.div {...fade(0.3)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#get"
            className="w-full rounded-full bg-foreground px-7 py-3.5 font-medium text-black transition-transform hover:scale-105 sm:w-auto"
          >
            Get VisualDJ
          </a>
          <a
            href="#features"
            className="w-full rounded-full border border-white/20 px-7 py-3.5 font-medium transition-colors hover:bg-white/10 sm:w-auto"
          >
            See what it does
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 sm:mt-20"
        >
          <VideoClip
            src={DEMO}
            className="aspect-[860/368] rounded-2xl border border-white/15 shadow-[0_0_160px_-30px_rgba(255,255,255,0.3)] sm:rounded-3xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
