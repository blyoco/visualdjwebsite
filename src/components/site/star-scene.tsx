"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getBeat } from "./sound";

// Sterren van grijs-witte pixeltjes over de hele pagina, in drie diepte-lagen. Bij het scrollen schuiven ze mee
// (de diepste het langzaamst) en waaien ze een beetje uit; stilstaan = zacht fonkelen. Op de tel lichten ze even op.
// De camera is orthografisch: één eenheid is één pixel.

const COUNT = 1400;

const vertex = /* glsl */ `
  attribute vec3 aSeed;     // x, y (0..1) en de diepte (0 ver .. 1 dichtbij)
  attribute float aBright;
  uniform vec2 uSize;
  uniform float uScroll, uDrift, uTime, uPx, uBeat;
  varying float vBright;
  void main() {
    float depth = aSeed.z;
    float par = 0.08 + depth * 0.5;                       // hoe snel deze laag meeschuift
    float y = mod(aSeed.y * uSize.y + uScroll * par, uSize.y) - uSize.y * 0.5;
    float x = mod(aSeed.x * uSize.x + uDrift * (0.3 + depth), uSize.x) - uSize.x * 0.5;
    float tw = 0.65 + 0.35 * sin(uTime * (0.6 + aBright * 1.7) + aSeed.x * 40.0);
    vBright = aBright * tw * (0.45 + depth * 0.55) * (1.0 + uBeat * 0.8 * depth);
    gl_PointSize = (depth > 0.85 ? 2.0 : 1.2) * uPx;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0.0, 1.0);
  }
`;
const fragment = /* glsl */ `
  uniform float uOpacity;
  varying float vBright;
  void main() { gl_FragColor = vec4(vec3(0.92), vBright * uOpacity); }
`;

function Stars() {
  const { size, viewport } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    let s = 7;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    const seed = new Float32Array(COUNT * 3);
    const bright = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      seed.set([rnd(), rnd(), Math.pow(rnd(), 1.8)], i * 3);
      bright[i] = 0.35 + 0.65 * rnd();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    g.setAttribute("aBright", new THREE.BufferAttribute(bright, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    return g;
  }, []);
  const args = useMemo(
    () =>
      [
        {
          vertexShader: vertex,
          fragmentShader: fragment,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uSize: { value: new THREE.Vector2(1, 1) },
            uScroll: { value: 0 },
            uDrift: { value: 0 },
            uTime: { value: 0 },
            uPx: { value: 1 },
            uBeat: { value: 0 },
            uOpacity: { value: 0 },
          },
        },
      ] as [THREE.ShaderMaterialParameters],
    [],
  );
  const st = useRef({ y: 0, vel: 0, drift: 0 });

  useFrame(({ clock }, dtRaw) => {
    const m = mat.current;
    if (!m) return;
    const dt = Math.min(dtRaw, 1 / 20);
    const s = st.current;
    const y = window.scrollY;
    const v = (y - s.y) / Math.max(dt, 1 / 120);
    s.vel += (v - s.vel) * Math.min(1, dt * 4);
    s.y = y;
    // Uitwaaien: hoe harder je scrolt, hoe meer de sterren opzij drijven
    s.drift += (Math.abs(s.vel) * 0.04 + 4) * dt;
    const h = size.height;
    const hero = document.getElementById("top");
    const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - h : 0;
    const fadeIn = Math.min(1, Math.max(0, (y - heroEnd + h * 0.6) / (h * 0.6)));
    const u = m.uniforms;
    (u.uSize.value as THREE.Vector2).set(size.width, h * 1.2);
    u.uScroll.value = y;
    u.uDrift.value = s.drift;
    u.uTime.value = clock.elapsedTime;
    u.uPx.value = viewport.dpr;
    u.uBeat.value = getBeat();
    u.uOpacity.value = fadeIn * 0.9;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial ref={mat} args={args} />
    </points>
  );
}

export default function StarScene() {
  return (
    // pointerEvents none op de Canvas zelf: R3F zet hem anders op "auto" en dan vangt deze laag alle klikken af.
    <Canvas style={{ pointerEvents: "none" }} orthographic dpr={[1, 2]} camera={{ position: [0, 0, 500], zoom: 1, near: 1, far: 2000 }} gl={{ alpha: true, antialias: false }}>
      <Stars />
    </Canvas>
  );
}
