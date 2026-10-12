import { Check } from "lucide-react";
import { clip } from "@/lib/site";
import { Reveal } from "./reveal";
import { LazyVideo } from "./lazy-video";

const points = [
  "Windows 10 and 11",
  "One file – no installer, no account",
  "Works with any audio input; reads the BPM of a Pioneer DJM-900NXS2 or DJM-A9",
  "Remote control from your phone",
];

export function Beta() {
  return (
    <section id="beta" className="scroll-mt-16 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white/[0.02] px-6 py-14 text-center sm:px-12 sm:py-20">
            {/* De visuals als zachte gloed achter het blok */}
            <LazyVideo
              src={clip("world").small}
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full scale-125 object-cover opacity-25 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 font-mono text-xs tracking-[0.2em] uppercase">
                <span className="size-1.5 animate-pulse rounded-full bg-foreground" />
                Beta
              </span>
              <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">Get in early.</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
                VisualDJ is in beta for Windows PC. It already runs real nights. Join now, help shape what comes next.
              </p>

              <ul className="mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 rounded-2xl border border-line bg-black/40 px-4 py-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              {/* Gaat nog nergens heen: de download of wachtlijst komt later. */}
              <button
                type="button"
                className="mt-10 rounded-full bg-foreground px-8 py-4 font-medium text-black transition-transform hover:scale-105"
              >
                Get VisualDJ
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
