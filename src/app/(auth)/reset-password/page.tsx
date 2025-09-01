import type { Metadata } from "next";
import Link from "next/link";

import { redirects } from "@/lib/constants";

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
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Reset Password",
  description: "Reset your password",
};

export default function ResetPasswordPage() {
  return (
    <Shell className="max-w-lg">
      <Card className="gap-4 bg-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ResetPasswordForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-2">
          <div className="text-muted-foreground text-sm">
            <Link
              aria-label="Register"
              href={redirects.toRegister}
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Need an account?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
}
