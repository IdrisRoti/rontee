"use client";

import * as React from "react";
import { useLenis } from "lenis/react";

import { cn } from "@/lib/utils";

type Item = { when: string; what: string; hot?: boolean };

const ROW_A: Item[] = [
  { when: "May 12", what: "Mum’s birthday" },
  { when: "Mar 03", what: "Passport renewal" },
  { when: "Every 28th", what: "Rent" },
  { when: "Fri", what: "Netflix trial ends", hot: true },
  { when: "Jun 21", what: "Our anniversary" },
  { when: "Q3", what: "VAT return" },
  { when: "Sep 28", what: "Dad’s 60th" },
];

const ROW_B: Item[] = [
  { when: "Aug 01", what: "Car insurance" },
  { when: "Jan 15", what: "Visa expiry" },
  { when: "Oct 02", what: "Dentist check-up" },
  { when: "Dec 31", what: "Domain renewal" },
  { when: "Tomorrow", what: "Gym contract notice", hot: true },
  { when: "Apr 30", what: "Tax filing deadline" },
  { when: "Every Sun", what: "Call grandma" },
];

function Pill({ item }: { item: Item }) {
  return (
    <span className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-surface py-2.5 pr-5 pl-2.5 shadow-subtle">
      <span
        className={cn(
          "rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase",
          item.hot ? "bg-ember-subtle text-ember" : "bg-surface-subtle text-muted",
        )}
      >
        {item.when}
      </span>
      <span className="text-[15px] tracking-[-0.015em] whitespace-nowrap">{item.what}</span>
    </span>
  );
}

/** One infinite row; translation runs in JS so scroll velocity can push it. */
function Row({ items, direction, velocity }: { items: Item[]; direction: 1 | -1; velocity: React.RefObject<number> }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const hoverRef = React.useRef(false);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let speed = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const base = hoverRef.current ? 8 : 38;
      const boost = Math.min(Math.abs(velocity.current ?? 0) * 6, 600);
      speed += (base + boost - speed) * 0.08;
      const half = track.scrollWidth / 2;
      x = (x + speed * dt * direction) % half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [direction, velocity]);

  return (
    <div
      className="flex overflow-hidden"
      onPointerEnter={() => (hoverRef.current = true)}
      onPointerLeave={() => (hoverRef.current = false)}
    >
      <div ref={trackRef} className="flex w-max gap-3 pr-3 will-change-transform">
        {[...items, ...items].map((item, i) => (
          <Pill key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * "Things people hand to Rontee" — two counter-scrolling rows that
 * speed up with scroll velocity and slow on hover.
 */
export function Marquee() {
  const velocity = React.useRef(0);
  useLenis((lenis) => {
    velocity.current = lenis.velocity;
  });

  return (
    <section aria-label="Examples of reminders" className="relative py-10 sm:py-16">
      <p className="type-eyebrow mb-6 text-center text-faint">Things people hand to Rontee</p>
      <div className="flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <Row items={ROW_A} direction={-1} velocity={velocity} />
        <Row items={ROW_B} direction={1} velocity={velocity} />
      </div>
    </section>
  );
}
