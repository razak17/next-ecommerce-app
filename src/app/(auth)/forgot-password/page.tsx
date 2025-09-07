import type { Metadata } from "next";
import Link from "next/link";

import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/env";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Forgot Password",
  description: "Enter your email to reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <Shell className="max-w-lg">
      <Card className="gap-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-2">
          <div className="text-muted-foreground text-sm">
            <Link
              aria-label="Register"
              href="/auth/login"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Back to login?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
}
