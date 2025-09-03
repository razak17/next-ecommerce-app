import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";

import { ac, admin, consumer } from "./permissions";
import ResetPasswordEmail from "@/components/reset-password-email";
import AccountVerificationEmail from "@/components/verification-email";
import { siteConfig } from "@/config/site";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { env } from "@/env";
import { resend } from "../resend";

const EMAIL_FROM = `${env.EMAIL_SENDER_NAME} <${env.EMAIL_SENDER_ADDRESS}>`;

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
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: "Verify your email address",
        react: AccountVerificationEmail({
          email: user.email,
          verificationUrl: url,
          companyName: siteConfig.name,
        }),
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({
          name: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });
    },
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
