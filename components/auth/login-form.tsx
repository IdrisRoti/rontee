"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";
import { GoogleButton, OrDivider, PasswordField } from "./auth-widgets";

/**
 * Standalone login from Stitch. Frontend preview only:
 * validates locally, then shows a signed-in confirmation.
 * No backend session is created yet.
 */
export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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
          Welcome back
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted">
          You&rsquo;re signed in as{" "}
          <span className="font-semibold text-foreground">{email}</span> in this
          preview. Full sessions arrive with the backend.
        </p>
        <Button className="h-12 w-full rounded-xl" asChild>
          <Link href="/">
            Back to home
            <ArrowRight size={ICON_SIZES.compact} aria-hidden />
          </Link>
        </Button>
      </FadeUp>
    );
  }

  return (
    <FadeUp y={16} className="flex flex-col">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
        Welcome back
      </h2>
      <p className="mb-8 text-sm text-muted">
        Log in to keep your important reminders close.
      </p>

      <div className="mb-6">
        <GoogleButton label="Continue with Google" />
      </div>
      <div className="mb-6">
        <OrDivider />
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setDone(true);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email address</Label>
          <Input
            id="login-email"
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
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          labelExtra={
            <a
              href="/forgot-password"
              className="text-sm font-medium text-accent-soft transition-opacity hover:opacity-80"
            >
              Forgot password?
            </a>
          }
        />
        <Button type="submit" className="mt-2 h-12 w-full rounded-xl">
          Log in
          <ArrowRight size={ICON_SIZES.default} aria-hidden />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&rsquo;t have an account?{" "}
        <a
          href="/signup"
          className="ml-1 font-medium text-accent-soft transition-opacity hover:opacity-80"
        >
          Create one
        </a>
      </p>
    </FadeUp>
  );
}
