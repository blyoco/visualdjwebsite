"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getHref, nav as links } from "@/lib/site";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-line bg-black/70 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="VisualDJ home" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/wordmark.webp" alt="VisualDJ" width={800} height={155} className="h-6 w-auto sm:h-7" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
          <a
            href={getHref}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            Get VisualDJ
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 px-4 pb-4 md:hidden">
          {[...links, { href: getHref, label: "Get VisualDJ" }].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base hover:bg-white/5">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  );
}

