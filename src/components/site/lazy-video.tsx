"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

// Een stille, rondlopende video die pas laadt en speelt als hij (bijna) in beeld is, en pauzeert als hij eruit is.
// Zo speelt er nooit meer dan nodig is: de pagina blijft licht, ook op een eenvoudige videokaart.
type Props = Omit<HTMLMotionProps<"video">, "ref"> & { src: string; poster?: string };

export const LazyVideo = forwardRef<HTMLVideoElement, Props>(function LazyVideo({ src, poster, ...rest }, ref) {
  const el = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => el.current!);

  useEffect(() => {
    const v = el.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.getAttribute("src")) v.setAttribute("src", src);
          v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return <motion.video ref={el} poster={poster} muted loop playsInline preload="none" {...rest} />;
});
