"use client";

import { motion } from "motion/react";
import { clip } from "@/lib/site";
import { LazyVideo } from "./lazy-video";
import { Reveal } from "./reveal";

// De aankondiging: VisualDJ gaat open in de week van ADE (Amsterdam Dance Event, oktober 2026).
// Het ADE-logo is van Amsterdam Dance Event en staat er met toestemming van de gebruiker (origineel in assets/).

export function Launch() {
  return (
    <section id="launch" className="relative scroll-mt-16 overflow-hidden border-y border-line">
      {/* Achter het blok: het LTU-filmpje, zacht en wazig */}
      <LazyVideo
        src={clip("background").small}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-30 blur-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[auto_1fr] lg:gap-16">
        <Reveal>
          <motion.div
            animate={{ rotate: [0, -2, 0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto w-fit"
            style={{ filter: "drop-shadow(0 0 calc(10px + var(--beat) * 40px) rgba(255,255,255,0.35))" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/ade-logo.webp" alt="ADE – Amsterdam Dance Event" width={470} height={200} className="h-28 w-auto sm:h-36" />
          </motion.div>
        </Reveal>
        <Reveal delay={0.1} className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.35em] text-white/70 uppercase">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            Coming soon
          </p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tighter sm:text-7xl">Launching at ADE.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75 lg:mx-0">
            Not a demo – the real thing. VisualDJ launches in the week of Amsterdam Dance Event, October 2026, for Windows
            PC and Mac. Keep an eye on this site.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="rounded-full border border-white/25 px-4 py-1.5 text-sm">Windows PC</span>
            <span className="rounded-full border border-white/25 px-4 py-1.5 text-sm">Mac</span>
          </div>
          <p className="mt-3 text-xs text-white/50">Launch date and platforms subject to change.</p>
        </Reveal>
      </div>
    </section>
  );
}

// De smalle balk boven de menubalk, in ADE-geel met zwarte letters
export function LaunchBar() {
  return (
    <a
      href="#launch"
      className="flex h-8 items-center justify-center gap-2 bg-[#ffe600] px-4 text-center text-xs font-semibold text-black transition-colors hover:bg-[#fff04d] sm:text-sm"
    >
      <span className="size-1.5 animate-pulse rounded-full bg-black" />
      <span className="sm:hidden">Launch during ADE 2026 – PC &amp; Mac</span>
      <span className="hidden sm:inline">The launch: during ADE 2026, for PC and Mac – keep an eye on this site</span>
    </a>
  );
}
