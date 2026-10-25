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

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScatter;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uSize;
attribute float aRandom;
attribute float aMemory;
varying float vAlpha;
varying float vMemory;
${GLSL_SIMPLEX_3D}
void main() {
  vec3 dir = normalize(position);
  float n = snoise(position * 1.2 + vec3(uTime * 0.1));
  vec3 p = position + dir * n * 0.065;
  // Scroll exit: dots drift outward at individual speeds
  p += dir * uScatter * (0.5 + aRandom * 1.8);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 ndc = clip.xy / clip.w;

  // Pointer repel in view space
  vec2 away = ndc - uMouse;
  float d = length(away);
  float push = smoothstep(0.42, 0.0, d);
  mv.xy += normalize(away + 1e-4) * push * 0.22;

  gl_Position = projectionMatrix * mv;

  // Front-facing dots read darker, back dots recede
  vec3 worldDir = normalize(mat3(modelMatrix) * dir);
  float facing = worldDir.z * 0.5 + 0.5;
  vAlpha = mix(0.10, 0.95, facing) * (1.0 - uScatter * 0.85);

  float pulse = 1.0 + aMemory * (0.9 + 0.35 * sin(uTime * 2.2 + aRandom * 6.2831));
  gl_PointSize = uSize * uPixelRatio * pulse * (0.6 + facing * 0.6) * (3.6 / -mv.z);
  vMemory = aMemory;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uEmber;
varying float vAlpha;
varying float vMemory;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float edge = smoothstep(0.5, 0.36, r);
  vec3 color = mix(uInk, uEmber, vMemory);
  float alpha = vAlpha * edge * mix(1.0, 1.4, vMemory);
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;

/** Fibonacci sphere: evenly spaced points, no clumping at the poles. */
function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

type MemoryOrbProps = {
  className?: string;
  /** Element whose scroll-out drives the scatter (defaults to the canvas wrapper). */
  scrollTarget?: React.RefObject<HTMLElement | null>;
};

/**
 * Hero visual: a breathing dot-matrix sphere of "memories". Ember dots
 * are the things Rontee is holding for you. Pointer pushes dots aside;
 * scrolling the hero away scatters the sphere.
 */
export function MemoryOrb({ className, scrollTarget }: MemoryOrbProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !webglAvailable()) return;

    const reduce = prefersReducedMotion();
    const isSmall = window.innerWidth < 768;
    const count = isSmall ? 5200 : 12000;

    const renderer = createRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 4.4);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(fibonacciSphere(count, 1.12), 3));
    const random = new Float32Array(count);
    const memory = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      random[i] = Math.random();
      memory[i] = Math.random() < 0.0028 ? 1 : 0;
    }
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));
    geometry.setAttribute("aMemory", new THREE.BufferAttribute(memory, 1));

    const uniforms = {
      uTime: { value: 0 },
      uScatter: { value: 0 },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: isSmall ? 3.4 : 3.0 },
      uInk: { value: readCssColor(wrap, "--foreground") },
      uEmber: { value: readCssColor(wrap, "--ember", "#e8572a") },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    points.rotation.set(0.35, 0, 0.12);
    scene.add(points);

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Keep the sphere fully visible in portrait containers
      camera.position.z = camera.aspect < 1 ? 4.4 / camera.aspect ** 0.85 : 4.4;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const stopTheme = observeTheme(() => {
      uniforms.uInk.value = readCssColor(wrap, "--foreground");
      uniforms.uEmber.value = readCssColor(wrap, "--ember", "#e8572a");
      if (reduce) renderer.render(scene, camera);
    });

    // Pointer, eased in the loop
    const mouseTarget = new THREE.Vector2(9, 9);
    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseTarget.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const onPointerLeave = () => mouseTarget.set(9, 9);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    if (reduce) {
      renderer.render(scene, camera);
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    let raf = 0;
    let last = performance.now();
    let tiltX = 0;
    let tiltY = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;

      const m = uniforms.uMouse.value;
      // Snap far-off sentinel values instead of easing through the sphere
      if (mouseTarget.x > 5 || m.x > 5) m.copy(mouseTarget);
      else m.lerp(mouseTarget, 1 - Math.pow(0.001, dt));

      const target = scrollTarget?.current ?? wrap;
      const rect = target.getBoundingClientRect();
      const exit = Math.min(Math.max(-rect.top / (rect.height * 0.8), 0), 1);
      uniforms.uScatter.value += (exit - uniforms.uScatter.value) * 0.15;

      const mx = mouseTarget.x > 5 ? 0 : mouseTarget.x;
      const my = mouseTarget.y > 5 ? 0 : mouseTarget.y;
      tiltX += (my * 0.18 - tiltX) * 0.04;
      tiltY += (mx * 0.25 - tiltY) * 0.04;
      points.rotation.y += dt * 0.06;
      points.rotation.x = 0.35 - tiltX;
      points.rotation.z = 0.12 + tiltY * 0.3;

      renderer.render(scene, camera);
    };
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      stopTheme();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [scrollTarget]);

  return (
    <div ref={wrapRef} aria-hidden className={cn("pointer-events-none relative", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
