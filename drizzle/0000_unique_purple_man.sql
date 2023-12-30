CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image_url" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"status" varchar(255) NOT NULL,
	"date" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "revenue" (
	"month" varchar(4) NOT NULL,
	"revenue" integer NOT NULL,
	CONSTRAINT "revenue_month_unique" UNIQUE("month")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_index" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_index" ON "users" ("name");