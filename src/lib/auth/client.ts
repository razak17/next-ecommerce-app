import { adminClient, anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { ac, admin, consumer } from "./permissions";
import { env } from "@/env.js";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        consumer,
      },
      defaultRole: "consumer",
    }),
    anonymousClient(),
  ],
});
