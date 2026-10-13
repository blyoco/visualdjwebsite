"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clapperboard, FlaskConical, Radio } from "lucide-react";
import { Reveal } from "./reveal";

// De drie standen van de app (de knoppen bovenin): EDIT / TEST, LIVE en RENDER VIDEO. Klik op een stand voor de details.

const modes = [
  {
    key: "test",
    icon: FlaskConical,
    name: "Edit / Test",
    tagline: "Build and try the night at home.",
    points: [
      "Test track: load a track from the laptop and the picture plays on it – no mixer needed",
      "Fake DJM: pretend a Pioneer mixer sends its tempo, and ride it like a pitch fader",
      "DRY RUN: the whole night in short – every DJ's start, their visuals and their end – then it stops by itself",
      "Click anywhere on the timeline for a trial from that moment",
    ],
  },
  {
    key: "live",
    icon: Radio,
    name: "Live",
    tagline: "Doors open. Nothing changes by accident.",
    points: [
      "Play follows the clock: the DJ whose time it is, is always on screen",
      "Editing is locked – no wrong click can put the wrong DJ in the picture",
      "Extend a DJ who runs over, skip to the next, or end a set now",
      "Countdown first, so you can start your recording before the show begins",
    ],
  },
  {
    key: "render",
    icon: Clapperboard,
    name: "Render video",
    tagline: "Turn a track into a video – for socials or the big screen.",
    points: [
      "Reel, Story, Post (portrait, square, landscape), YouTube, Shorts or a small picture",
      "Pick the piece on the waveform, preview it big, then render at 30 or 60 frames a second",
      "Its own media, background and logo – only for the video",
      "Every clip on this site was rendered this way",
    ],
  },
];

export function WorkModes() {
  const [active, setActive] = useState(0);
  const m = modes[active];
  return (
    <section id="render" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Three ways to work</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tighter sm:text-7xl">Test. Live. Render.</h2>
          <p className="mt-5 text-lg text-muted">One app for the rehearsal at home, the night itself and the video afterwards.</p>
        </Reveal>

        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {modes.map((x, i) => (
            <button
              key={x.key}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`relative overflow-hidden rounded-2xl border px-6 py-5 text-left transition-colors ${
                active === i ? "border-white/40 bg-white/[0.07]" : "border-line hover:border-white/25 hover:bg-white/[0.03]"
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="work-glow"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_60%)]"
                />
              )}
              <x.icon className="size-5" />
              <p className="mt-4 text-xl font-semibold tracking-tight">{x.name}</p>
              <p className="mt-1 text-sm text-muted">{x.tagline}</p>
            </button>
          ))}
        </div>

        <div className="relative mt-4 min-h-[19rem] overflow-hidden rounded-3xl border border-line bg-white/[0.02] p-7 sm:min-h-[15rem] sm:p-10">
          <AnimatePresence mode="wait">
            <motion.ul
              key={m.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid gap-x-10 gap-y-4 sm:grid-cols-2"
            >
              {m.points.map((p) => (
                <li key={p} className="flex gap-3 text-white/85">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-white/70" />
                  {p}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
