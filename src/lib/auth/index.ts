import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";

import { ac, admin, consumer } from "./permissions";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { env } from "@/env";

export const auth = betterAuth({
  user: {
    additionalFields: {
      gender: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async () => {},
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        consumer,
      },
      adminRoles: ["admin"],
      defaultRole: "consumer",
    }),
    nextCookies(), // make sure this is the last plugin in the array
  ],
});
