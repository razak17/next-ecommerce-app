"use server";

import type { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { z } from "zod";

import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema/users";
import { getCurrentUser } from "@/features/users/queries/users";
import type {
  changePasswordSchema,
  updateProfileSchema,
} from "../validations/auth";

export async function updateProfile(
  input: z.infer<typeof updateProfileSchema>,
) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    await db
      .update(user)
      .set({
        ...input,
        name: `${input.firstName} ${input.lastName}`,
      })
      .where(eq(user.id, currentUser.id));

    revalidatePath("/profile");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function changePassword(
  input: z.infer<typeof changePasswordSchema>,
) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    await auth.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        // revokeOtherSessions: true, // Optionally revoke other sessions
      },
      headers: await headers(),
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    const e = error as APIError;
    return {
      success: false,
      error: e.message || getErrorMessage(error),
    };
  }
}
