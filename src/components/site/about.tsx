import { socials } from "@/lib/site";
import { Reveal } from "./reveal";
import { SocialIcon } from "./social-icon";

const bio = [
  "I have been making music for forty years. I started in hardcore – loud, fast, and built out of whatever gear I could get my hands on. These days I make techno.",
  "VisualDJ started inside BALAI, the music workstation I build. Its visuals were made to move with the music, and I wanted that on the big screen at a club night – without someone stuck behind a laptop all night.",
  "So I took the visuals out and built a VJ that runs by itself. It listens to the mixer, knows which DJ is on and keeps the room alive from doors open to lights on.",
];

export function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <figure className="max-w-sm">
            <div className="overflow-hidden rounded-3xl border border-line bg-white/[0.02] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/rodney-balai.webp"
                alt="Black-and-white portrait of Rodney Balai"
                width={447}
                height={447}
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover grayscale"
              />
            </div>
            <figcaption className="mt-5">
              <p className="text-2xl font-semibold tracking-tight">Rodney Balai</p>
              <p className="mt-1 text-sm text-muted">Producer · maker of VisualDJ and BALAI</p>
            </figcaption>
          </figure>
          <ul className="mt-6 flex max-w-sm flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  <SocialIcon name={s.icon} className="size-4" />
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted">{s.detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">About me</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Made by someone who stands next to the booth.
          </h2>
          <div className="mt-7 space-y-5 text-lg text-pretty text-muted">
            {bio.map((p, i) => (
              <p key={i} className={i === bio.length - 1 ? "text-foreground" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
