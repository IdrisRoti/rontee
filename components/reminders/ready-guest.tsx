"use client";

import Link from "next/link";
import { Lock, Mail, PencilLine } from "lucide-react";

import { GoogleMark } from "@/components/auth/auth-widgets";
import { FadeIn } from "@/components/shared/kinetic";
import { Button } from "@/components/ui/button";

/**
 * Guest gate copy + actions. The draft is held in local storage while
 * they create an account (see wizard), then restored on `?recovered=1`.
 */
export function ReadyGuest({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <FadeIn immediate delay={0.35}>
        <h1 id="wizard-heading" tabIndex={-1} className="type-h1 text-balance outline-none">
          Your reminder is <span className="type-serif">ready!</span>
        </h1>
      </FadeIn>
      <FadeIn immediate delay={0.45}>
        <p className="type-body-lg mx-auto mt-4 max-w-md text-pretty text-muted">
          Create a free account to keep it safe and get your nudges by email and notification.
        </p>
      </FadeIn>

      <FadeIn immediate delay={0.55} className="mt-8 flex w-full max-w-sm flex-col gap-2.5">
        <Button asChild variant="secondary" size="lg" className="w-full">
          <a href="#" aria-label="Continue with Google (coming soon)">
            <GoogleMark />
            Continue with Google
          </a>
        </Button>
        <Button asChild size="lg" className="w-full">
          <Link href="/signup" transitionTypes={["nav-forward"]}>
            <Mail aria-hidden />
            Sign up with email
          </Link>
        </Button>
      </FadeIn>

      <FadeIn immediate delay={0.65}>
        <p className="mt-5 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" transitionTypes={["nav-forward"]} className="font-semibold text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
        <p className="mt-6 flex items-center justify-center gap-2 text-[13px] text-muted">
          <Lock size={14} aria-hidden />
          We’ll hold onto it while you sign up.
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="mx-auto mt-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
        >
          <PencilLine size={14} aria-hidden /> Change something
        </button>
      </FadeIn>
    </div>
  );
}
