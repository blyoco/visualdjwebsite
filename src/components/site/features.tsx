import { AudioLines, CalendarClock, Images } from "lucide-react";
import { Reveal } from "./reveal";

const features = [
  {
    icon: AudioLines,
    title: "Hears the beat",
    text: "Plug in your mixer over USB. VisualDJ finds every kick, locks onto the tempo within seconds and cuts the visuals on the beat. Got a Pioneer DJM? It can read the mixer's own BPM too.",
  },
  {
    icon: CalendarClock,
    title: "Runs the whole night",
    text: "Put your DJs on a timeline with their set times. The visuals follow the clock: each DJ gets their own look, their own media, and a clean handover to the next. Running late? Hit Extend.",
  },
  {
    icon: Images,
    title: "Your media, mixed in",
    text: "Drop in photos, videos, logos and texts per DJ or for the whole event. VisualDJ weaves them through the animations, with forty ways to bring text on screen, always on the one.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Features</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Set it up once. Play all night.</h2>
          <p className="mt-5 text-lg text-muted">No VJ needed behind the laptop. VisualDJ does the watching, the listening and the switching.</p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <article className="group h-full rounded-3xl border border-line bg-white/[0.02] p-7 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.05]">
                <div className="grid size-12 place-items-center rounded-2xl border border-line bg-white/5 transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
