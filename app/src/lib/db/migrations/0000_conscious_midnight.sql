CREATE TABLE "persona" (
	"persona_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekday_hours" numeric(4, 1) NOT NULL,
	"weekend_hours" numeric(4, 1) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
