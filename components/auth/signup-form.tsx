"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";
import { GoogleButton, OrDivider, PasswordField } from "./auth-widgets";

/**
 * Standalone signup from Stitch. Frontend preview only:
 * validates locally, then shows a verify-email confirmation.
 * No backend or session is created yet.
 */
export function SignupForm() {
  const [email, setEmail] = React.useState("");
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
          Check your inbox
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted">
          We sent a verification link to{" "}
          <span className="font-semibold text-foreground">{email}</span>. Your
          reminders will start saving once you verify.
        </p>
        <Button className="h-12 w-full rounded-xl" asChild>
          <a href="/reminders/new?recovered=1">
            Continue
            <ArrowRight size={ICON_SIZES.compact} aria-hidden />
          </a>
        </Button>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          Use a different email
        </button>
      </FadeUp>
    );
  }

  return (
    <FadeUp y={16} className="flex flex-col">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
        Create your account
      </h2>
      <p className="mb-8 text-sm text-muted">
        Save your reminders and let Rontee remember for you.
      </p>

      <div className="mb-6">
        <GoogleButton label="Continue with Google" />
      </div>
      <div className="mb-6">
        <OrDivider />
      </div>

      <form
        className="flex flex-col gap-4"
        noValidate={false}
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email address</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="h-12 rounded-xl"
          />
        </div>
        <PasswordField
          id="signup-password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setMismatch(false);
          }}
        />
        <PasswordField
          id="signup-confirm"
          label="Confirm password"
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
          Create account
          <ArrowRight size={ICON_SIZES.default} aria-hidden />
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        Already have an account?{" "}
        <a
          href="/login"
          className="ml-1 font-semibold text-accent-soft transition-opacity hover:opacity-80"
        >
          Log in
        </a>
      </p>
      <p className="mx-auto mt-6 max-w-xs text-center text-xs leading-relaxed text-muted">
        By creating an account, you agree to Rontee&rsquo;s{" "}
        <a href="#" className="underline transition-colors hover:text-foreground">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline transition-colors hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </FadeUp>
  );
}
