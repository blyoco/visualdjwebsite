"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getBeat } from "./sound";

// De DNA uit de app (moreshapes.js, vorm 60): twee gloeiende ruggengraten van lichtpuntjes met sporten ertussen in
// partnerkleuren, de kant die het dichtst bij is helderder. Hier staan er twee rechtop over de hele hoogte van het scherm.
// Scrollen draait ze tegengesteld en laat ze naar elkaar toe schuiven, in het midden kruisen en weer uit elkaar gaan.
// De camera is orthografisch: één eenheid is één pixel.

const vertex = /* glsl */ `
  attribute float aY;
  attribute float aKind;   // 0 en 1: de twee ruggengraten, 2: een sport
  attribute float aW;      // waar op de sport (0..1)
  attribute vec3 aRnd;
  uniform float uAngle, uX, uR, uH, uTurns, uBeat, uSize, uTime, uPx, uBend, uWave, uPhase;
  uniform vec3 uColA, uColB;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    // De as slingert als een slang: twee golven over elkaar, die met de scroll (uPhase) door de helix kruipen.
    float a1 = aY * uWave + uPhase;
    float a2 = aY * uWave * 2.1 - uPhase * 1.3;
    float ax = uBend * (sin(a1) + 0.35 * sin(a2));
    float dxdy = uBend * uWave * (cos(a1) + 0.35 * 2.1 * cos(a2)) / uH;
    vec2 tang = normalize(vec2(dxdy, 1.0));
    vec2 nrm = vec2(tang.y, -tang.x);                   // dwars op de as, in het vlak van het scherm
    float y = aY * uH;
    float th = aY * uTurns * 6.2831853 + uAngle;
    float gr = 2.3;                                    // de groef tussen de twee strengen
    float r = uR * (1.0 + 0.06 * sin(aY * 9.0 + uTime));
    // De strengen draaien om de gebogen as: dwars (nrm) en de diepte in (z)
    vec3 pA = vec3(nrm * (r * cos(th)), r * sin(th));
    vec3 pB = vec3(nrm * (r * cos(th + gr)), r * sin(th + gr));
    vec3 p;
    vec3 col;
    if (aKind < 0.5) { p = pA; col = uColA; }
    else if (aKind < 1.5) { p = pB; col = uColB; }
    else { p = mix(pA, pB, aW); col = aW < 0.5 ? uColA : uColB; }
    p += (aRnd - 0.5) * vec3(5.0, 5.0, 5.0);
    p.xy += vec2(ax + uX, y);
    float near = 0.5 + 0.5 * (p.z / max(uR, 1.0));      // 0 achter, 1 voor
    vColor = col * (0.55 + 0.75 * near + uBeat * 0.6);
    vAlpha = (aKind > 1.5 ? 0.55 : 0.9) * (0.35 + 0.65 * near);
    gl_PointSize = uSize * uPx * (0.6 + 0.7 * near) * (1.0 + uBeat * 0.7) * (aKind > 1.5 ? 0.7 : 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha * uOpacity);
  }
`;

const palette = ["#22d3ee", "#6366f1", "#a855f7", "#ec4899", "#f97316", "#facc15", "#34d399"].map((c) => new THREE.Color(c));
function colorAt(t: number, out: THREE.Color) {
  const f = (((t % 1) + 1) % 1) * palette.length;
  const i = Math.floor(f);
  return out.copy(palette[i]).lerp(palette[(i + 1) % palette.length], f - i);
}

function makeGeometry(strandPoints: number, rungs: number, perRung: number, seed: number) {
  const n = strandPoints * 2 + rungs * perRung;
  const aY = new Float32Array(n);
  const aKind = new Float32Array(n);
  const aW = new Float32Array(n);
  const aRnd = new Float32Array(n * 3);
  let rnd = seed;
  const random = () => {
    rnd = (rnd * 16807) % 2147483647;
    return rnd / 2147483647;
  };
  let k = 0;
  for (let s = 0; s < 2; s++)
    for (let i = 0; i < strandPoints; i++, k++) {
      aY[k] = i / (strandPoints - 1) - 0.5;
      aKind[k] = s;
      aRnd.set([random(), random(), random()], k * 3);
    }
  for (let j = 0; j < rungs; j++)
    for (let i = 0; i < perRung; i++, k++) {
      aY[k] = (j + 0.5) / rungs - 0.5;
      aKind[k] = 2;
      aW[k] = (i + 0.5) / perRung;
      aRnd.set([random() * 0.4, random() * 0.4, random() * 0.4], k * 3);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute("aY", new THREE.BufferAttribute(aY, 1));
  g.setAttribute("aKind", new THREE.BufferAttribute(aKind, 1));
  g.setAttribute("aW", new THREE.BufferAttribute(aW, 1));
  g.setAttribute("aRnd", new THREE.BufferAttribute(aRnd, 3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
  return g;
}

// De scroll van dit moment, gedeeld door beide helixen: positie, snelheid en hoe zichtbaar ze zijn.
const scroll = { y: 0, vel: 0, angle: 0, visible: 0 };

function Driver() {
  useFrame((_, dt) => {
    const y = window.scrollY;
    const v = (y - scroll.y) / Math.max(dt, 1 / 120);
    scroll.vel += (v - scroll.vel) * Math.min(1, dt * 6);
    scroll.y = y;
    // Draaien met het scrollen mee (omhoog = terug), en heel langzaam door als je stilstaat.
    scroll.angle += (scroll.vel * 0.0035 + 0.25) * dt;
    // Pas zichtbaar na de tunnel, zacht weg boven de footer-zwerm.
    const hero = document.getElementById("top");
    const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 0;
    const docEnd = document.documentElement.scrollHeight - window.innerHeight;
    const fadeIn = Math.min(1, Math.max(0, (y - heroEnd + window.innerHeight * 0.6) / (window.innerHeight * 0.6)));
    const fadeOut = Math.min(1, Math.max(0, (docEnd - y - window.innerHeight * 1.2) / (window.innerHeight * 0.8)));
    scroll.visible = fadeIn * fadeOut;
  });
  return null;
}

function Helix({ side, seed }: { side: 1 | -1; seed: number }) {
  const { size, viewport } = useThree();
  const small = size.width < 768;
  const geo = useMemo(() => (small ? makeGeometry(180, 22, 9, seed) : makeGeometry(320, 34, 12, seed)), [small, seed]);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const matArgs = useMemo(
    () => [
      {
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uAngle: { value: 0 },
          uX: { value: 0 },
          uR: { value: 60 },
          uH: { value: 800 },
          uTurns: { value: 2.5 },
          uBeat: { value: 0 },
          uSize: { value: 7 },
          uTime: { value: 0 },
          uPx: { value: 1 },
          uBend: { value: 0 },
          uWave: { value: 5 },
          uPhase: { value: 0 },
          uOpacity: { value: 0 },
          uColA: { value: new THREE.Color() },
          uColB: { value: new THREE.Color() },
        },
      },
    ] as [THREE.ShaderMaterialParameters],
    [],
  );
  const cA = useRef(new THREE.Color());
  const cB = useRef(new THREE.Color());

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    const w = size.width;
    const h = size.height;
    const R = small ? 26 : Math.min(70, w * 0.045);
    const margin = R + (small ? 18 : 48) + (small ? Math.min(55, w * 0.13) : Math.min(190, w * 0.11)) * 0.7;
    const half = w / 2 - margin;
    // Eén keer van de zijkant naar de overkant en terug per twee schermhoogtes scrollen: in het midden kruisen ze.
    const phase = (scroll.y / (h * 2)) * Math.PI;
    u.uX.value = side * half * Math.cos(phase);
    u.uAngle.value = side * scroll.angle;
    u.uR.value = R;
    u.uH.value = h * 1.15;
    u.uTurns.value = small ? 2 : 2.6;
    u.uTime.value = clock.elapsedTime;
    u.uBeat.value = getBeat();
    u.uSize.value = small ? 5 : 7;
    u.uPx.value = viewport.dpr;
    // De slangenbocht: flink uitslaan, de golf kruipt mee met de scroll (tegengesteld per helix) en ademt in de tijd.
    u.uBend.value = small ? Math.min(55, w * 0.13) : Math.min(190, w * 0.11);
    u.uWave.value = small ? 4.2 : 5.2;
    u.uPhase.value = side * (scroll.y * 0.0045 + clock.elapsedTime * 0.35);
    // In het midden iets zachter, zodat de tekst leesbaar blijft.
    const centre = 1 - Math.abs(Math.cos(phase));
    u.uOpacity.value = scroll.visible * (small ? 0.55 : 0.8) * (1 - centre * 0.45);
    const hueT = scroll.y / (h * 6) + (side > 0 ? 0 : 0.5);
    colorAt(hueT, cA.current);
    colorAt(hueT + 0.35, cB.current);
    (u.uColA.value as THREE.Color).copy(cA.current);
    (u.uColB.value as THREE.Color).copy(cB.current);
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial ref={matRef} args={matArgs} />
    </points>
  );
}

export default function HelixScene() {
  return (
    <Canvas orthographic dpr={[1, 1.5]} camera={{ position: [0, 0, 500], zoom: 1, near: 1, far: 2000 }} gl={{ alpha: true, antialias: false }}>
      <Driver />
      <Helix side={1} seed={7} />
      <Helix side={-1} seed={131} />
    </Canvas>
  );
}
