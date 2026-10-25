"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Word = { text: string; serif?: boolean; ember?: boolean };

const COPY: Word[] = [
  ..."Rontee isn’t a calendar, and it isn’t a to-do list. It’s the friend who remembers".split(" ").map((text) => ({ text })),
  { text: "your mum’s birthday,", serif: true },
  ..."your passport, and".split(" ").map((text) => ({ text })),
  { text: "that trial you meant to cancel", serif: true },
  ..."and tells you with just enough time to act.".split(" ").map((text) => ({ text })),
];

/** Words brighten from faint to ink as the paragraph scrolls through. */
export function Manifesto() {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="What Rontee is" className="px-4 py-24 sm:px-8 sm:py-40">
      <p className="mx-auto max-w-[1100px] text-[clamp(1.75rem,3.6vw+0.6rem,4rem)] leading-[1.08] font-medium tracking-[-0.04em] text-balance">
        {COPY.map((w, i) => (
          <React.Fragment key={i}>
            <span data-word className={w.serif ? "type-serif" : undefined}>
              {w.text}
            </span>{" "}
          </React.Fragment>
        ))}
        <span data-word aria-hidden className="inline-block size-[0.32em] translate-y-[-0.1em] rounded-full bg-ember" />
      </p>
    </section>
  );
}
