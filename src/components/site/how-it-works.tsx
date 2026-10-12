import { Reveal } from "./reveal";

const steps = [
  {
    n: "01",
    title: "Plug in",
    text: "Connect your mixer over USB and pick the input. VisualDJ shares it with your stream or recording and never touches the mixer's settings.",
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

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">How it works</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Three steps to a full night.</h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="relative">
              <div className="font-mono text-sm text-muted">{s.n}</div>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-white/40 to-transparent" />
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <figure className="overflow-hidden rounded-2xl border border-line bg-white/[0.02] shadow-[0_0_120px_-40px_rgba(255,255,255,0.25)] sm:rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/app-window.png"
              alt="The VisualDJ window: the night on a timeline, DJ folders on the left, the live picture and media on the right"
              loading="lazy"
              className="w-full"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
