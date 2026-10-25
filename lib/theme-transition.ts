import { flushSync } from "react-dom";

export type ThemeChoice = "light" | "dark" | "system";

function resolve(choice: ThemeChoice): "light" | "dark" {
  if (choice !== "system") return choice;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Switches theme with a circular "ink spreading" reveal from `origin`
 * (the click point). next-themes applies its class in an effect, which is
 * too late for a View Transition snapshot, so the class is applied here
 * synchronously inside the transition and next-themes catches up.
 * Falls back to an instant switch without API support or with reduced motion.
 */
export function transitionTheme(
  choice: ThemeChoice,
  setTheme: (theme: string) => void,
  origin?: { x: number; y: number },
) {
  const root = document.documentElement;
  const next = resolve(choice);
  const current = root.classList.contains("dark") ? "dark" : "light";

  const apply = () => {
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
    flushSync(() => setTheme(choice));
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (next === current || reduce || typeof document.startViewTransition !== "function") {
    apply();
    return;
  }

  const x = origin?.x ?? window.innerWidth - 48;
  const y = origin?.y ?? 40;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  root.classList.add("theme-vt");
  const transition = document.startViewTransition(apply);
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 720, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("theme-vt"));
}
