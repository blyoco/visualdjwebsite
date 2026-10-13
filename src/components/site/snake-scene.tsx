"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Twee slangen van grijs-witte pixeltjes, één langs elke rand. Ze bewegen alleen als je scrolt: een golf buigt ze naar
// het midden, daar snijden ze elkaar, en dan golven ze terug naar hun rand (omhoog scrollen = andersom). Wat beweegt,
// verliest stof: pixeltjes die loslaten en wegwaaien. De camera is orthografisch: één eenheid is één pixel.

const SEG = 760; // pixeltjes per slang
const DUST = 6000; // stofjes, steeds opnieuw gebruikt

const vertex = /* glsl */ `
  attribute float aBright;
  attribute float aAlpha;
  uniform float uSize, uPx;
  varying float vBright;
  varying float vAlpha;
  void main() {
    vBright = aBright;
    vAlpha = aAlpha;
    gl_PointSize = uSize * uPx;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
// Vierkante pixels, geen ronde bolletjes.
const fragment = /* glsl */ `
  uniform float uOpacity;
  varying float vBright;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vec3(vBright), vAlpha * uOpacity);
  }
`;

function material(size: number) {
  return [
    {
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms: { uSize: { value: size }, uPx: { value: 1 }, uOpacity: { value: 0 } },
    },
  ] as [THREE.ShaderMaterialParameters];
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function Snakes() {
  const { size, viewport } = useThree();
  const snakeGeo = useRef<THREE.BufferGeometry>(null);
  const dustGeo = useRef<THREE.BufferGeometry>(null);
  const snakeMat = useRef<THREE.ShaderMaterial>(null);
  const dustMat = useRef<THREE.ShaderMaterial>(null);
  const snakeArgs = useMemo(() => material(1.6), []);
  const dustArgs = useMemo(() => material(1.3), []);

  // Vaste eigenschappen per pixeltje: helderheid (grijs tot wit) en een eigen ritme voor het fonkelen.
  const init = useMemo(() => {
    const rnd = seeded(97);
    const pos = new Float32Array(SEG * 2 * 3);
    const bright = new Float32Array(SEG * 2);
    const alpha = new Float32Array(SEG * 2).fill(1);
    for (let i = 0; i < SEG * 2; i++) bright[i] = 0.55 + 0.4 * rnd() + (rnd() < 0.04 ? 0.25 : 0);
    const dPos = new Float32Array(DUST * 3).fill(-99999);
    const dBright = new Float32Array(DUST);
    const dAlpha = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) dBright[i] = 0.6 + 0.4 * rnd();
    return { pos, bright, alpha, dPos, dBright, dAlpha };
  }, []);

  // Wat elk frame verandert, buiten React om.
  const stateRef = useRef({
      phase: 0, // de golf, volgt de scroll met vertraging
      prev: new Float32Array(SEG * 2), // x van elk pixeltje in het vorige frame
      vel: new Float32Array(DUST * 2),
      life: new Float32Array(DUST),
      maxLife: new Float32Array(DUST),
      next: 0,
      started: false,
  });

  useFrame((_, dtRaw) => {
    const state = stateRef.current;
    const dt = Math.min(dtRaw, 1 / 20);
    const sg = snakeGeo.current;
    const dg = dustGeo.current;
    if (!sg || !dg || !snakeMat.current || !dustMat.current) return;
    const w = size.width;
    const h = size.height;
    const small = w < 768;
    const y = window.scrollY;

    // Rustig: de golf loopt met gewicht achter de scroll aan. Eén keer rand → kruisen → rand per 2,6 schermhoogtes.
    const target = (y / (h * 2.6)) * Math.PI * 2;
    if (!state.started) {
      state.phase = target;
      state.started = true;
    }
    state.phase += (target - state.phase) * Math.min(1, dt * 2.2);
    const ph = state.phase;

    // 0 aan de rand, 1 waar ze elkaar voorbij zijn
    const c = 0.5 - 0.5 * Math.cos(ph);
    const edge = w / 2 - (small ? 14 : 34);
    const reach = edge * 1.45;
    const wig = small ? 10 : 22;

    const pos = sg.getAttribute("position") as THREE.BufferAttribute;
    const p = pos.array as Float32Array;
    const dPosAttr = dg.getAttribute("position") as THREE.BufferAttribute;
    const dp = dPosAttr.array as Float32Array;
    const dAlphaAttr = dg.getAttribute("aAlpha") as THREE.BufferAttribute;
    const da = dAlphaAttr.array as Float32Array;
    const rnd = Math.random;

    for (let s = 0; s < 2; s++) {
      const side = s === 0 ? -1 : 1; // links, rechts
      for (let i = 0; i < SEG; i++) {
        const t = i / (SEG - 1); // 0 onder, 1 boven
        const yy = (t - 0.5) * h * 1.1;
        // De bocht: de golf komt niet overal tegelijk, zodat de slang een S maakt in plaats van een rechte lijn te schuiven.
        const bend = 0.72 + 0.28 * Math.sin(t * 5.2 + ph * 1.3 + s * 2.1);
        const wiggle = wig * Math.sin(t * 13.0 - ph * 2.0 + s * 1.7) + wig * 0.4 * Math.sin(t * 29.0 + ph * 3.1);
        const x = side * (-edge + c * reach * bend) * -1 + wiggle;
        const k = s * SEG + i;
        const j = k * 3;
        // Hoeveel dit pixeltje bewoog: daar komt het stof vandaan
        const moved = x - state.prev[k];
        state.prev[k] = x;
        p[j] = x;
        p[j + 1] = yy;
        p[j + 2] = 0;
        const speed = Math.abs(moved) / dt;
        if (speed > 6 && rnd() < Math.min(0.025, speed * 0.00005)) {
          const d = state.next;
          state.next = (state.next + 1) % DUST;
          dp[d * 3] = x + (rnd() - 0.5) * 3;
          dp[d * 3 + 1] = yy + (rnd() - 0.5) * 3;
          dp[d * 3 + 2] = 0;
          // Wegwaaien: achter de beweging aan, met een vlaag opzij en wat op en neer
          state.vel[d * 2] = -Math.sign(moved) * (18 + rnd() * 45) + (rnd() - 0.5) * 20;
          state.vel[d * 2 + 1] = (rnd() - 0.5) * 30 + 8;
          state.maxLife[d] = 1.6 + rnd() * 1.6;
          state.life[d] = state.maxLife[d];
        }
      }
    }
    pos.needsUpdate = true;

    // Het stof: drijft weg, remt af, krult in een zacht windje en vervaagt
    for (let d = 0; d < DUST; d++) {
      if (state.life[d] <= 0) {
        da[d] = 0;
        continue;
      }
      state.life[d] -= dt;
      const age = 1 - state.life[d] / state.maxLife[d];
      state.vel[d * 2] *= 1 - dt * 0.6;
      state.vel[d * 2 + 1] += Math.sin(dp[d * 3] * 0.02 + age * 6) * 12 * dt;
      dp[d * 3] += state.vel[d * 2] * dt;
      dp[d * 3 + 1] += state.vel[d * 2 + 1] * dt;
      da[d] = Math.max(0, 1 - age) * 0.8;
    }
    dPosAttr.needsUpdate = true;
    dAlphaAttr.needsUpdate = true;

    // Pas zichtbaar na de tunnel, zacht weg boven de zwerm; in het midden iets zachter zodat tekst leesbaar blijft.
    const hero = document.getElementById("top");
    const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - h : 0;
    const docEnd = document.documentElement.scrollHeight - h;
    const fadeIn = Math.min(1, Math.max(0, (y - heroEnd + h * 0.6) / (h * 0.6)));
    const fadeOut = Math.min(1, Math.max(0, (docEnd - y - h * 1.2) / (h * 0.8)));
    const op = fadeIn * fadeOut * (small ? 0.6 : 0.85) * (1 - Math.max(0, c - 0.6) * 0.6);
    for (const m of [snakeMat.current, dustMat.current]) {
      m.uniforms.uPx.value = viewport.dpr;
      m.uniforms.uOpacity.value = op;
    }
  });

  return (
    <>
      <points frustumCulled={false}>
        <bufferGeometry ref={snakeGeo}>
          <bufferAttribute attach="attributes-position" args={[init.pos, 3]} />
          <bufferAttribute attach="attributes-aBright" args={[init.bright, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[init.alpha, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={snakeMat} args={snakeArgs} />
      </points>
      <points frustumCulled={false}>
        <bufferGeometry ref={dustGeo}>
          <bufferAttribute attach="attributes-position" args={[init.dPos, 3]} />
          <bufferAttribute attach="attributes-aBright" args={[init.dBright, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[init.dAlpha, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={dustMat} args={dustArgs} />
      </points>
    </>
  );
}

export default function SnakeScene() {
  return (
    // pointerEvents none op de Canvas zelf: R3F zet hem anders op "auto" en dan vangt deze laag alle klikken af.
    <Canvas style={{ pointerEvents: "none" }} orthographic dpr={[1, 2]} camera={{ position: [0, 0, 500], zoom: 1, near: 1, far: 2000 }} gl={{ alpha: true, antialias: false }}>
      <Snakes />
    </Canvas>
  );
}
