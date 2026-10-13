import { CircleDot, FileArchive, Gauge, Languages, MonitorUp, Smartphone } from "lucide-react";
import { Reveal } from "./reveal";

// Alles wat er verder in zit, als tegels. Het geluid staat bij de features; de drie standen in WorkModes.

const items = [
  {
    icon: Smartphone,
    title: "Remote on your phone",
    text: "Open an address on your phone, log in with your code and run the night from the floor: play, extend, next, the kind of picture, the main controls – and type a text straight onto the screen.",
    wide: true,
  },
  {
    icon: CircleDot,
    title: "Records alongside you",
    text: "VisualDJ shares the audio input, so your livestream or recording keeps running. Cap how much CPU it may use and the recording always comes first.",
  },
  {
    icon: Languages,
    title: "Your language",
    text: "English and Dutch built in. Any other language is translated once, online – the app and the remote follow it.",
  },
  {
    icon: FileArchive,
    title: "One show file",
    text: "The whole night – DJs, times, media, backgrounds, settings and render choices – in one .vdj file. Build it at home, open it at the venue.",
  },
  {
    icon: MonitorUp,
    title: "Straight to the projector",
    text: "A separate output window for the HDMI screen, full screen with a double-click. It remembers where it was, and finds its way back when the screens change.",
  },
  {
    icon: Gauge,
    title: "Smooth on any laptop",
    text: "Performance, balance or quality – up to 4K. Picks itself to suit the PC, and starts with Windows if you want it to.",
    wide: true,
  },
];

export function More() {
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">And there&apos;s more</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tighter sm:text-6xl">Built for the real night.</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 3) * 0.08} className={it.wide ? "md:col-span-2" : undefined}>
              <article className="group h-full rounded-3xl border border-line bg-white/[0.02] p-7 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.05]">
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-white/5 transition-transform duration-300 group-hover:scale-110">
                  <it.icon className="size-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{it.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
