"use client";

import * as React from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AuthFootnote,
  AuthHeading,
  AuthSwap,
  LINK,
  SubmitButton,
  TextField,
  emailError,
  usePretendRequest,
} from "./auth-widgets";

const RESEND_AFTER = 30;

/**
 * Forgot password. Frontend preview: validates the email, pretends to send
 * a link, then offers a resend after a short cool-down. No email is sent yet.
 */
export function ForgotForm() {
  const [email, setEmail] = React.useState("");
  const [tried, setTried] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [sentAt, setSentAt] = React.useState(0);
  const [now, setNow] = React.useState(0);
  const markSent = () => {
    setSent(true);
    setSentAt(Date.now());
    setNow(Date.now());
  };
  const { pending, run } = usePretendRequest(markSent);
  const resend = usePretendRequest(markSent);

  const wait = sent ? Math.max(0, RESEND_AFTER - Math.floor((now - sentAt) / 1000)) : 0;
  React.useEffect(() => {
    if (!sent || wait === 0) return;
    const id = window.setTimeout(() => setNow(Date.now()), 1000);
    return () => window.clearTimeout(id);
  }, [sent, wait, now]);

  const error = tried ? emailError(email) : undefined;

  return (
    <AuthSwap stateKey={sent ? "sent" : "form"} dir={sent ? 1 : -1}>
      {!sent ? (
        <div>
          <AuthHeading title="Forgot your" accent="password?">
            Happens to everyone. Pop your email in and we’ll send you a link to set a new one.
          </AuthHeading>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setTried(true);
              if (!emailError(email)) run();
            }}
            className="flex flex-col gap-5"
          >
            <TextField
              id="forgot-email"
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              error={error}
            />
            <SubmitButton pending={pending} pendingLabel="Sending…">
              Send me a link
            </SubmitButton>
          </form>
          <AuthFootnote>
            Remembered it?{" "}
            <Link href="/login" className={LINK}>
              Log in
            </Link>
          </AuthFootnote>
        </div>
      ) : (
        <div>
          <span aria-hidden className="mb-6 flex size-14 -rotate-6 items-center justify-center rounded-2xl bg-sky text-ink shadow-paper">
            <MailCheck size={26} />
          </span>
          <AuthHeading title="Check your" accent="inbox." focusOnMount>
            If there’s an account for <span className="font-semibold text-foreground">{email}</span>, a link to set a new
            password is on its way. It can take a minute.
          </AuthHeading>
          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full tabular-nums"
              disabled={wait > 0 || resend.pending}
              onClick={resend.run}
            >
              {resend.pending ? "Sending again…" : wait > 0 ? `Send it again in ${wait}s` : "Send it again"}
            </Button>
            <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </div>
          <AuthFootnote>
            Nothing yet? Have a peek in your spam folder.
          </AuthFootnote>
        </div>
      )}
    </AuthSwap>
  );
}
