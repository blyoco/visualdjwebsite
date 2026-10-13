"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const HEADER = 64;

let current: Lenis | null = null;
/** De pagina even stilzetten (bijvoorbeeld zolang een filmpje open is) en weer laten scrollen. */
export const pauseScroll = (on: boolean) => {
  if (on) current?.stop();
  else current?.start();
};

// Boterzacht scrollen. Een klik op een link naar een onderdeel springt er meteen naartoe, maar komt net ervoor (of erna)
// uit en glijdt het laatste stuk: naar beneden glijdt het onderdeel omhoog in beeld, naar boven glijdt het omlaag.
export function SmoothScroll() {
  useEffect(() => {
    // respectReducedMotion uit: anders scrollt Lenis hard en springen links zonder glijden (de pc van de gebruiker staat op "minder beweging").
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, respectReducedMotion: false });
    current = lenis;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el && id !== "top" && id !== "") return;
      e.preventDefault();

      const target = el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : HEADER)) : 0;
      const now = window.scrollY;
      const dir = Math.sign(target - now);
      const slide = Math.min(window.innerHeight * 0.35, Math.abs(target - now));
      // Eerst in één keer bijna erheen, dan het laatste stuk glijden
      if (dir !== 0) lenis.scrollTo(target - dir * slide, { immediate: true, force: true });
      lenis.scrollTo(target, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), force: true });
      history.replaceState(null, "", id ? `#${id}` : location.pathname);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      current = null;
    };
  }, []);
  return null;
}
