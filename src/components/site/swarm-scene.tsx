"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { getBeat } from "./sound";

// De zwerm uit de app: duizenden lichtpuntjes die uit een wolk samenkomen tot het logo, met de kleuren van het logo zelf.
// progress 0 = wolk, 1 = logo. Op de tel trillen ze even uit elkaar.

const COUNT = 5200;

type Pts = { start: Float32Array; target: Float32Array; color: Float32Array; seeds: Float32Array };

function useLogoPoints(src: string) {
  const [pts, setPts] = useState<Pts | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const W = 400;
      const H = Math.round((img.height / img.width) * W);
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0, W, H);
      const data = g.getImageData(0, 0, W, H).data;
      const filled: number[] = [];
      for (let y = 0; y < H; y += 1)
        for (let x = 0; x < W; x += 1) {
          const k = (y * W + x) * 4;
          if (data[k + 3] > 140 && data[k] + data[k + 1] + data[k + 2] > 300) filled.push(k);
        }
      const target = new Float32Array(COUNT * 3);
      const color = new Float32Array(COUNT * 3);
      const scale = 9 / W;
      for (let i = 0; i < COUNT; i++) {
        const k = filled[Math.floor(Math.random() * filled.length)];
        const p = k / 4;
        const x = p % W;
        const y = Math.floor(p / W);
        target.set([(x - W / 2) * scale, -(y - H / 2) * scale, (Math.random() - 0.5) * 0.15], i * 3);
        color.set([data[k] / 255, data[k + 1] / 255, data[k + 2] / 255], i * 3);
      }
      // De wolk waar ze vandaan komen, en per puntje een eigen moment van aankomen.
      const start = new Float32Array(COUNT * 3);
      const seeds = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        const r = 6 + Math.random() * 6;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        start.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph)], i * 3);
        seeds[i] = Math.random();
      }
      setPts({ start, target, color, seeds });
    };
  }, [src]);
  return pts;
}

function Swarm({ progress, pts }: { progress: MotionValue<number>; pts: Pts }) {
  const { start, target, color, seeds } = pts;
  const geo = useRef<THREE.BufferGeometry>(null);
  // Het logo is 9 breed; op een smal scherm schaalt het mee, zodat het er altijd helemaal op staat.
  const fit = Math.min(1, useThree((s) => s.viewport.width) / 10.5);
  const initial = useMemo(() => new Float32Array(start), [start]);

  useFrame(({ clock }) => {
    const attr = geo.current?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const pos = attr.array as Float32Array;
    const t = clock.elapsedTime;
    const pr = progress.get();
    const beat = getBeat();
    for (let i = 0; i < COUNT; i++) {
      // Elk puntje heeft zijn eigen moment om aan te komen, zodat het logo zich vlok voor vlok vult.
      const s = seeds[i];
      const local = Math.min(1, Math.max(0, (pr - s * 0.35) / 0.55));
      const e = 1 - Math.pow(1 - local, 3);
      const j = i * 3;
      const wob = (1 - e) * 0.6 + beat * 0.08;
      pos[j] = start[j] + (target[j] - start[j]) * e + Math.sin(t * 1.3 + s * 40) * wob;
      pos[j + 1] = start[j + 1] + (target[j + 1] - start[j + 1]) * e + Math.cos(t * 1.1 + s * 30) * wob;
      pos[j + 2] = start[j + 2] + (target[j + 2] - start[j + 2]) * e + Math.sin(t * 0.9 + s * 20) * wob;
    }
    attr.needsUpdate = true;
  });

  return (
    <points scale={fit}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[initial, 3]} />
        <bufferAttribute attach="attributes-color" args={[color, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function SwarmScene({ progress }: { progress: MotionValue<number> }) {
  const pts = useLogoPoints("/img/wordmark.webp");
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 55 }} gl={{ alpha: true }}>
      {pts && <Swarm progress={progress} pts={pts} />}
    </Canvas>
  );
}
