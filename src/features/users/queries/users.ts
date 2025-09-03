"use server";

import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { db } from "@/db/drizzle";
import { type User, user } from "@/db/schema";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!currentUser) {
    redirect("/login");
  }

  return {
    ...session,
    currentUser,
  };
};

export const getAllUsers = async () => {
  const users = await db.query.user.findMany({
    orderBy: desc(user.createdAt),
  });

  return users;
};

export const getUser = async (userId: User["id"]) => {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  return foundUser;
};
