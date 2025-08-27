CREATE TYPE "public"."user_role" AS ENUM('admin', 'consumer');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role";