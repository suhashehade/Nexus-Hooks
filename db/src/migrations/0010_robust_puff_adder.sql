CREATE TABLE "job_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_history" ADD CONSTRAINT "job_history_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "attempts";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "processed_at";