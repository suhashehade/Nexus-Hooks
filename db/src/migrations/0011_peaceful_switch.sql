DROP TABLE "job_history" CASCADE;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "processed_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;