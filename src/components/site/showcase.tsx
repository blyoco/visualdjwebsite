"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { clip, type ClipName } from "@/lib/site";
import { LazyVideo } from "./lazy-video";
import { Reveal } from "./reveal";

// Twee grote stukken: teksten die op de tel door het beeld bewegen, en achtergronden die tot leven komen.
// De video schuift en draait iets bij het scrollen, de tekst ernaast komt in beeld.

const rows: { id: string; video: ClipName; kicker: string; title: string; body: string; points: string[] }[] = [
  {
    id: "texts",
    video: "texts",
    kicker: "Texts",
    title: "Words that move on the one.",
    body: "Type a line and VisualDJ brings it into the picture on the beat: it starts on the 1, lasts whole bars and is gone on a bar line. Per DJ, for the whole event, or sent live from your phone.",
    points: [
      "115 movements: sine scroller, slot machine, departure board, terminal, LED ticker, credits …",
      "The swarm can write your text, or bring it in as a star warp or dust cloud",
      "One line, one word per row, or a text block – sized to suit the movement",
      "Your own font, in the show's colours or in black and yellow",
    ],
  },
  {
    id: "backgrounds",
    video: "background",
    kicker: "Backgrounds & your logo",
    title: "Your artwork, brought to life.",
    body: "Drop in photos and videos and they come big behind the picture now and then, turning, zooming and breathing with the music. Mark one with D and it opens the night: a starry sky, your background rising behind it, the stars gathering – and the punch lands on the 1.",
    points: [
      "Thirteen animations: Ring Tower, Spin, Radial Tunnel, Depth Parallax, Kaleidoscope Morph …",
      "Backgrounds for the whole event, or only while a certain DJ plays",
      "Your own logo: the swarm forms it, in the intros and the dance",
      "A transparent PNG works best",
    ],
  },
];

function Row({ r, i }: { r: (typeof rows)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const flip = i % 2 === 1;
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [flip ? -18 : 18, 0, flip ? 10 : -10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div id={r.id} ref={ref} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div className={flip ? "lg:order-2" : undefined} style={{ perspective: 1400 }}>
        <motion.div
          style={{ rotateY, scale, y }}
          className="overflow-hidden rounded-3xl border border-white/15 bg-black shadow-[0_40px_140px_-40px_rgba(255,255,255,0.25)]"
        >
          <LazyVideo src={clip(r.video).src} poster={clip(r.video).poster} className="aspect-video w-full object-cover" />
        </motion.div>
      </div>
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">{r.kicker}</p>
        <h3 className="mt-4 text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-[2.05rem] lg:whitespace-nowrap xl:text-[2.4rem]">{r.title}</h3>
        <p className="mt-5 text-lg text-muted">{r.body}</p>
        <ul className="mt-6 space-y-2.5">
          {r.points.map((p) => (
            <li key={p} className="flex gap-3 text-white/85">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-white/70" />
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export function Showcase() {
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-28 px-4 sm:px-6 sm:gap-36">
        {rows.map((r, i) => (
          <Row key={r.id} r={r} i={i} />
        ))}
      </div>
    </section>
  );
}
