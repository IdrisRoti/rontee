"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Contrast, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SPRING } from "@/lib/motion";
import { transitionTheme, type ThemeChoice } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: ReadonlyArray<{ value: ThemeChoice; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Contrast },
];

/** Hydration-safe "is client" flag — next-themes only resolves after mount. */
function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Theme popover: icon trigger, Light / Dark / System with a sliding
 * highlight. Closes on outside click or Escape.
 */
export function ThemeMenu({
  className,
  placement = "bottom",
}: {
  className?: string;
  placement?: "bottom" | "top";
}) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const resolved: ThemeChoice =
    theme === "light" || theme === "dark" || theme === "system" ? theme : "light";
  // Gate on mounted so the first client render matches the server HTML.
  const current: ThemeChoice = mounted ? resolved : "light";
  const ActiveIcon = current === "system" ? Contrast : current === "dark" ? Moon : Sun;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={SPRING.snappy}
            className="flex"
          >
            <ActiveIcon size={18} aria-hidden />
          </motion.span>
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Theme"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={SPRING.soft}
            className={cn(
              "absolute right-0 z-50 w-40 rounded-2xl border border-border bg-surface-elevated p-1.5 shadow-float",
              placement === "top" ? "bottom-full mb-2 origin-bottom-right" : "mt-2 origin-top-right",
            )}
          >
            {THEME_OPTIONS.map(({ value, label, Icon }) => {
              const active = current === value;
              return (
                <button
                  key={value}
                  role="menuitemradio"
                  aria-checked={active}
                  type="button"
                  onClick={(e) => {
                    // Keyboard activation has no pointer position — reveal from the button instead.
                    const r = e.currentTarget.getBoundingClientRect();
                    const origin =
                      e.detail === 0
                        ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
                        : { x: e.clientX, y: e.clientY };
                    setOpen(false);
                    transitionTheme(value, setTheme, origin);
                  }}
                  className={cn(
                    "relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="theme-menu-active"
                      transition={SPRING.snappy}
                      className="absolute inset-0 rounded-xl bg-surface-subtle"
                    />
                  )}
                  <Icon size={16} aria-hidden className="relative" />
                  <span className="relative">{label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
