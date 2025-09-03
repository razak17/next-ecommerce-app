"use server";

import type { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    revalidatePath(redirects.toLanding);

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    const e = error as APIError;

    return {
      success: false,
      error: e.message || getErrorMessage(e),
    };
  }
};

export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  role = "consumer",
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "consumer" | "admin";
}) => {
  try {
    const newUser = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
      },
    });
    await db
      .update(user)
      .set({
        firstName,
        lastName,
        role,
      })
      .where(eq(user.id, newUser.user.id));

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      error: e.message || getErrorMessage(e),
    };
  }
};

export const sendVerificationEmail = async (email: string) => {
  try {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: redirects.toProfile,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    const e = error as APIError;

    return {
      success: false,
      error: e.message || getErrorMessage(e),
    };
  }
};

export const verifyEmail = async (token: string) => {
  try {
    await authClient.verifyEmail({
      query: { token },
    });

    revalidatePath(redirects.toProfile);

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    const e = error as APIError;

    return {
      success: false,
      error: e.message || getErrorMessage(e),
    };
  }
};
