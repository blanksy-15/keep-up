CREATE TABLE "auth_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "auth_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth_verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
TRUNCATE TABLE "season_reviews", "season_setup_drafts", "milestones", "outcomes", "goals", "seasons";
--> statement-breakpoint
DROP INDEX "goals_season_id_idx";--> statement-breakpoint
DROP INDEX "milestones_goal_id_idx";--> statement-breakpoint
DROP INDEX "outcomes_goal_id_idx";--> statement-breakpoint
DROP INDEX "reviews_season_id_idx";--> statement-breakpoint
DROP INDEX "setup_status_idx";--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "milestones" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "outcomes" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "season_reviews" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "season_setup_drafts" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "seasons" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_accounts_user_idx" ON "auth_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_sessions_user_idx" ON "auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_verifications_identifier_idx" ON "auth_verifications" USING btree ("identifier");--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_owner_id_auth_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."auth_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_owner_id_auth_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."auth_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcomes" ADD CONSTRAINT "outcomes_owner_id_auth_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."auth_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_reviews" ADD CONSTRAINT "season_reviews_owner_id_auth_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."auth_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_setup_drafts" ADD CONSTRAINT "season_setup_drafts_owner_id_auth_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."auth_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_owner_id_auth_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."auth_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "goals_owner_season_idx" ON "goals" USING btree ("owner_id","season_id");--> statement-breakpoint
CREATE INDEX "milestones_owner_goal_idx" ON "milestones" USING btree ("owner_id","goal_id");--> statement-breakpoint
CREATE INDEX "outcomes_owner_goal_idx" ON "outcomes" USING btree ("owner_id","goal_id");--> statement-breakpoint
CREATE INDEX "reviews_owner_season_idx" ON "season_reviews" USING btree ("owner_id","season_id");--> statement-breakpoint
CREATE INDEX "setup_owner_status_idx" ON "season_setup_drafts" USING btree ("owner_id","status");--> statement-breakpoint
CREATE INDEX "seasons_owner_idx" ON "seasons" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "seasons_owner_id_unique" ON "seasons" USING btree ("owner_id","id");
