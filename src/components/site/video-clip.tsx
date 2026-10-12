"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

// Een video die stil start (browsers staan automatisch afspelen alleen zonder geluid toe).
// Heeft het bestand een geluidsspoor, dan komt er een knop om het geluid aan te zetten.
export function VideoClip({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const check = () => {
      const m = v as HTMLVideoElement & { mozHasAudio?: boolean; audioTracks?: { length: number } };
      setHasAudio(Boolean(m.mozHasAudio || (m.audioTracks && m.audioTracks.length > 0)));
    };
    v.addEventListener("loadedmetadata", check);
    return () => v.removeEventListener("loadedmetadata", check);
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video ref={ref} src={src} autoPlay loop muted={muted} playsInline preload="metadata" className="size-full object-cover" />
      {hasAudio && (
        <button
          type="button"
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          onClick={() => setMuted((m) => !m)}
          className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black/80"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      )}
    </div>
  );
}
