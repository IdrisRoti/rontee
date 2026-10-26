"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHeldDraft } from "@/lib/use-client";
import {
  AuthFootnote,
  AuthHeading,
  AuthSwap,
  GoogleButton,
  LINK,
  OrDivider,
  PasswordField,
  SubmitButton,
  TextField,
  emailError,
  usePretendRequest,
} from "./auth-widgets";

/**
 * Log in. Frontend preview: validates locally and pretends to sign in.
 * A held guest draft is handed back to the wizard as saved.
 */
export function LoginForm() {
  const held = useHeldDraft();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [tried, setTried] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const { pending, run } = usePretendRequest(() => setDone(true));

  const errors = {
    email: tried ? emailError(email) : undefined,
    password: tried && !password ? "Don’t forget your password! (We see the irony.)" : undefined,
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (emailError(email) || !password) return;
    run();
  };

  return (
    <AuthSwap stateKey={done ? "done" : "form"} dir={done ? 1 : -1}>
      {!done ? (
        <div>
          <AuthHeading title="Welcome" accent="back!">
            {held
              ? "Log in and we’ll pop your new reminder into your account."
              : "Good to see you. Your reminders are right where you left them."}
          </AuthHeading>

          <GoogleButton />
          <OrDivider />

          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
            <TextField
              id="login-email"
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />
            <PasswordField
              id="login-password"
              label="Password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              labelExtra={
                <Link href="/forgot-password" className="text-[13px] font-medium text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline">
                  Forgot it?
                </Link>
              }
            />
            <SubmitButton pending={pending} pendingLabel="Logging you in…">
              Log in
            </SubmitButton>
          </form>

          <AuthFootnote>
            New here?{" "}
            <Link href="/signup" className={LINK}>
              Make a free account
            </Link>
          </AuthFootnote>
        </div>
      ) : (
        <div>
          <AuthHeading title="And you’re" accent="in." focusOnMount>
            {held
              ? "Your new reminder is saved with the rest."
              : "This is a preview for now, so there’s nothing to show yet. Real accounts are on the way."}
          </AuthHeading>
          {held ? (
            <Button asChild size="lg" className="group/next w-full">
              <Link href="/reminders/new?recovered=1" transitionTypes={["nav-forward"]}>
                See my reminder
                <ArrowRight aria-hidden className="transition-transform duration-300 ease-out-expo group-hover/next:translate-x-1" />
              </Link>
            </Button>
          ) : (
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button asChild size="lg" className="flex-1">
                <Link href="/reminders/new" transitionTypes={["nav-forward"]}>
                  <Plus aria-hidden />
                  Add a reminder
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="flex-1">
                <Link href="/" transitionTypes={["nav-back"]}>
                  Back to home
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </AuthSwap>
  );
}
