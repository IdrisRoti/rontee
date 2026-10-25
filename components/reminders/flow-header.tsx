"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { LogoLink } from "@/components/shared/logo";
import { ThemeMenu } from "@/components/shared/theme-menu";
import { StepProgress, type FlowStage } from "./step-progress";

/** Calm flow header: logo (shared with the landing navbar), progress, theme, leave. */
export function FlowHeader({ stage }: { stage: FlowStage }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto grid h-20 max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-8">
        <div className="justify-self-start">
          <LogoLink compact />
        </div>
        <StepProgress stage={stage} />
        <div className="flex items-center gap-1 justify-self-end">
          <ThemeMenu />
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
          >
            <X size={16} aria-hidden />
            <span className="hidden sm:inline">Close</span>
            <span className="sr-only sm:hidden">Close and go home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
