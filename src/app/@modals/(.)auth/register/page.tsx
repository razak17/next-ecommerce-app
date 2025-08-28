import Link from "next/link";

import { redirects } from "@/lib/constants";

import { DialogShell } from "@/components/dialog-shell";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OAuthSignIn } from "@/features/auth/components/oauth-signin";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterModal() {
  return (
    <DialogShell className="flex flex-col gap-4 overflow-visible">
      <DialogHeader>
        <DialogTitle className="text-left text-2xl">
          Create an account
        </DialogTitle>
        <DialogDescription className="text-left text-muted-foreground">
          Choose your preferred registration method
        </DialogDescription>
      </DialogHeader>
      <OAuthSignIn />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <RegisterForm />
      <DialogFooter className="">
        <p className="px-8 text-center text-muted-foreground text-sm">
          By creating an account, you agree to our{" "}
          <Link
            aria-label="Terms"
            href={redirects.toTerms}
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            aria-label="Privacy"
            href={redirects.toPrivacy}
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </DialogFooter>
    </DialogShell>
  );
}
