"use server";

import type { APIError } from "better-auth";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";

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

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    const e = error as APIError;

    return {
      success: false,
      statusCode: e.statusCode,
      message: e.message || "An unknown error occurred.",
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
      message: "Signed up successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};
