import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";
import { PageTransition } from "@/components/shared/page-transition";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free Rontee account to save your reminders.",
  alternates: { canonical: "/signup" },
};

/** Sign up. A guest arriving from the create flow brings their held draft along. */
export default function SignupPage() {
  return (
    <PageTransition>
      <AuthLayout art="signup" showDraft headerAction={{ label: "Log in", href: "/login" }}>
        <SignupForm />
      </AuthLayout>
    </PageTransition>
  );
}
