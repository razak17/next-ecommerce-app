"use server";

import type { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth/client";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { type UserRole as Role, user } from "@/db/schema";
import { UserRole } from "@/types";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    revalidatePath("/");

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
  role = UserRole.Consumer,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
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
      callbackURL: "/profile",
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

    revalidatePath("/profile");

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
