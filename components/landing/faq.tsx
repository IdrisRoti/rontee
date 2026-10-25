"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Eyebrow, FadeIn, MaskReveal } from "@/components/shared/kinetic";
import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FAQS } from "./faq-data";

/** Friendly accordion, one answer open at a time. */
export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <FadeIn>
            <Eyebrow dot="sage">Questions</Eyebrow>
          </FadeIn>
          <h2 id="faq-heading" className="type-h1 mt-5">
            <MaskReveal lines={[[{ text: "Good" }, { text: "questions.", className: "type-serif" }]]} />
          </h2>
          <FadeIn>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-muted">
              Still wondering about something? The quickest way to find out is to try it. It takes about ten seconds.
            </p>
          </FadeIn>
        </div>

        <ul className="flex flex-col gap-2.5 lg:col-span-7 lg:col-start-6">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const id = `faq-panel-${i}`;
            return (
              <FadeIn as="li" key={item.q} delay={i * 0.05} y={12}>
                <div
                  className={cn(
                    "rounded-[22px] border bg-surface transition-[border-color,box-shadow] duration-500",
                    isOpen ? "border-border-strong shadow-elevated" : "border-border shadow-subtle hover:border-border-strong",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                    >
                      <span className="flex-1 text-base font-semibold tracking-[-0.015em] sm:text-[17px]">{item.q}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={SPRING.snappy}
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                          isOpen ? "bg-butter text-ink" : "bg-surface-subtle text-foreground",
                        )}
                      >
                        <Plus size={16} strokeWidth={2.5} aria-hidden />
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
                        transition={{ duration: 0.45, ease: EASE.outExpo }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl px-5 pb-5 text-[15px] leading-relaxed text-muted sm:px-6 sm:pb-6">{item.a}</p>
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
