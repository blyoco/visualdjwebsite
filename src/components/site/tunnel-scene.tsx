"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { clip, type ClipName } from "@/lib/site";
import { getBeat } from "./sound";

// De tunnel uit Story, als hero: vierkante ringen die de diepte in gaan, zwevende schermen met clips uit de app,
// en aan het eind één groot scherm. De scroll (progress 0..1) bepaalt waar de camera is; de ringen tikken op de tel.

const RINGS = 56;
const GAP = 3.2;
const LENGTH = RINGS * GAP;
const END_Z = -LENGTH + 6;

const panels: { name: ClipName; x: number; y: number; z: number; ry: number }[] = [
  { name: "story", x: -2.6, y: 0.9, z: -18, ry: 0.35 },
  { name: "follow", x: 2.7, y: -0.8, z: -40, ry: -0.35 },
  { name: "dance", x: -2.4, y: -1.0, z: -64, ry: 0.3 },
  { name: "world", x: 2.5, y: 1.0, z: -88, ry: -0.3 },
  { name: "follow", x: -2.6, y: 0.6, z: -112, ry: 0.35 },
  { name: "story", x: 2.6, y: -0.7, z: -136, ry: -0.3 },
];

// Kleuren langs de tunnel: van koel naar warm, zoals de paletten van de app om de beurt wisselen.
const palette = ["#22d3ee", "#6366f1", "#a855f7", "#ec4899", "#f97316", "#facc15"].map((c) => new THREE.Color(c));
function colorAt(t: number, out: THREE.Color) {
  const f = (((t % 1) + 1) % 1) * palette.length;
  const i = Math.floor(f);
  return out.copy(palette[i]).lerp(palette[(i + 1) % palette.length], f - i);
}

// Een video als textuur, zonder te wachten: tot hij speelt is het scherm zwart.
function useClipTexture(src: string) {
  const [tex, setTex] = useState<THREE.VideoTexture | null>(null);
  useEffect(() => {
    const v = document.createElement("video");
    Object.assign(v, { src, muted: true, loop: true, playsInline: true, crossOrigin: "anonymous", preload: "auto" });
    const t = new THREE.VideoTexture(v);
    t.colorSpace = THREE.SRGBColorSpace;
    const ready = () => setTex(t);
    v.addEventListener("loadeddata", ready, { once: true });
    v.play().catch(() => {});
    return () => {
      v.pause();
      v.removeAttribute("src");
      v.load();
      t.dispose();
    };
  }, [src]);
  return tex;
}

function Rings() {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => new THREE.TorusGeometry(5.2, 0.035, 3, 4), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const mats = useMemo(
    () => Array.from({ length: RINGS }, () => new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false })),
    [],
  );

  useFrame(({ clock }) => {
    const beat = getBeat();
    const t = clock.elapsedTime;
    group.current?.children.forEach((ring, i) => {
      const m = mats[i];
      colorAt(i / RINGS + t * 0.03, m.color);
      m.color.lerp(tmp.set("#ffffff"), beat * 0.5);
      m.opacity = 0.35 + beat * 0.65;
      const s = 1 + beat * 0.06 * Math.sin(i * 0.7 + 1);
      ring.scale.setScalar(s);
      ring.rotation.z = Math.PI / 4 + Math.sin(t * 0.25 + i * 0.12) * 0.12;
    });
  });

  return (
    <group ref={group}>
      {mats.map((m, i) => (
        <mesh key={i} geometry={geo} material={m} position={[0, 0, -i * GAP]} />
      ))}
    </group>
  );
}

function Panel({ name, x, y, z, ry, w = 3.2 }: { name: ClipName; x: number; y: number; z: number; ry: number; w?: number }) {
  const tex = useClipTexture(clip(name).small);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.position.y = y + Math.sin(clock.elapsedTime * 0.6 + z) * 0.12;
    const s = 1 + getBeat() * 0.03;
    mesh.current.scale.set(s, s, 1);
  });
  return (
    <mesh ref={mesh} position={[x, y, z]} rotation={[0, ry, 0]}>
      <planeGeometry args={[w, (w * 9) / 16]} />
      <meshBasicMaterial key={tex ? "v" : "z"} map={tex} color={tex ? "#fff" : "#000"} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function EndScreen() {
  const tex = useClipTexture(clip("standard").src);
  return (
    <mesh position={[0, 0, END_Z - 4]}>
      <planeGeometry args={[12.8, 7.2]} />
      <meshBasicMaterial key={tex ? "v" : "z"} map={tex} color={tex ? "#fff" : "#000"} toneMapped={false} />
    </mesh>
  );
}

function Rig({ progress }: { progress: MotionValue<number> }) {
  const pointer = useRef({ x: 0, y: 0 });
  useFrame(({ camera, pointer: p, clock }, dt) => {
    const k = Math.min(1, dt * 3);
    pointer.current.x += (p.x - pointer.current.x) * k;
    pointer.current.y += (p.y - pointer.current.y) * k;
    const pr = progress.get();
    // Rustig beginnen, versnellen in het midden, afremmen voor het grote scherm
    const eased = pr < 0.5 ? 2 * pr * pr : 1 - Math.pow(-2 * pr + 2, 2) / 2;
    const targetZ = 6 - eased * (6 - END_Z + 0.5);
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, dt * 6);
    const sway = 1 - pr;
    camera.position.x = pointer.current.x * 0.9 * sway + Math.sin(clock.elapsedTime * 0.3) * 0.25 * sway;
    camera.position.y = pointer.current.y * 0.6 * sway;
    camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 10);
  });
  return null;
}

export default function TunnelScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 62, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color("#000");
        scene.fog = new THREE.Fog("#000", 12, 70);
      }}
    >
      <Rig progress={progress} />
      <Rings />
      {panels.map((p, i) => (
        <Panel key={i} {...p} />
      ))}
      <EndScreen />
    </Canvas>
  );
}
