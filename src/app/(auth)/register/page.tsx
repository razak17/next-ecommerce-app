import { IconBrandFacebook, IconBrandGithub } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { redirects } from "@/lib/constants";

import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/env";
import { OAuthSignIn } from "@/features/auth/components/oauth-signin";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign Up",
  description: "Sign up for an account",
};

export default function RegisterPage() {
  return (
    <Shell className="max-w-lg">
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Choose your preferred registration up method
          </CardDescription>
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
          <RegisterForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-muted-foreground text-sm">
            By creating an account, you agree to our{" "}
            <Link
              aria-label="Sign in"
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              aria-label="Sign in"
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </Shell>
  );
}
