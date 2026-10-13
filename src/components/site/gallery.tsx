"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { Play, X } from "lucide-react";
import { clip, type ClipName } from "@/lib/site";
import { LazyVideo } from "./lazy-video";
import { pauseScroll } from "./smooth-scroll";

// Een cilinder van schermen die meedraait met het scrollen: een avond VisualDJ in tien momenten.
// Klik op een scherm: het filmpje groeit vanaf zijn plek naar het midden; wegklikken laat het terugvallen.

const about: Record<ClipName, { label: string; text: string }> = {
  standard: { label: "Standard", text: "Shapes and worlds that switch on the beat, every 4, 8, 12 or 16 counts." },
  story: { label: "Story", text: "One continuous journey with a living camera that feels the build-up and the drop." },
  follow: { label: "Follow", text: "The journey with a line of fire curling from the centre and a calm camera." },
  dance: { label: "Dance", text: "The swarm dances all the time, in moves that land on the bar: calm in a break, a peak on the drop." },
  world: { label: "World", text: "Full worlds of shapes that switch and break open on the beat." },
  texts: { label: "Texts", text: "Words that move through the picture on the beat, in 115 movements." },
  background: { label: "Background", text: "Your own artwork behind the picture, turning and breathing with the music." },
};

const items: ClipName[] = ["standard", "story", "dance", "follow", "world", "story", "standard", "follow", "world", "dance"];

type Open = { i: number; rect: DOMRect };

function Lightbox({ open, onClose }: { open: Open; onClose: () => void }) {
  const name = items[open.i];
  const { rect } = open;
  // Het doel: zo groot als past, in het midden, met ruimte voor de tekst eronder.
  const [box] = useState(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(vw - 32, 1280, ((vh - 200) * 16) / 9);
    const h = (w * 9) / 16;
    return { left: (vw - w) / 2, top: Math.max(72, (vh - h - 110) / 2), width: w, height: h };
  });
  const from = { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: 16 };

  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`${about[name].label}, rendered by VisualDJ`}>
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 cursor-zoom-out bg-black/85 backdrop-blur-xl"
      />
      <motion.div
        initial={from}
        animate={{ ...box, borderRadius: 28 }}
        exit={from}
        transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
        className="fixed overflow-hidden border border-white/20 bg-black shadow-[0_0_160px_-20px_rgba(255,255,255,0.35)]"
      >
        <video src={clip(name).src} poster={clip(name).poster} autoPlay loop muted playsInline className="size-full object-cover" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5 } }}
        exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
        className="pointer-events-none fixed inset-x-0 px-4 text-center"
        style={{ top: box.top + box.height + 20 }}
      >
        <p className="font-mono text-xs tracking-[0.35em] text-white/60 uppercase">Rendered by VisualDJ</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight">{about[name].label}</h3>
        <p className="mx-auto mt-2 max-w-lg text-white/70">{about[name].text}</p>
      </motion.div>
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
        exit={{ opacity: 0 }}
        className="fixed top-5 right-5 grid size-12 place-items-center rounded-full border border-white/25 bg-black/60 backdrop-blur transition-colors hover:bg-white/15"
      >
        <X className="size-5" />
      </motion.button>
    </div>
  );
}

export function Gallery() {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: "300px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [20, -300]);
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8]);
  const [open, setOpen] = useState<Open | null>(null);
  // Het scherm in de cilinder blijft weg tot het filmpje helemaal terug is gekrompen.
  const [hidden, setHidden] = useState<number | null>(null);

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

  // Zolang een filmpje open is, staat de pagina stil (anders draait de cilinder eronder door).
  useEffect(() => {
    pauseScroll(!!open);
    return () => pauseScroll(false);
  }, [open]);

  return (
    <section ref={section} data-gallery className="relative h-[300vh] border-t border-line">
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 px-4 text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Rendered by VisualDJ</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tighter sm:text-7xl">One night, many worlds.</h2>
          <p className="mt-4 text-sm text-muted">Scroll to turn. Click a screen to watch.</p>
        </div>

        <div className="mt-10 h-[45vh] w-full sm:mt-12" style={{ perspective: 1600 }}>
          <motion.div
            className="relative mx-auto h-full"
            style={{ width: w, rotateY, rotateX: tilt, transformStyle: "preserve-3d" }}
          >
            {items.map((name, i) => (
              <div
                key={i}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, backfaceVisibility: "hidden" }}
              >
                <button
                  type="button"
                  aria-label={`Watch ${about[name].label}`}
                  onClick={(e) => {
                    setOpen({ i, rect: e.currentTarget.getBoundingClientRect() });
                    setHidden(i);
                  }}
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_0_60px_-10px_rgba(255,255,255,0.15)] transition-[border-color,box-shadow] duration-300 hover:border-white/50 hover:shadow-[0_0_80px_-5px_rgba(255,255,255,0.35)]"
                  style={{ visibility: hidden === i ? "hidden" : "visible" }}
                >
                  {inView ? (
                    <LazyVideo src={clip(name).small} poster={clip(name).poster} className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="aspect-video w-full" />
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                    <span className="grid size-14 place-items-center rounded-full border border-white/40 bg-black/50 backdrop-blur">
                      <Play className="ml-0.5 size-5" />
                    </span>
                  </span>
                </button>
                <p className="mt-3 text-center font-mono text-[10px] tracking-[0.3em] text-white/60 uppercase">{about[name].label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {hidden !== null &&
        createPortal(
          <AnimatePresence onExitComplete={() => setHidden(null)}>
            {open && <Lightbox key={open.i} open={open} onClose={() => setOpen(null)} />}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
