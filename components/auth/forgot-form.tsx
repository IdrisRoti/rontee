"use client";

import * as React from "react";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";

/**
 * Standalone forgot-password from Stitch. Frontend preview only:
 * validates the email locally, then shows a check-inbox confirmation.
 * No email is actually sent yet.
 */
export function ForgotForm() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  if (sent) {
    return (
      <FadeUp y={16} className="flex flex-col">
        <div
          aria-hidden
          className="mb-6 flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle text-accent-soft"
        >
          <Mail size={22} />
        </div>
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
          Check your inbox
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted">
          If an account exists for{" "}
          <span className="font-semibold text-foreground">{email}</span>, a
          reset link is on its way.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setSent(false)}
          className="h-12 w-full rounded-xl"
        >
          Resend link
        </Button>
        <p className="mt-6 text-center text-sm text-muted">
          Remember your password?{" "}
          <a
            href="/login"
            className="ml-1 font-medium text-accent-soft transition-opacity hover:opacity-80"
          >
            Log in
          </a>
        </p>
      </FadeUp>
    );
  }

  return (
    <FadeUp y={16} className="flex flex-col">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
        Forgot your password?
      </h2>
      <p className="mb-8 text-sm text-muted">
        Enter your email and we&rsquo;ll send you a link to reset your
        password.
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="forgot-email">Email address</Label>
          <Input
            id="forgot-email"
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
        <Button type="submit" className="mt-2 h-12 w-full rounded-xl">
          Send reset link
          <ArrowRight size={ICON_SIZES.default} aria-hidden />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Remember your password?{" "}
        <a
          href="/login"
          className="ml-1 font-medium text-accent-soft transition-opacity hover:opacity-80"
        >
          Log in
        </a>
      </p>
    </FadeUp>
  );
}
