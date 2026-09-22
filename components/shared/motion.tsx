"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type MotionDivProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** Fade-and-rise on mount. */
export function FadeUp({ children, className, delay = 0, y = 24 }: MotionDivProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — pair with StaggerItem. Set scroll for below-fold content. */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.09,
  scroll = false,
}: MotionDivProps & { gap?: number; scroll?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      animate={scroll ? undefined : "show"}
      whileInView={scroll ? "show" : undefined}
      viewport={scroll ? { once: true, margin: "-80px" } : undefined}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger child — must be inside Stagger. */
export function StaggerItem({
  children,
  className,
  y = 22,
  rotate = 0,
}: MotionDivProps & { rotate?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          rotate,
          transition: { duration: 0.55, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Fade-and-rise when scrolled into view (for sections below the fold). */
export function Reveal({ children, className, delay = 0, y = 28 }: MotionDivProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type TypewriterProps = {
  text: string;
  className?: string;
  /** ms per character */
  speed?: number;
  /** seconds to wait after scrolling into view before starting */
  delay?: number;
};

/** Types out text on scroll into view, with a blinking caret. */
export function Typewriter({ text, className, speed = 26, delay = 0 }: TypewriterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView || reduce) return;
    if (count >= text.length) return;
    const wait = count === 0 ? delay * 1000 : speed;
    const id = window.setTimeout(
      () => setCount((c) => Math.min(c + 1, text.length)),
      wait,
    );
    return () => window.clearTimeout(id);
  }, [inView, reduce, count, text, speed, delay]);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {text.slice(0, count)}
      {/* {inView && <span aria-hidden className="animate-caret" />} */}
    </span>
  );
}

type MeterProps = {
  /** fill percentage 0–100 */
  value: number;
  trackClassName?: string;
  barClassName?: string;
  label: string;
};

/** Progress bar that fills from 0 to value when scrolled into view. */
export function Meter({ value, trackClassName, barClassName, label }: MeterProps) {
  return (
    <div role="img" aria-label={label} className={trackClassName}>
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.25 }}
        className={barClassName}
      />
    </div>
  );
}
