"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MailCheck, Plus } from "lucide-react";

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
 * Sign up. Frontend preview: validates locally, pretends to create the
 * account, then either hands the held draft back to the wizard ("saved")
 * or asks them to confirm their email.
 */
export function SignupForm() {
  const held = useHeldDraft();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [tried, setTried] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const { pending, run } = usePretendRequest(() => setDone(true));

  const errors = {
    email: tried ? emailError(email) : undefined,
    password: tried && password.length < 8 ? "A few more characters, please. At least 8." : undefined,
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (emailError(email) || password.length < 8) return;
    run();
  };

  const first = name.trim().split(/\s+/)[0];

  return (
    <AuthSwap stateKey={done ? "done" : "form"} dir={done ? 1 : -1}>
      {!done ? (
        <div>
          {held ? (
            <AuthHeading title="Let’s keep it" accent="safe.">
              Make a free account and we’ll save your reminder and start nudging you.
            </AuthHeading>
          ) : (
            <AuthHeading title="Make yourself" accent="at home.">
              It’s free and takes about a minute. Then we’ll do the remembering.
            </AuthHeading>
          )}

          <GoogleButton />
          <OrDivider />

          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
            <TextField
              id="signup-name"
              label="What should we call you?"
              labelExtra={<span className="text-[13px] text-muted">Optional</span>}
              value={name}
              onChange={setName}
              autoComplete="given-name"
              placeholder="Your first name"
              maxLength={60}
            />
            <TextField
              id="signup-email"
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
              id="signup-password"
              label="Password"
              autoComplete="new-password"
              placeholder="Make it a good one"
              value={password}
              onChange={setPassword}
              error={errors.password}
              meter
            />
            <SubmitButton pending={pending} pendingLabel="Setting things up…">
              {held ? "Create account & save" : "Create my account"}
            </SubmitButton>
          </form>

          <AuthFootnote>
            Already have an account?{" "}
            <Link href="/login" className={LINK}>
              Log in
            </Link>
          </AuthFootnote>
          <p className="mx-auto mt-5 max-w-xs text-center text-[13px] leading-relaxed text-muted">
            By signing up you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      ) : held ? (
        <div>
          <AuthHeading title={first ? `You’re in, ${first}!` : "You’re in!"} accent="Nice one." focusOnMount>
            Your reminder is saved to your account. We’ve also sent a quick link to{" "}
            <span className="font-semibold text-foreground">{email}</span> to check it’s really you.
          </AuthHeading>
          <Button asChild size="lg" className="group/next w-full">
            <Link href="/reminders/new?recovered=1" transitionTypes={["nav-forward"]}>
              See my reminder
              <ArrowRight aria-hidden className="transition-transform duration-300 ease-out-expo group-hover/next:translate-x-1" />
            </Link>
          </Button>
        </div>
      ) : (
        <div>
          <span aria-hidden className="mb-6 flex size-14 -rotate-6 items-center justify-center rounded-2xl bg-sky text-ink shadow-paper">
            <MailCheck size={26} />
          </span>
          <AuthHeading title="Check your" accent="inbox." focusOnMount>
            {first ? `Welcome, ${first}! ` : "Welcome! "}We sent a link to{" "}
            <span className="font-semibold text-foreground">{email}</span>. Tap it to confirm it’s you and you’re all set.
          </AuthHeading>
          <div className="flex flex-col gap-2.5">
            <Button asChild size="lg" className="w-full">
              <Link href="/reminders/new" transitionTypes={["nav-forward"]}>
                <Plus aria-hidden />
                Add my first reminder
              </Link>
            </Button>
            <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => setDone(false)}>
              Use a different email
            </Button>
          </div>
        </div>
      )}
    </AuthSwap>
  );
}
