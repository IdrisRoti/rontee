"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";
import { PasswordField } from "./auth-widgets";

/**
 * Standalone reset-password from Stitch. Frontend preview only:
 * validates locally, then confirms the update.
 * (Real tokens arrive with the backend.)
 */
export function ResetForm() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [mismatch, setMismatch] = React.useState(false);
  const [done, setDone] = React.useState(false);

  if (done) {
    return (
      <FadeUp y={16} className="flex flex-col">
        <div
          aria-hidden
          className="mb-6 flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle text-accent-soft"
        >
          <Check size={24} strokeWidth={2.2} />
        </div>
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
          Password updated
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted">
          You can now log in with your new password.
        </p>
        <Button className="h-12 w-full rounded-xl" asChild>
          <a href="/login">
            Log in
            <ArrowRight size={ICON_SIZES.compact} aria-hidden />
          </a>
        </Button>
      </FadeUp>
    );
  }

  return (
    <FadeUp y={16} className="flex flex-col">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
        Reset your password
      </h2>
      <p className="mb-8 text-sm text-muted">
        Choose a new, secure password to access your account.
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (password !== confirm) {
            setMismatch(true);
            return;
          }
          setMismatch(false);
          setDone(true);
        }}
      >
        <PasswordField
          id="reset-password"
          label="New password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setMismatch(false);
          }}
        />
        <PasswordField
          id="reset-confirm"
          label="Confirm new password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            setMismatch(false);
          }}
          invalid={mismatch}
        />
        {mismatch && (
          <p role="alert" className="text-xs font-medium text-destructive">
            Passwords don&rsquo;t match. Please try again.
          </p>
        )}
        <Button type="submit" className="mt-2 h-12 w-full rounded-xl">
          Reset password
          <ArrowRight size={ICON_SIZES.default} aria-hidden />
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        Remember your password?{" "}
        <a
          href="/login"
          className="ml-0.5 font-medium text-accent-soft transition-opacity hover:opacity-80"
        >
          Log in
        </a>
      </p>
    </FadeUp>
  );
}
