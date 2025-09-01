import Link from "next/link";

import { redirects } from "@/lib/constants";

import { DialogShell } from "@/components/dialog-shell";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "@/features/auth/components/login-form";
import { OAuthSignIn } from "@/features/auth/components/oauth-signin";

export default function LoginModal() {
  return (
    <DialogShell className="flex flex-col gap-4 overflow-visible">
      <DialogHeader>
        <DialogTitle className="text-left text-2xl">Login</DialogTitle>
        <DialogDescription className="text-left text-muted-foreground">
          Choose your preferred login method
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
      <LoginForm isModal />
      <DialogFooter className="w-full sm:justify-between">
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
          href={redirects.toResetPassword}
          className="text-primary text-sm underline-offset-4 transition-colors hover:underline"
        >
          Reset password
        </Link>
      </DialogFooter>
    </DialogShell>
  );
}
