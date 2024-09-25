CREATE TABLE IF NOT EXISTS "flatmates" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"is_busy" boolean DEFAULT false NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_cleaned_date" date,
	"busy_until" date
);
