import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free Rontee account to save your reminders.",
};

/** Standalone signup from Stitch. Frontend preview until auth lands. */
export default function SignupPage() {
  return (
    <AuthLayout headerAction={{ label: "Log in", href: "/login" }}>
      <SignupForm />
    </AuthLayout>
  );
}
