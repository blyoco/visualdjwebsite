"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Boterzacht scrollen.
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -64 } });
    return () => lenis.destroy();
  }, []);
  return null;
}
