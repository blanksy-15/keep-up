import { sql } from "drizzle-orm";
import { check, date, index, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const seasonStatus = pgEnum("season_status", ["draft", "active", "completed", "archived"]);
export const goalStatus = pgEnum("goal_status", ["draft", "active", "paused", "completed", "abandoned"]);
export const outcomeType = pgEnum("outcome_type", ["boolean", "numeric", "percentage", "count"]);
export const milestoneStatus = pgEnum("milestone_status", ["not_started", "in_progress", "completed", "skipped"]);
export const setupStatus = pgEnum("setup_status", ["draft", "ready_for_review", "confirmed", "converted", "abandoned"]);
export const reviewStatus = pgEnum("review_status", ["draft", "ready_for_summary", "summary_proposed", "finalized"]);

export const seasons = pgTable("seasons", {
  id: text("id").primaryKey(), name: text("name").notNull(), intentStatement: text("intent_statement"),
  startDate: date("start_date").notNull(), endDate: date("end_date").notNull(), status: seasonStatus("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone:true, mode:"string" }).notNull(), updatedAt: timestamp("updated_at", { withTimezone:true, mode:"string" }).notNull(),
  activatedAt: timestamp("activated_at", { withTimezone:true, mode:"string" }), completedAt: timestamp("completed_at", { withTimezone:true, mode:"string" }), archivedAt: timestamp("archived_at", { withTimezone:true, mode:"string" }),
}, table => [check("seasons_date_range", sql`${table.startDate} <= ${table.endDate}`)]);

export const goals = pgTable("goals", {
  id:text("id").primaryKey(), seasonId:text("season_id").notNull().references(()=>seasons.id,{onDelete:"restrict"}), title:text("title").notNull(), description:text("description"), status:goalStatus("status").notNull(),
  createdAt:timestamp("created_at",{withTimezone:true,mode:"string"}).notNull(), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}).notNull(), activatedAt:timestamp("activated_at",{withTimezone:true,mode:"string"}), pausedAt:timestamp("paused_at",{withTimezone:true,mode:"string"}), completedAt:timestamp("completed_at",{withTimezone:true,mode:"string"}), abandonedAt:timestamp("abandoned_at",{withTimezone:true,mode:"string"}),
}, table=>[index("goals_season_id_idx").on(table.seasonId)]);

export const outcomes = pgTable("outcomes", {
  id:text("id").primaryKey(), goalId:text("goal_id").notNull().references(()=>goals.id,{onDelete:"restrict"}), description:text("description").notNull(), type:outcomeType("type").notNull(), targetValue:text("target_value"), unit:text("unit"), progressValue:text("progress_value"), progressNote:text("progress_note"), progressRecordedAt:timestamp("progress_recorded_at",{withTimezone:true,mode:"string"}),
}, table=>[index("outcomes_goal_id_idx").on(table.goalId),check("outcomes_positive_target",sql`${table.targetValue} is null or ${table.targetValue}::numeric > 0`)]);

export const milestones = pgTable("milestones", {
  id:text("id").primaryKey(), goalId:text("goal_id").notNull().references(()=>goals.id,{onDelete:"restrict"}), title:text("title").notNull(), status:milestoneStatus("status").notNull(), targetDate:date("target_date"), completedAt:timestamp("completed_at",{withTimezone:true,mode:"string"}), skippedAt:timestamp("skipped_at",{withTimezone:true,mode:"string"}), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}),
}, table=>[index("milestones_goal_id_idx").on(table.goalId)]);

export const seasonSetupDrafts = pgTable("season_setup_drafts", {
  id:text("id").primaryKey(), status:setupStatus("status").notNull(), targetSeasonId:text("target_season_id").references(()=>seasons.id,{onDelete:"restrict"}), content:jsonb("content").notNull(), createdAt:timestamp("created_at",{withTimezone:true,mode:"string"}).notNull(), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}).notNull(), confirmedAt:timestamp("confirmed_at",{withTimezone:true,mode:"string"}), convertedAt:timestamp("converted_at",{withTimezone:true,mode:"string"}),
}, table=>[index("setup_status_idx").on(table.status)]);

export const seasonReviews = pgTable("season_reviews", {
  id:text("id").primaryKey(), seasonId:text("season_id").notNull().references(()=>seasons.id,{onDelete:"restrict"}).unique(), status:reviewStatus("status").notNull(), userContent:jsonb("user_content").notNull(), assistantProposal:jsonb("assistant_proposal"), approvedSummary:text("approved_summary"), approvedCarryForwardInsights:jsonb("approved_carry_forward_insights").notNull(), createdAt:timestamp("created_at",{withTimezone:true,mode:"string"}).notNull(), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}).notNull(), finalizedAt:timestamp("finalized_at",{withTimezone:true,mode:"string"}),
}, table=>[index("reviews_season_id_idx").on(table.seasonId)]);
