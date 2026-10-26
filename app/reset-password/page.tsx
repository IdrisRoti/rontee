import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetForm } from "@/components/auth/reset-form";
import { PageTransition } from "@/components/shared/page-transition";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new Rontee password.",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: true },
};

/** Reset password from the emailed link (preview). */
export default function ResetPasswordPage() {
  return (
    <PageTransition>
      <AuthLayout art="reset" headerAction={{ label: "Log in", href: "/login" }}>
        <ResetForm />
      </AuthLayout>
    </PageTransition>
  );
}
