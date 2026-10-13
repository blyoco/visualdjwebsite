import { nav, socials } from "@/lib/site";
import { SocialIcon } from "./social-icon";

export function Footer() {
  return (
    <footer className="border-t border-line pt-16 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <a href="#top" aria-label="VisualDJ, back to top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/wordmark.webp" alt="VisualDJ" width={800} height={155} className="h-8 w-auto" />
            </a>
            <p className="mt-4 max-w-xs text-muted">Visuals that hear the music.</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {nav.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>

          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  <SocialIcon name={s.icon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-xs text-muted sm:flex-row sm:justify-between">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} Rodney Balai. All rights reserved.</p>
            <p>
              Logo design:{" "}
              <a
                href="https://fosfordesign.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 underline-offset-4 hover:text-foreground hover:underline"
              >
                Fosfor Design
              </a>
            </p>
          </div>
          <p className="max-w-xl sm:text-right">
            Windows is a trademark of the Microsoft group of companies. Pioneer DJ and DJM are trademarks of AlphaTheta
            Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
