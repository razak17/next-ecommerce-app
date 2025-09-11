import {
  adminClient,
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { ac, admin, consumer } from "./permissions";
import { env } from "@/env.js";
import type { auth } from ".";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
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
