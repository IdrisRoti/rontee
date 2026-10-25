import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetForm } from "@/components/auth/reset-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new Rontee password.",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: true },
};

/** Standalone reset-password from Stitch. Frontend preview until auth lands. */
export default function ResetPasswordPage() {
  return (
    <AuthLayout headerAction={{ label: "Log in", href: "/login" }}>
      <ResetForm />
    </AuthLayout>
  );
}
