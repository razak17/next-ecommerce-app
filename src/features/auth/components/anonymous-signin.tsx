"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { anonymousSignIn } from "../actions/auth";

export function AnonymousSignIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSignInAnonymous = async () => {
    setIsLoading(true);
    try {
      const data = await anonymousSignIn();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      router.refresh();
      toast.success("Signed in successfully.");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
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
