DROP TABLE "scope" CASCADE;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "startDate" date NOT NULL DEFAULT CURRENT_DATE;