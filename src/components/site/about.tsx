import { ArrowUpRight } from "lucide-react";
import { socials } from "@/lib/site";
import { Reveal } from "./reveal";
import { SocialIcon } from "./social-icon";

const balaiLink = (
  <a href="https://www.balai.music" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:no-underline">
    BALAI
  </a>
);

const bio: React.ReactNode[] = [
  "I have been making music for forty years. I started in hardcore – loud, fast, and built out of whatever gear I could get my hands on. These days I make techno, and I release it through Let Techno Unite Records, the label I work with.",
  <>
    VisualDJ started inside {balaiLink}, the music workstation I build – have a look at{" "}
    <a href="https://www.balai.music" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:no-underline">
      www.balai.music
    </a>
    . Its visuals were made to move with the music, and I wanted that on the big screen at a club night – without someone stuck behind a laptop all night.
  </>,
  "So I took the visuals out and built a VJ that runs by itself. It listens to the music, knows which DJ is on and keeps the room alive from doors open to lights on.",
];

// Het label, zoals op balai.music
const ltuLinks = [
  { href: "https://ltu-records.com/", label: "ltu-records.com" },
  { href: "https://www.beatport.com/label/let-techno-unite-records/115916", label: "Let Techno Unite on Beatport" },
  { href: "https://www.beatport.com/label/lturecords/126571", label: "LTU-Records on Beatport" },
  { href: "https://open.spotify.com/playlist/17wLwXnSimxoo4rut7Q1R8", label: "Label playlist on Spotify" },
  { href: "https://www.labelradar.com/labels/LetTechnoUniteRecords/portal", label: "Submit a demo" },
  { href: "https://www.instagram.com/djperroz/", label: "DJ Perroz, founder – Instagram" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <figure className="mx-auto max-w-sm lg:mx-0">
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
            <figcaption className="mt-5 text-center lg:text-left">
              <p className="text-2xl font-semibold tracking-tight">Rodney Balai</p>
              <p className="mt-1 text-sm text-muted">Producer · Let Techno Unite Records · maker of VisualDJ and BALAI</p>
            </figcaption>
          </figure>
          <ul className="mx-auto mt-6 flex max-w-sm flex-wrap justify-center gap-2 lg:mx-0 lg:justify-start">
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

          <div className="mt-10 rounded-3xl border border-line bg-white/[0.02] p-6 md:p-8">
            <div className="grid gap-6 text-center sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-8 sm:text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/ltu-logo.webp" alt="Let Techno Unite logo" width={520} height={409} loading="lazy" className="mx-auto w-40 sm:mx-0 sm:w-44" />
              <div>
                <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">The label I work for</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">Let Techno Unite Records</h3>
                <p className="mt-3 text-pretty text-muted">
                  Not my label – the label I release my techno through and work for. Let Techno Unite was founded by{" "}
                  <a
                    href="https://www.instagram.com/djperroz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:no-underline"
                  >
                    DJ Perroz
                  </a>
                  . Find the releases on Beatport, put the label playlist on, or send in a demo of your own.
                </p>
              </div>
            </div>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {ltuLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm transition-colors hover:border-white/30 hover:bg-white/5"
                  >
                    {l.label}
                    <ArrowUpRight className="size-4 shrink-0 text-muted" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
