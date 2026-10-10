"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICON_SIZES } from "@/lib/icons";
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

/**
 * Google sign-in placeholder (no OAuth provider wired yet).
 * Matches the repo placeholder convention: renders as `#`.
 */
export function GoogleButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-12 w-full rounded-xl text-sm shadow-none"
      asChild
    >
      <a href="#" aria-label={`${label} with Google (coming soon)`}>
        <GoogleMark />
        <span className="font-medium tracking-tight">{label}</span>
      </a>
    </Button>
  );
}

export function OrDivider() {
  return (
    <div className="relative flex items-center justify-center" aria-hidden>
      <div className="h-px w-full bg-border" />
      <span className="absolute bg-background px-3 text-xs font-medium tracking-widest text-muted uppercase">
        OR
      </span>
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  /** Optional right-aligned companion, e.g. a "Forgot password?" link. */
  labelExtra?: React.ReactNode;
};

/** Labeled password input with a visibility toggle. */
export function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  value,
  onChange,
  invalid,
  labelExtra,
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {labelExtra}
      </div>
      <div className="relative flex items-center">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          required
          minLength={8}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          className={cn("h-12 rounded-xl pr-11", invalid && "border-destructive")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-3 rounded-md p-1 text-muted transition-colors hover:text-foreground"
        >
          {visible ? (
            <EyeOff size={ICON_SIZES.prominent} aria-hidden />
          ) : (
            <Eye size={ICON_SIZES.prominent} aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
