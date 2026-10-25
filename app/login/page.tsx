import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Rontee to keep your important reminders close.",
  alternates: { canonical: "/login" },
};

/** Standalone login from Stitch. Frontend preview until auth lands. */
export default function LoginPage() {
  return (
    <AuthLayout headerAction={{ label: "Create Account", href: "/signup" }}>
      <LoginForm />
    </AuthLayout>
  );
}
