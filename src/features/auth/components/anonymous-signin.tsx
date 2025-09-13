"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function AnonymousSignIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { refetch } = authClient.useSession();

  const handleSignInAnonymous = async () => {
    setIsLoading(true);

    const { error } = await authClient.signIn.anonymous();

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Signed in successfully.");
    setIsLoading(false);
    await refetch();
    router.push(window.location.origin as Route);
  };
  return (
    <Button
      disabled={isLoading}
      variant="outline"
      className="w-full bg-background"
      onClick={handleSignInAnonymous}
    >
      {isLoading && (
        <Icons.spinner
          className="mr-2 size-4 animate-spin"
          aria-hidden="true"
        />
      )}
      Anonymous Login
    </Button>
  );
}
