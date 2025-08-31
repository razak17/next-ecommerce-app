ALTER TABLE "categories" ALTER COLUMN "image" SET DATA TYPE json USING image::json;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "image" SET DEFAULT 'null'::json;
