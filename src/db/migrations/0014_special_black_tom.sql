ALTER TABLE "orders" ALTER COLUMN "paymentMethod" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_method";--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('paypal');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" SET DATA TYPE "public"."payment_method" USING "paymentMethod"::"public"."payment_method";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "stripe_payment_intent_id";