ALTER TABLE "delivery_attempts" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "delivery_attempts" ALTER COLUMN "attempt" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "attempts" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "name" varchar NOT NULL;