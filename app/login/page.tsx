import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { PageTransition } from "@/components/shared/page-transition";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Rontee to keep your important reminders close.",
  alternates: { canonical: "/login" },
};

/** Log in. A held guest draft comes along and is saved after login. */
export default function LoginPage() {
  return (
    <PageTransition>
      <AuthLayout art="login" showDraft headerAction={{ label: "Sign up", href: "/signup" }}>
        <LoginForm />
      </AuthLayout>
    </PageTransition>
  );
}
