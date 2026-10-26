"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthFootnote, AuthHeading, AuthSwap, LINK, PasswordField, SubmitButton, usePretendRequest } from "./auth-widgets";

/**
 * Reset password (from the emailed link). Frontend preview: validates
 * locally and confirms. Real reset tokens arrive with the backend.
 */
export function ResetForm() {
  const [password, setPassword] = React.useState("");
  const [tried, setTried] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const { pending, run } = usePretendRequest(() => setDone(true));

  const error = tried && password.length < 8 ? "A few more characters, please. At least 8." : undefined;

  return (
    <AuthSwap stateKey={done ? "done" : "form"}>
      {!done ? (
        <div>
          <AuthHeading title="Pick a new" accent="password.">
            Something you’ll remember, ideally. (We can’t help with that one, sorry.)
          </AuthHeading>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setTried(true);
              if (password.length >= 8) run();
            }}
            className="flex flex-col gap-5"
          >
            <PasswordField
              id="reset-password"
              label="New password"
              autoComplete="new-password"
              placeholder="Make it a good one"
              value={password}
              onChange={setPassword}
              error={error}
              meter
            />
            <SubmitButton pending={pending} pendingLabel="Saving…">
              Save new password
            </SubmitButton>
          </form>
          <AuthFootnote>
            Remembered the old one?{" "}
            <Link href="/login" className={LINK}>
              Log in
            </Link>
          </AuthFootnote>
        </div>
      ) : (
        <div>
          <span aria-hidden className="mb-6 flex size-14 rotate-6 items-center justify-center rounded-2xl bg-sage text-ink shadow-paper">
            <Check size={28} strokeWidth={2.4} />
          </span>
          <AuthHeading title="All" accent="sorted." focusOnMount>
            Your new password is ready to go.
          </AuthHeading>
          <Button asChild size="lg" className="group/next w-full">
            <Link href="/login" transitionTypes={["nav-forward"]}>
              Log in
              <ArrowRight aria-hidden className="transition-transform duration-300 ease-out-expo group-hover/next:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </AuthSwap>
  );
}
