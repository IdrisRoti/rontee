"use client";

import * as React from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Mail, Smartphone } from "lucide-react";

import { Eyebrow, FadeIn, MaskReveal, SpotlightCard } from "@/components/shared/kinetic";
import { LogoMark } from "@/components/shared/logo";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

function CardHead({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="relative z-10 p-6 sm:p-8">
      <span className="type-eyebrow text-faint">{label}</span>
      <h3 className="type-h3 mt-3">{title}</h3>
      <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A — Year ring                                                        */
/* ------------------------------------------------------------------ */

const TODAY = 125; // May 5 (demo "today")
const DATES = [
  { day: 132, label: "Mum’s birthday", when: "May 12" },
  { day: 172, label: "Anniversary", when: "Jun 21" },
  { day: 271, label: "Dad’s 60th", when: "Sep 28" },
];

function polar(day: number, r: number, c = 160) {
  const a = (day / 365) * Math.PI * 2 - Math.PI / 2;
  // Rounded: server and client Math.cos can differ in the last digits (hydration)
  const round = (v: number) => Math.round(v * 100) / 100;
  return { x: round(c + Math.cos(a) * r), y: round(c + Math.sin(a) * r) };
}

const MONTH_STARTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/** Clockwise arc between two days of the year, starting at 12 o’clock. */
function arcPath(fromDay: number, toDay: number, r: number) {
  const a = polar(fromDay, r);
  const b = polar(toDay, r);
  const large = (toDay - fromDay) / 365 > 0.5 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

function YearRing() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(2, "0"));

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(count, 7, { duration: reduce ? 0 : 1.6, ease: EASE.outExpo, delay: 0.3 });
    return () => controls.stop();
  }, [inView, reduce, count]);

  const dots = React.useMemo(() => Array.from({ length: 365 }, (_, i) => ({ i, ...polar(i, 132) })), []);
  const today = polar(TODAY, 150);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[380px]">
      <svg viewBox="0 0 320 320" className="size-full overflow-visible" aria-hidden>
        {dots.map((d) => (
          <circle
            key={d.i}
            cx={d.x}
            cy={d.y}
            r={MONTH_STARTS.includes(d.i) ? 2 : 1.15}
            className={MONTH_STARTS.includes(d.i) ? "fill-foreground/50" : "fill-foreground/22"}
          />
        ))}
        {/* The year so far (outer track) */}
        <circle cx="160" cy="160" r="150" fill="none" strokeWidth="1" className="stroke-border" />
        <motion.path
          d={arcPath(0, TODAY, 150)}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-foreground"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: reduce ? 0 : 1.4, ease: EASE.outExpo, delay: 0.2 }}
        />
        {/* Countdown to the next date, in ember */}
        <motion.path
          d={arcPath(TODAY, DATES[0].day, 150)}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-ember"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE.outQuart, delay: 1.3 }}
        />
        <motion.circle
          cx={today.x}
          cy={today.y}
          r="5"
          strokeWidth="3"
          className="fill-foreground stroke-surface"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 16, delay: 1.2 }}
          style={{ transformOrigin: `${today.x}px ${today.y}px` }}
        />
        {DATES.map((d, i) => {
          const p = polar(d.day, 132);
          return (
            <g key={d.day}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={i === 0 ? 5 : 3.5}
                className="fill-ember"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.5 + i * 0.15 }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              />
              {i === 0 && (
                <circle cx={p.x} cy={p.y} r={5} className="fill-ember animate-pulse-ring" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span className="font-mono text-[64px] leading-none font-medium tracking-[-0.06em]">{rounded}</motion.span>
        <span className="mt-2 text-sm text-muted">days until Mum’s birthday</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* B — Documents                                                        */
/* ------------------------------------------------------------------ */

function RenewalTimeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  return (
    <div ref={ref} className="px-6 pb-7 sm:px-8 sm:pb-8">
      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">Passport</span>
          <span className="font-mono text-[11px] text-muted">expires 14 Mar 2027</span>
        </div>
        <div className="relative mt-5 grid grid-cols-6 gap-1">
          {months.map((m, i) => (
            <div key={m} className="flex flex-col gap-2">
              <div className="relative h-2 overflow-hidden rounded-full bg-surface-subtle">
                <motion.div
                  className={cn("absolute inset-0 origin-left rounded-full", i >= 1 ? "bg-foreground" : "bg-foreground/25")}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.5, ease: EASE.outQuart, delay: 0.2 + i * 0.12 }}
                />
              </div>
              <span className="font-mono text-[10px] text-faint">{m}</span>
            </div>
          ))}
          <motion.span
            className="absolute -top-6 left-[16.6%] flex items-center gap-1.5 rounded-full bg-ember-subtle px-2 py-0.5 font-mono text-[10px] text-ember"
            initial={{ opacity: 0, y: 4 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <span className="size-1 rounded-full bg-ember" /> Start renewal
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* C — Subscriptions                                                    */
/* ------------------------------------------------------------------ */

const SUBS = [
  { name: "Netflix", note: "Free trial ends", when: "Tomorrow", hot: true },
  { name: "Spotify Family", note: "Renews monthly", when: "Jun 03" },
  { name: "Adobe CC", note: "Annual renewal", when: "Aug 19" },
];

function SubscriptionList() {
  return (
    <ul className="flex flex-col gap-2 px-6 pb-7 sm:px-8 sm:pb-8">
      {SUBS.map((s, i) => (
        <FadeIn as="li" key={s.name} delay={0.1 + i * 0.1} y={10}>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3.5 py-3 transition-transform duration-300 hover:-translate-y-0.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-surface-subtle font-mono text-xs">
              {s.name[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{s.name}</span>
              <span className="block truncate text-xs text-muted">{s.note}</span>
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-1 font-mono text-[10px] uppercase",
                s.hot ? "bg-ember-subtle text-ember" : "text-faint",
              )}
            >
              {s.when}
            </span>
          </div>
        </FadeIn>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* D — Notifications                                                    */
/* ------------------------------------------------------------------ */

const NOTES = [
  { text: "Mum’s birthday is in 7 days. Maybe order that scarf she liked?", when: "9:00" },
  { text: "Your Netflix trial ends tomorrow.", when: "Yesterday" },
  { text: "Rent is due on the 28th.", when: "Mon" },
];

/** Collapsed like a lock-screen stack; fans out once scrolled into view. */
function NotificationStack() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });
  return (
    <div ref={ref} className="relative mx-6 mb-8 h-[188px] sm:mx-8">
      {NOTES.map((n, i) => (
        <motion.div
          key={n.text}
          initial={false}
          animate={
            inView
              ? { y: i * 64, scale: 1, opacity: 1 }
              : { y: i * 10, scale: 1 - i * 0.05, opacity: 1 - i * 0.3 }
          }
          transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.25 + i * 0.12 }}
          style={{ zIndex: 30 - i * 10 }}
          className="absolute inset-x-0 top-0 rounded-2xl border border-border bg-surface-elevated p-3.5 shadow-elevated"
        >
          <div className="flex items-start gap-3">
            <LogoMark className="mt-0.5 size-6" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Rontee</span>
                <span className="font-mono text-[10px] text-faint">{n.when}</span>
              </div>
              <p className="mt-0.5 truncate text-[13px] text-foreground/90">{n.text}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* E — Recurring                                                        */
/* ------------------------------------------------------------------ */

function RecurringTrack() {
  const reduce = useReducedMotion();
  const rows = [
    { label: "Rent", rule: "Every 28th", ticks: 12, every: 1 },
    { label: "VAT return", rule: "Quarterly", ticks: 12, every: 3 },
    { label: "Performance review", rule: "Yearly", ticks: 12, every: 12 },
  ];
  return (
    <div className="flex flex-col gap-5 px-6 pb-8 sm:px-8">
      {rows.map((r, ri) => (
        <div key={r.label}>
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-sm font-medium">{r.label}</span>
            <span className="font-mono text-[11px] text-muted">{r.rule}</span>
          </div>
          <div className="relative flex h-6 items-center justify-between">
            <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
            {Array.from({ length: r.ticks }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "relative rounded-full",
                  i % r.every === 0 ? "size-2 bg-foreground" : "size-1 bg-border-strong",
                )}
              />
            ))}
            {!reduce && (
              <motion.span
                className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-surface bg-ember shadow-subtle"
                animate={{ left: ["0%", "100%"] }}
                transition={{ duration: 7 + ri * 3, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * "Everything worth remembering" — bento of live micro-interfaces,
 * one per category from the product plan.
 */
export function UseCases() {
  return (
    <section id="use-cases" aria-labelledby="use-cases-heading" className="px-4 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow index="002">Use cases</Eyebrow>
            <h2 id="use-cases-heading" className="type-h1 mt-6">
              <MaskReveal lines={[[{ text: "Everything worth" }], [{ text: "remembering.", className: "type-serif" }]]} />
            </h2>
          </div>
          <FadeIn>
            <p className="type-body-lg max-w-sm text-muted">
              Personal, financial, documents, work. If it has a date, Rontee will hold it for you.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
          <FadeIn className="lg:col-span-7 lg:row-span-2">
            <SpotlightCard className="flex h-full flex-col">
              <CardHead
                label="Personal"
                title="Birthdays & anniversaries"
                body="The people you love, on repeat every year, with a heads-up early enough to plan something."
              />
              <div className="flex flex-1 items-center px-6 pb-8">
                <YearRing />
              </div>
              <ul className="grid grid-cols-3 border-t border-border">
                {DATES.map((d, i) => (
                  <li key={d.day} className={cn("px-4 py-4 sm:px-6", i > 0 && "border-l border-border")}>
                    <span className="font-mono text-[11px] text-faint uppercase">{d.when}</span>
                    <span className="mt-1 block truncate text-sm">{d.label}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </FadeIn>

          <FadeIn className="lg:col-span-5" delay={0.08}>
            <SpotlightCard className="h-full">
              <CardHead label="Documents" title="Renewals, months ahead" body="Passports, visas, licences and leases. Get months of notice, not days." />
              <RenewalTimeline />
            </SpotlightCard>
          </FadeIn>

          <FadeIn className="lg:col-span-5" delay={0.12}>
            <SpotlightCard className="h-full">
              <CardHead label="Financial" title="Trials & subscriptions" body="Cancel before the charge, not after. Rontee flags what’s about to renew." />
              <SubscriptionList />
            </SpotlightCard>
          </FadeIn>

          <FadeIn className="lg:col-span-6" delay={0.05}>
            <SpotlightCard className="h-full">
              <CardHead label="Notifications" title="Gentle, never naggy" body="Email and push, both on by default. Written like a friend, sent only when it helps." />
              <NotificationStack />
              <div className="flex items-center gap-4 border-t border-border px-6 py-4 font-mono text-[11px] text-muted uppercase sm:px-8">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} aria-hidden /> Email
                </span>
                <span className="flex items-center gap-1.5">
                  <Smartphone size={13} aria-hidden /> Push
                </span>
                <span className="ml-auto hidden text-faint sm:inline">On by default</span>
              </div>
            </SpotlightCard>
          </FadeIn>

          <FadeIn className="lg:col-span-6" delay={0.1}>
            <SpotlightCard className="h-full">
              <CardHead label="Work & bills" title="Recurring, handled" body="Monthly rent, quarterly filings, yearly reviews. Set the rule once." />
              <RecurringTrack />
            </SpotlightCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
