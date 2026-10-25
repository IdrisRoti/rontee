"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { NoiseToCalendar } from "./visuals/noise-to-calendar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const THOUGHTS = [
  { text: "Car inspection…?", x: "7%", y: "44%" },
  { text: "Is Mum’s birthday this week??", x: "64%", y: "40%" },
  { text: "Did I cancel that trial?", x: "72%", y: "72%" },
  { text: "Passport… expired?", x: "10%", y: "78%" },
  { text: "Rent due when?", x: "44%", y: "86%" },
  { text: "Anniversary is…June?", x: "30%", y: "58%" },
] as const;

/**
 * Cinematic dark interlude. Pinned on scroll: scattered "maybes" (dots +
 * floating thoughts) are swept into an orderly calendar with three dates
 * lit in ember. Headline crossfades from the problem to the promise.
 */
export function Unburden() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const progressRef = React.useRef(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=170%",
            pin: true,
            // Explicit: ScrollTrigger disables spacing when the parent is flex
            pinSpacing: true,
            scrub: 0.5,
            onUpdate: (self) => {
              // Hold the scatter briefly, settle by ~80% of the pin
              progressRef.current = gsap.utils.clamp(0, 1, (self.progress - 0.12) / 0.68);
            },
          },
        });
        tl.to("[data-thought]", { opacity: 0, filter: "blur(12px)", scale: 0.9, stagger: 0.03, duration: 0.3 }, 0.1)
          .to("[data-before]", { opacity: 0, y: -30, filter: "blur(8px)", duration: 0.25 }, 0.2)
          .fromTo("[data-after]", { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 }, 0.55)
          .fromTo("[data-legend]", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.8);

        // Thoughts jitter while unresolved
        gsap.utils.toArray<HTMLElement>("[data-thought-inner]").forEach((el, i) => {
          gsap.to(el, {
            x: () => gsap.utils.random(-14, 14),
            y: () => gsap.utils.random(-10, 10),
            duration: 2.4 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            repeatRefresh: true,
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        progressRef.current = 1;
        gsap.set("[data-thought], [data-before]", { opacity: 0 });
        gsap.set("[data-after], [data-legend]", { opacity: 1 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="unburden-heading"
      className="scheme-dark grain relative isolate flex h-[100svh] w-full flex-col overflow-hidden"
    >
      <NoiseToCalendar progressRef={progressRef} className="absolute inset-0" />

      {THOUGHTS.map((t) => (
        <span
          key={t.text}
          data-thought
          aria-hidden
          className="absolute hidden text-[clamp(0.9rem,1.1vw,1.15rem)] text-muted sm:block"
          style={{ left: t.x, top: t.y }}
        >
          <span data-thought-inner className="type-serif block blur-[0.4px]">
            {t.text}
          </span>
        </span>
      ))}

      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] px-4 pt-20 text-center sm:px-8 sm:pt-24">
        <h2 id="unburden-heading" className="type-h1 col-start-1 row-start-1 text-balance">
          <span data-before className="block">
            Your head is full of <span className="type-serif text-muted">maybes.</span>
          </span>
        </h2>
        <p data-after className="type-h1 col-start-1 row-start-1 text-balance opacity-0">
          Rontee keeps the dates. <span className="type-serif">You keep the peace.</span>
        </p>
      </div>

      <div
        data-legend
        className="relative z-10 mt-auto mb-8 flex items-center justify-center gap-6 px-4 font-mono text-[11px] tracking-wide text-muted uppercase opacity-0"
      >
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-ember" /> May 2026
        </span>
        <span>Mum’s birthday · 12th</span>
        <span className="hidden sm:inline">Nudges on the 5th + 11th</span>
      </div>
    </section>
  );
}
