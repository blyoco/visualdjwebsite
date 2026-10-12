"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { loop } from "@/lib/site";
import { cn } from "@/lib/utils";

// De site "hoort" de muziek: zet de bezoeker het geluid aan, dan speelt de loop naadloos rond (Web Audio, op de sample
// precies) en pulseert alles op de tel. --beat op <html> loopt van 1 (op de tel) terug naar 0; zonder geluid een zachte puls.

let beatValue = 0;
let barValue = 0;
/** De puls van dit moment (0..1), voor de 3D-scènes die elke frame tekenen. */
export const getBeat = () => beatValue;
/** Waar we in de maat zijn (0..1). */
export const getBar = () => barValue;

type Sound = { on: boolean; loading: boolean; toggle: () => void };
const SoundContext = createContext<Sound>({ on: false, loading: false, toggle: () => {} });
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const bufRef = useRef<AudioBuffer | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startRef = useRef(0);
  const onRef = useRef(false);

  // Elke frame: de puls uitrekenen en als CSS-variabele zetten.
  useEffect(() => {
    let raf = 0;
    const beatLen = 60 / loop.bpm;
    const tick = () => {
      const ctx = ctxRef.current;
      let t: number;
      let strength: number;
      if (onRef.current && ctx) {
        t = ctx.currentTime - startRef.current;
        strength = 1;
      } else {
        t = performance.now() / 1000;
        strength = 0.35;
      }
      const phase = ((t % beatLen) + beatLen) % beatLen / beatLen;
      beatValue = Math.exp(-phase * 5) * strength;
      barValue = ((t / (beatLen * 4)) % 1 + 1) % 1;
      document.documentElement.style.setProperty("--beat", beatValue.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const start = useCallback(async () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AC();
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.connect(ctxRef.current.destination);
    }
    const ctx = ctxRef.current;
    const gain = gainRef.current!;
    await ctx.resume();
    if (!bufRef.current) {
      setLoading(true);
      const data = await fetch(loop.src).then((r) => r.arrayBuffer());
      bufRef.current = await ctx.decodeAudioData(data);
      setLoading(false);
    }
    const src = ctx.createBufferSource();
    src.buffer = bufRef.current;
    src.loop = true;
    src.loopStart = 0;
    src.loopEnd = Math.min(loop.seconds, bufRef.current.duration);
    src.connect(gain);
    const now = ctx.currentTime + 0.05;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.9, now + 0.4);
    src.start(now);
    startRef.current = now;
    srcRef.current = src;
    onRef.current = true;
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const src = srcRef.current;
    onRef.current = false;
    if (!ctx || !src || !gainRef.current) return;
    const now = ctx.currentTime;
    gainRef.current.gain.cancelScheduledValues(now);
    gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
    gainRef.current.gain.linearRampToValueAtTime(0, now + 0.3);
    src.stop(now + 0.35);
    srcRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    setOn((was) => {
      if (was) stop();
      else start().catch(() => setOn(false));
      return !was;
    });
  }, [start, stop]);

  return <SoundContext.Provider value={{ on, loading, toggle }}>{children}</SoundContext.Provider>;
}

export function SoundToggle({ className, label = false }: { className?: string; label?: boolean }) {
  const { on, loading, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur transition-colors hover:bg-white/10",
        label ? "px-4 py-2 text-sm" : "size-10 justify-center",
        className,
      )}
    >
      {on ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      {label && <span>{loading ? "Loading…" : on ? "Sound on" : "Sound off"}</span>}
      {/* De ring tikt mee op de tel zodra het geluid aan staat */}
      {on && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border border-white"
          style={{ opacity: "var(--beat)", transform: "scale(calc(1 + var(--beat) * 0.25))" }}
        />
      )}
    </button>
  );
}
