import { z } from "zod";

import { userGenders, userRoles } from "@/db/schema/users";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  name: z.string(),
  email: z.email("Please enter a valid email address."),
  role: z.enum(userRoles),
  gender: z.enum(userGenders),
  phone: z.string().optional(),
  image: z.string().optional(),
});

export const updateUserSchema = createUserSchema;

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
