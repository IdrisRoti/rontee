"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Eyebrow, FadeIn, MaskReveal } from "@/components/shared/kinetic";
import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FAQS } from "./faq-data";

/** Numbered accordion, one item open at a time. */
export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-4 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow index="003">FAQ</Eyebrow>
          <h2 id="faq-heading" className="type-h1 mt-6">
            <MaskReveal lines={[[{ text: "Questions," }], [{ text: "answered.", className: "type-serif" }]]} />
          </h2>
          <FadeIn>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted">
              Can’t find what you’re looking for? Create a reminder and see for yourself. It takes about ten seconds.
            </p>
          </FadeIn>
        </div>

        <ul className="flex flex-col gap-2 lg:col-span-7 lg:col-start-6">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const id = `faq-panel-${i}`;
            return (
              <FadeIn as="li" key={item.q} delay={i * 0.05} y={12}>
                <div
                  className={cn(
                    "rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500",
                    isOpen ? "border-border-strong bg-surface shadow-elevated" : "border-transparent bg-surface-subtle hover:bg-surface",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background font-mono text-[11px] text-muted">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-[15px] font-medium tracking-[-0.015em] sm:text-base">{item.q}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={SPRING.snappy}
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                          isOpen ? "bg-surface-subtle text-foreground" : "bg-primary text-primary-foreground",
                        )}
                      >
                        <Plus size={16} aria-hidden />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={id}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE.outExpo }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pr-6 pb-5 pl-14 text-[15px] leading-relaxed text-muted sm:pl-[3.75rem]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
