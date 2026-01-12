CREATE TYPE "public"."learningEnum" AS ENUM('インプット先行パターン', 'アウトプット先行パターン');--> statement-breakpoint
CREATE TYPE "public"."baseMaterial" AS ENUM('TEXTBOOK', 'VIDEO');--> statement-breakpoint
CREATE TYPE "public"."taskStatus" AS ENUM('undo', 'doing', 'done', 'blocked');--> statement-breakpoint
CREATE TABLE "persona" (
	"personaId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekdayHours" numeric(3, 1) NOT NULL,
	"weekendHours" numeric(3, 1) NOT NULL,
	"learningEnum" "learningEnum" DEFAULT 'インプット先行パターン' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"projectId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"personaId" uuid NOT NULL,
	"certificationName" varchar NOT NULL,
	"examDate" date NOT NULL,
	"baseMaterial" "baseMaterial" DEFAULT 'TEXTBOOK' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scope" (
	"scopeId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"scope" varchar NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "step" (
	"stepId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"title" varchar NOT NULL,
	"theme" text NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"taskId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stepId" uuid NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"taskStatus" "taskStatus" DEFAULT 'undo' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weight" (
	"weightId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"area" varchar NOT NULL,
	"weightPercent" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_personaId_persona_personaId_fk" FOREIGN KEY ("personaId") REFERENCES "public"."persona"("personaId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scope" ADD CONSTRAINT "scope_projectId_project_projectId_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("projectId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step" ADD CONSTRAINT "step_projectId_project_projectId_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("projectId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_stepId_step_stepId_fk" FOREIGN KEY ("stepId") REFERENCES "public"."step"("stepId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weight" ADD CONSTRAINT "weight_projectId_project_projectId_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("projectId") ON DELETE no action ON UPDATE no action;