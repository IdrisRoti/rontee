"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { AutoHeight } from "@/components/reminders/step-ui";
import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function GoogleMark() {
  return (
    <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** Google sign-in placeholder (no OAuth provider wired yet; renders as `#`). */
export function GoogleButton() {
  return (
    <Button asChild variant="secondary" size="lg" className="w-full">
      <a href="#" aria-label="Continue with Google (coming soon)">
        <GoogleMark />
        Continue with Google
      </a>
    </Button>
  );
}

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-4 text-[13px] text-faint" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      or
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Heading — focused when the state changes (form → done).              */
/* ------------------------------------------------------------------ */

export function AuthHeading({
  title,
  accent,
  focusOnMount = false,
  children,
}: {
  title: string;
  accent: string;
  focusOnMount?: boolean;
  children?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => {
    if (focusOnMount) ref.current?.focus({ preventScroll: true });
  }, [focusOnMount]);
  return (
    <div className="mb-8">
      <h1 ref={ref} tabIndex={-1} className="type-h1 text-balance outline-none">
        {title} <span className="type-serif">{accent}</span>
      </h1>
      {children && <div className="type-body-lg mt-4 text-pretty text-muted">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fields                                                               */
/* ------------------------------------------------------------------ */

const INPUT =
  "h-[52px] w-full min-w-0 rounded-2xl border border-border bg-surface px-4 text-base text-foreground shadow-subtle outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-faint hover:border-border-strong focus:border-border-strong focus:ring-4 focus:ring-primary/[0.07] aria-invalid:border-ember aria-invalid:ring-4 aria-invalid:ring-ember/15";

/** Friendly inline message under a field; slides in and out. */
function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: React.ReactNode }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {error ? (
        <motion.p
          key="error"
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: EASE.outQuart }}
          className="flex items-center gap-1.5 text-[13px] font-medium text-destructive"
        >
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-ember" />
          {error}
        </motion.p>
      ) : hint ? (
        <motion.div
          key="hint"
          id={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[13px] text-muted"
        >
          {hint}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  /** Right-aligned companion to the label, e.g. "Forgot it?". */
  labelExtra?: React.ReactNode;
} & Omit<React.ComponentProps<"input">, "id" | "value" | "onChange">;

export function TextField({ id, label, value, onChange, error, hint, labelExtra, className, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {labelExtra}
      </div>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(INPUT, className)}
        {...props}
      />
      <FieldMessage id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}

/** Password with a show/hide toggle and, optionally, a friendly strength meter. */
export function PasswordField({
  meter = false,
  ...props
}: Omit<FieldProps, "type"> & { meter?: boolean }) {
  const [visible, setVisible] = React.useState(false);
  const { id, label, value, onChange, error, hint, labelExtra, ...rest } = props;
  const strength = passwordStrength(value);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-msg`}
          className={cn(INPUT, "pr-14")}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={visible ? "hide" : "show"}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      {meter && !error ? (
        <StrengthMeter id={`${id}-msg`} strength={strength} empty={!value} />
      ) : (
        <FieldMessage id={`${id}-msg`} error={error} hint={hint} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Strength meter — three little segments and a kind word.              */
/* ------------------------------------------------------------------ */

type Strength = 0 | 1 | 2 | 3;

export function passwordStrength(pw: string): Strength {
  if (pw.length < 8) return 0;
  let score = 1;
  if (/\d|[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12 && /[a-z]/.test(pw) && /[A-Z0-9]/.test(pw)) score++;
  return score as Strength;
}

const STRENGTH: Record<Strength, { label: string; color: string }> = {
  0: { label: "At least 8 characters", color: "bg-ember" },
  1: { label: "Okay. A number or symbol would help", color: "bg-butter" },
  2: { label: "Good one", color: "bg-sage" },
  3: { label: "Great, that’s a strong one", color: "bg-sage" },
};

function StrengthMeter({ id, strength, empty }: { id: string; strength: Strength; empty: boolean }) {
  const lit = empty ? 0 : Math.max(strength, 1);
  const tone = STRENGTH[strength];
  return (
    <div id={id} className="flex items-center gap-3" aria-live="polite">
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} className="relative h-1.5 w-7 overflow-hidden rounded-full bg-border">
            <motion.span
              className={cn("absolute inset-0 origin-left rounded-full transition-colors duration-300", tone.color)}
              initial={false}
              animate={{ scaleX: n <= lit ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30, delay: n * 0.04 }}
            />
          </span>
        ))}
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={empty ? "empty" : strength}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: EASE.outQuart }}
          className="text-[13px] text-muted"
        >
          {empty ? STRENGTH[0].label : tone.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Submit — shows a little spinner while "working".                    */
/* ------------------------------------------------------------------ */

export function SubmitButton({ pending, children, pendingLabel }: { pending: boolean; children: React.ReactNode; pendingLabel: string }) {
  return (
    <Button type="submit" size="lg" disabled={pending} aria-busy={pending} className="group/next mt-2 w-full disabled:opacity-80">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={pending ? "pending" : "idle"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: EASE.outQuart }}
          className="flex items-center gap-2"
        >
          {pending ? (
            <>
              <LoaderCircle aria-hidden className="animate-spin" />
              {pendingLabel}
            </>
          ) : (
            <>
              {children}
              <ArrowRight aria-hidden className="transition-transform duration-300 ease-out-expo group-hover/next:translate-x-1" />
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Swap — form ↔ done, sliding with blur while the height follows.      */
/* ------------------------------------------------------------------ */

export function AuthSwap({ stateKey, dir = 1, children }: { stateKey: string; dir?: 1 | -1; children: React.ReactNode }) {
  return (
    <AutoHeight>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.div
          key={stateKey}
          custom={dir}
          initial={{ opacity: 0, x: dir * 48, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: dir * -48, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: EASE.outExpo }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </AutoHeight>
  );
}

/** Small "Already have an account? Log in" style footnote. */
export function AuthFootnote({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-center text-sm text-muted">{children}</p>;
}

export const LINK = "font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 transition-colors hover:decoration-ember";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailError(email: string): string | undefined {
  if (!email.trim()) return "We’ll need your email for this one.";
  if (!EMAIL_RE.test(email.trim())) return "Hmm, that email looks a little off.";
}

/** Fake a short round-trip so the pending state is felt (no backend yet). */
export function usePretendRequest(onDone: () => void) {
  const [pending, setPending] = React.useState(false);
  const run = () => {
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      onDone();
    }, 900);
  };
  return { pending, run };
}
