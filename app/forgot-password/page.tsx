import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Rontee password via email.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

/** Standalone forgot-password from Stitch. Frontend preview until auth lands. */
export default function ForgotPasswordPage() {
  return (
    <AuthLayout headerAction={{ label: "Log in", href: "/login" }}>
      <ForgotForm />
    </AuthLayout>
  );
}
