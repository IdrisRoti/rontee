import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotForm } from "@/components/auth/forgot-form";
import { PageTransition } from "@/components/shared/page-transition";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Rontee password via email.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

/** Forgot password: email a reset link (preview). */
export default function ForgotPasswordPage() {
  return (
    <PageTransition>
      <AuthLayout art="forgot" headerAction={{ label: "Log in", href: "/login" }}>
        <ForgotForm />
      </AuthLayout>
    </PageTransition>
  );
}
