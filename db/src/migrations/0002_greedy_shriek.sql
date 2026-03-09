CREATE TABLE "actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"config" jsonb NOT NULL,
	"order" integer NOT NULL,
	"required" boolean DEFAULT false,
	"editable" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
