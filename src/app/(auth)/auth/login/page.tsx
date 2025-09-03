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
import { LoginForm } from "@/features/auth/components/login-form";
import { OAuthSignIn } from "@/features/auth/components/oauth-signin";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign In",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <Shell className="max-w-lg">
      <Card className="gap-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <OAuthSignIn />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-muted-foreground text-sm">
            <span className="mr-1 hidden sm:inline-block">
              Don&apos;t have an account?
            </span>
            <Link
              aria-label="Register"
              href={redirects.toRegister}
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Register
            </Link>
          </div>
          <Link
            aria-label="Reset password"
            href={redirects.toForgotPassword}
            className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
          >
            Reset password
          </Link>
        </CardFooter>
      </Card>
    </Shell>
  );
}
