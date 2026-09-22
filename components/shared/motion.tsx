"use client";

import * as React from "react";
import { motion } from "framer-motion";

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

/** Stagger container — pair with StaggerItem. */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.09,
}: MotionDivProps & { gap?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
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
export function StaggerItem({ children, className, y = 22 }: MotionDivProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
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
