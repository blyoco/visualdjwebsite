"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { clip, getHref } from "@/lib/site";
import { SoundToggle } from "./sound";
import { LazyVideo } from "./lazy-video";

// De 3D-tunnel laadt pas in de browser (three.js is zwaar); tot dan, en op telefoons,
// staat er gewoon de video.
const TunnelScene = dynamic(() => import("./tunnel-scene"), { ssr: false });

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const canFly = () => window.matchMedia("(min-width: 768px)").matches;

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const fly = useSyncExternalStore(subscribe, canFly, () => false);
  const inView = useInView(section, { margin: "200px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  const textOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.18], [1, 1.15]);
  const textBlur = useTransform(scrollYProgress, [0, 0.18], ["blur(0px)", "blur(12px)"]);
  const endOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);

  return (
    <section id="top" ref={section} className={fly ? "relative h-[240vh]" : "relative"}>
      <div className={fly ? "sticky top-0 h-dvh overflow-hidden" : "relative overflow-hidden"}>
        {fly ? (
          <div className="absolute inset-0">{inView && <TunnelScene progress={scrollYProgress} />}</div>
        ) : (
          <LazyVideo
            src={clip("story").src}
            poster={clip("story").poster}
            aria-hidden
            className="absolute inset-0 size-full object-cover opacity-60"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_95%)]" />

        <motion.div
          style={fly ? { opacity: textOpacity, scale: textScale, filter: textBlur } : undefined}
          className={
            fly
              ? "absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
              : "relative flex min-h-dvh flex-col items-center justify-center px-4 pt-20 pb-16 text-center"
          }
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-mono text-xs tracking-[0.4em] text-white/70 uppercase"
          >
            Automatic VJ software
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="mt-6 text-6xl leading-[0.9] font-semibold tracking-tighter text-balance sm:text-8xl lg:text-[9rem]"
            style={{ textShadow: "0 0 calc(20px + var(--beat) * 60px) rgba(255,255,255,calc(0.15 + var(--beat) * 0.35))" }}
          >
            See the music.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mx-auto mt-7 max-w-xl text-lg text-white/75"
          >
            VisualDJ listens to any sound – your mixer, any audio input or a track on the laptop – locks onto the kick and plays a full night of visuals. You set up the night.
            It runs the show.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="pointer-events-auto mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href={getHref}
              className="rounded-full bg-foreground px-8 py-4 font-medium text-black transition-transform hover:scale-105"
            >
              Get VisualDJ
            </a>
            <SoundToggle label className="px-6 py-4 text-base" />
          </motion.div>
          {fly && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute bottom-8 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.4em] text-white/60 uppercase"
            >
              Scroll to fly in
              <ChevronDown className="size-4 animate-bounce" />
            </motion.div>
          )}
        </motion.div>

        {fly && (
          <motion.div
            style={{ opacity: endOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-12 text-center"
          >
            <p className="font-mono text-xs tracking-[0.4em] text-white/80 uppercase">Rendered live by VisualDJ</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
