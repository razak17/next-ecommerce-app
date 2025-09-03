"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { redirects } from "@/lib/constants";
import { getErrorMessage } from "@/lib/handle-error";
import { generateId } from "@/lib/id";

import { db } from "@/db/drizzle";
import { type User, user } from "@/db/schema";
import type { CreateUserSchema } from "../validations/users";

export async function createUser(input: CreateUserSchema & { name: string }) {
  try {
    const userId = generateId();

    await db.insert(user).values({
      id: userId,
      ...input,
      emailVerified: false,
    });

    revalidatePath(redirects.adminToUsers);

    return {
      success: false,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updateUser(
  id: User["id"],
  input: CreateUserSchema & { name: string },
) {
  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    await db
      .update(user)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id));

    revalidatePath(redirects.adminToUsers);
    revalidatePath(`${redirects.adminToUsers}/${id}`);

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

export async function deleteUser(id: User["id"]) {
  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    await db.delete(user).where(eq(user.id, id));

    revalidatePath(redirects.adminToUsers);

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
