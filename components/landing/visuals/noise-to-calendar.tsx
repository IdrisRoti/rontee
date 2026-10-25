"use client";

import * as React from "react";
import * as THREE from "three";

import {
  GLSL_SIMPLEX_3D,
  createRenderer,
  observeTheme,
  prefersReducedMotion,
  readCssColor,
  webglAvailable,
} from "@/lib/webgl";
import { cn } from "@/lib/utils";

const COLS = 7;
const ROWS = 5;
const DOTS = 6; // dots per cell edge → each calendar day is a 6×6 halftone tile
// May 2026, Monday-first: cells 0–3 are April padding. Lit: May 5 + May 11
// (nudges) and May 12 (Mum’s birthday) — the same story as How it works.
const MAY_OFFSET = 4;
const EMBER_CELLS = new Set([MAY_OFFSET + 4, MAY_OFFSET + 10, MAY_OFFSET + 11]);
const DUST = 2600;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;
uniform float uSize;
attribute vec3 aTarget;
attribute float aDelay;
attribute float aEmber;
attribute float aDust;
attribute float aDim;
varying float vAlpha;
varying float vEmber;
${GLSL_SIMPLEX_3D}
float easeInOut(float t){ return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0; }
void main() {
  float local = clamp((uProgress - aDelay * 0.45) / 0.55, 0.0, 1.0);
  float e = easeInOut(local);

  // Anxious drift: strong while scattered, gone once settled
  vec3 drift = vec3(
    snoise(position * 0.9 + vec3(uTime * 0.18, 0.0, 0.0)),
    snoise(position * 0.9 + vec3(0.0, uTime * 0.18, 4.0)),
    0.0
  ) * 0.35;
  vec3 scattered = position + drift;

  vec3 p = mix(scattered, aTarget, aDust > 0.5 ? 0.0 : e);
  // Dust gets swept outward and fades
  p += aDust * normalize(position + 1e-3) * uProgress * 1.6;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

  float settle = aDust > 0.5 ? 0.0 : e;
  gl_PointSize = uSize * uPixelRatio * mix(0.75, 1.0, settle) * (1.0 + aEmber * settle * 0.35);

  float dustFade = 1.0 - smoothstep(0.05, 0.55, uProgress);
  vAlpha = aDust > 0.5 ? 0.4 * dustFade : mix(0.45, 0.9, settle) * mix(1.0, 0.3, aDim * settle);
  vEmber = aEmber * smoothstep(0.8, 1.0, e);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uEmber;
varying float vAlpha;
varying float vEmber;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float edge = smoothstep(0.5, 0.3, r);
  vec3 color = mix(uInk, uEmber, vEmber);
  gl_FragColor = vec4(color, vAlpha * edge * mix(1.0, 1.25, vEmber));
}
`;

/** Lays the calendar out in world units that fit the viewport. */
function buildTargets(aspect: number) {
  // Ortho frustum is 2 units tall; width = 2 * aspect
  const maxW = Math.min(2 * aspect * 0.86, 3.4);
  const maxH = 1.05;
  const cell = Math.min(maxW / COLS, maxH / ROWS);
  // Gap must clearly exceed dot spacing or the days merge into one field
  const gap = cell * 0.36;
  const dotStep = (cell - gap) / (DOTS - 1);
  const gridW = cell * COLS - gap;
  const gridH = cell * ROWS - gap;
  const x0 = -gridW / 2;
  // Sit slightly below centre to leave room for the headline
  const y0 = gridH / 2 - 0.18;

  const targets: number[] = [];
  const ember: number[] = [];
  const dim: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      for (let dy = 0; dy < DOTS; dy++) {
        for (let dx = 0; dx < DOTS; dx++) {
          targets.push(x0 + c * cell + dx * dotStep, y0 - r * cell - dy * dotStep, 0);
          ember.push(EMBER_CELLS.has(idx) ? 1 : 0);
          dim.push(idx < MAY_OFFSET ? 1 : 0);
        }
      }
    }
  }
  return { targets, ember, dim, cell };
}

type Props = {
  className?: string;
  /** 0 → scattered noise, 1 → settled calendar. Read every frame. */
  progressRef: React.RefObject<number>;
};

export function NoiseToCalendar({ className, progressRef }: Props) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !webglAvailable()) return;
    const reduce = prefersReducedMotion();

    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 2;

    const gridCount = COLS * ROWS * DOTS * DOTS;
    const total = gridCount + DUST;
    const geometry = new THREE.BufferGeometry();
    const start = new Float32Array(total * 3);
    const target = new Float32Array(total * 3);
    const delay = new Float32Array(total);
    const ember = new Float32Array(total);
    const dust = new Float32Array(total);
    const dimArr = new Float32Array(total);

    for (let i = 0; i < total; i++) {
      // Elliptical cloud, denser toward the centre
      const a = Math.random() * Math.PI * 2;
      const rr = Math.pow(Math.random(), 0.6);
      start[i * 3] = Math.cos(a) * rr * 2.2;
      start[i * 3 + 1] = Math.sin(a) * rr * 1.1;
      start[i * 3 + 2] = 0;
      delay[i] = Math.random();
      dust[i] = i >= gridCount ? 1 : 0;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(start, 3));
    const targetAttr = new THREE.BufferAttribute(target, 3);
    const emberAttr = new THREE.BufferAttribute(ember, 1);
    geometry.setAttribute("aTarget", targetAttr);
    geometry.setAttribute("aEmber", emberAttr);
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
    geometry.setAttribute("aDust", new THREE.BufferAttribute(dust, 1));
    const dimAttr = new THREE.BufferAttribute(dimArr, 1);
    geometry.setAttribute("aDim", dimAttr);

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: reduce ? 1 : 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: 3 },
      uInk: { value: readCssColor(wrap, "--foreground", "#edebe5") },
      uEmber: { value: readCssColor(wrap, "--ember", "#ff6a3d") },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new THREE.Points(geometry, material));

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      const { targets, ember: em, dim, cell } = buildTargets(aspect);
      for (let i = 0; i < gridCount; i++) {
        target[i * 3] = targets[i * 3];
        target[i * 3 + 1] = targets[i * 3 + 1];
        ember[i] = em[i];
        dimArr[i] = dim[i];
      }
      targetAttr.needsUpdate = true;
      dimAttr.needsUpdate = true;
      emberAttr.needsUpdate = true;
      // Dot size tracks cell size in pixels so tiles stay legible
      const cellPx = (cell / 2) * height;
      uniforms.uSize.value = Math.max(1.6, Math.min(4.2, cellPx / DOTS / 2.1));
      if (reduce) renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const stopTheme = observeTheme(() => {
      uniforms.uInk.value = readCssColor(wrap, "--foreground", "#edebe5");
      uniforms.uEmber.value = readCssColor(wrap, "--ember", "#ff6a3d");
      if (reduce) renderer.render(scene, camera);
    });

    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;
      const p = progressRef.current ?? 0;
      uniforms.uProgress.value += (p - uniforms.uProgress.value) * 0.12;
      renderer.render(scene, camera);
    };
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      stopTheme();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [progressRef]);

  return (
    <div ref={wrapRef} aria-hidden className={cn("pointer-events-none relative", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
