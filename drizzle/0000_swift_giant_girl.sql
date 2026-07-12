CREATE TYPE "public"."goal_status" AS ENUM('draft', 'active', 'paused', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('not_started', 'in_progress', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."outcome_type" AS ENUM('boolean', 'numeric', 'percentage', 'count');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('draft', 'ready_for_summary', 'summary_proposed', 'finalized');--> statement-breakpoint
CREATE TYPE "public"."season_status" AS ENUM('draft', 'active', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."setup_status" AS ENUM('draft', 'ready_for_review', 'confirmed', 'converted', 'abandoned');--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"season_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "goal_status" NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"activated_at" timestamp with time zone,
	"paused_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"abandoned_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"title" text NOT NULL,
	"status" "milestone_status" NOT NULL,
	"target_date" date,
	"completed_at" timestamp with time zone,
	"skipped_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "outcomes" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"description" text NOT NULL,
	"type" "outcome_type" NOT NULL,
	"target_value" text,
	"unit" text,
	"progress_value" text,
	"progress_note" text,
	"progress_recorded_at" timestamp with time zone,
	CONSTRAINT "outcomes_positive_target" CHECK ("outcomes"."target_value" is null or "outcomes"."target_value"::numeric > 0)
);
--> statement-breakpoint
CREATE TABLE "season_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"season_id" text NOT NULL,
	"status" "review_status" NOT NULL,
	"user_content" jsonb NOT NULL,
	"assistant_proposal" jsonb,
	"approved_summary" text,
	"approved_carry_forward_insights" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"finalized_at" timestamp with time zone,
	CONSTRAINT "season_reviews_season_id_unique" UNIQUE("season_id")
);
--> statement-breakpoint
CREATE TABLE "season_setup_drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "setup_status" NOT NULL,
	"target_season_id" text,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"confirmed_at" timestamp with time zone,
	"converted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"intent_statement" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "season_status" NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"activated_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	CONSTRAINT "seasons_date_range" CHECK ("seasons"."start_date" <= "seasons"."end_date")
);
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcomes" ADD CONSTRAINT "outcomes_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_reviews" ADD CONSTRAINT "season_reviews_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_setup_drafts" ADD CONSTRAINT "season_setup_drafts_target_season_id_seasons_id_fk" FOREIGN KEY ("target_season_id") REFERENCES "public"."seasons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "goals_season_id_idx" ON "goals" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "milestones_goal_id_idx" ON "milestones" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "outcomes_goal_id_idx" ON "outcomes" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "reviews_season_id_idx" ON "season_reviews" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "setup_status_idx" ON "season_setup_drafts" USING btree ("status");