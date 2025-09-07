"use client";

import * as React from "react";

import { authClient } from "@/lib/auth/client";
import { showErrorToast } from "@/lib/handle-error";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

type OAuthStrategy = "google" | "github";

const oauthProviders = [
  { name: "Google", strategy: "google", icon: "google" },
  { name: "GitHub", strategy: "github", icon: "gitHub" },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
}[];

export function OAuthSignIn() {
  const [loading, setLoading] = React.useState<OAuthStrategy | null>(null);

  async function oauthSignIn(provider: OAuthStrategy) {
    try {
      setLoading(provider);
      await authClient.signIn.social({
        provider: provider,
        callbackURL: "/",
      });
    } catch (err) {
      setLoading(null);
      showErrorToast(err);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            key={provider.strategy}
            variant="outline"
            className="w-full bg-background"
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={loading !== null}
          >
            {loading === provider.strategy ? (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icon className="mr-2 size-4" aria-hidden="true" />
            )}
            {provider.name}
            <span className="sr-only">{provider.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
