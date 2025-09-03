CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
UPDATE "user"
SET gender = 'other'
WHERE gender IS NULL
   OR gender NOT IN ('male', 'female', 'other');
ALTER TABLE "user" ALTER COLUMN "gender" SET DATA TYPE "public"."user_gender" USING "gender"::"public"."user_gender";
