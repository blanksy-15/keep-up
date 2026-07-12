import { sql } from "drizzle-orm";
import { boolean, check, date, index, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const seasonStatus = pgEnum("season_status", ["draft", "active", "completed", "archived"]);
export const goalStatus = pgEnum("goal_status", ["draft", "active", "paused", "completed", "abandoned"]);
export const outcomeType = pgEnum("outcome_type", ["boolean", "numeric", "percentage", "count"]);
export const milestoneStatus = pgEnum("milestone_status", ["not_started", "in_progress", "completed", "skipped"]);
export const setupStatus = pgEnum("setup_status", ["draft", "ready_for_review", "confirmed", "converted", "abandoned"]);
export const reviewStatus = pgEnum("review_status", ["draft", "ready_for_summary", "summary_proposed", "finalized"]);

export const user=pgTable("auth_users",{id:text("id").primaryKey(),name:text("name").notNull(),email:text("email").notNull().unique(),emailVerified:boolean("email_verified").notNull().default(false),image:text("image"),createdAt:timestamp("created_at",{withTimezone:true,mode:"date"}).notNull(),updatedAt:timestamp("updated_at",{withTimezone:true,mode:"date"}).notNull()});
export const session=pgTable("auth_sessions",{id:text("id").primaryKey(),expiresAt:timestamp("expires_at",{withTimezone:true,mode:"date"}).notNull(),token:text("token").notNull().unique(),createdAt:timestamp("created_at",{withTimezone:true,mode:"date"}).notNull(),updatedAt:timestamp("updated_at",{withTimezone:true,mode:"date"}).notNull(),ipAddress:text("ip_address"),userAgent:text("user_agent"),userId:text("user_id").notNull().references(()=>user.id,{onDelete:"cascade"})},t=>[index("auth_sessions_user_idx").on(t.userId)]);
export const account=pgTable("auth_accounts",{id:text("id").primaryKey(),accountId:text("account_id").notNull(),providerId:text("provider_id").notNull(),userId:text("user_id").notNull().references(()=>user.id,{onDelete:"cascade"}),accessToken:text("access_token"),refreshToken:text("refresh_token"),idToken:text("id_token"),accessTokenExpiresAt:timestamp("access_token_expires_at",{withTimezone:true,mode:"date"}),refreshTokenExpiresAt:timestamp("refresh_token_expires_at",{withTimezone:true,mode:"date"}),scope:text("scope"),password:text("password"),createdAt:timestamp("created_at",{withTimezone:true,mode:"date"}).notNull(),updatedAt:timestamp("updated_at",{withTimezone:true,mode:"date"}).notNull()},t=>[index("auth_accounts_user_idx").on(t.userId)]);
export const verification=pgTable("auth_verifications",{id:text("id").primaryKey(),identifier:text("identifier").notNull(),value:text("value").notNull(),expiresAt:timestamp("expires_at",{withTimezone:true,mode:"date"}).notNull(),createdAt:timestamp("created_at",{withTimezone:true,mode:"date"}),updatedAt:timestamp("updated_at",{withTimezone:true,mode:"date"})},t=>[index("auth_verifications_identifier_idx").on(t.identifier)]);

export const seasons = pgTable("seasons", {
  id: text("id").primaryKey(), ownerId:text("owner_id").notNull().references(()=>user.id,{onDelete:"restrict"}), name: text("name").notNull(), intentStatement: text("intent_statement"),
  startDate: date("start_date").notNull(), endDate: date("end_date").notNull(), status: seasonStatus("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone:true, mode:"string" }).notNull(), updatedAt: timestamp("updated_at", { withTimezone:true, mode:"string" }).notNull(),
  activatedAt: timestamp("activated_at", { withTimezone:true, mode:"string" }), completedAt: timestamp("completed_at", { withTimezone:true, mode:"string" }), archivedAt: timestamp("archived_at", { withTimezone:true, mode:"string" }),
}, table => [check("seasons_date_range", sql`${table.startDate} <= ${table.endDate}`),index("seasons_owner_idx").on(table.ownerId),uniqueIndex("seasons_owner_id_unique").on(table.ownerId,table.id)]);

export const goals = pgTable("goals", {
  id:text("id").primaryKey(), ownerId:text("owner_id").notNull().references(()=>user.id,{onDelete:"restrict"}), seasonId:text("season_id").notNull().references(()=>seasons.id,{onDelete:"restrict"}), title:text("title").notNull(), description:text("description"), status:goalStatus("status").notNull(),
  createdAt:timestamp("created_at",{withTimezone:true,mode:"string"}).notNull(), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}).notNull(), activatedAt:timestamp("activated_at",{withTimezone:true,mode:"string"}), pausedAt:timestamp("paused_at",{withTimezone:true,mode:"string"}), completedAt:timestamp("completed_at",{withTimezone:true,mode:"string"}), abandonedAt:timestamp("abandoned_at",{withTimezone:true,mode:"string"}),
}, table=>[index("goals_owner_season_idx").on(table.ownerId,table.seasonId)]);

export const outcomes = pgTable("outcomes", {
  id:text("id").primaryKey(), ownerId:text("owner_id").notNull().references(()=>user.id,{onDelete:"restrict"}), goalId:text("goal_id").notNull().references(()=>goals.id,{onDelete:"restrict"}), description:text("description").notNull(), type:outcomeType("type").notNull(), targetValue:text("target_value"), unit:text("unit"), progressValue:text("progress_value"), progressNote:text("progress_note"), progressRecordedAt:timestamp("progress_recorded_at",{withTimezone:true,mode:"string"}),
}, table=>[index("outcomes_owner_goal_idx").on(table.ownerId,table.goalId),check("outcomes_positive_target",sql`${table.targetValue} is null or ${table.targetValue}::numeric > 0`)]);

export const milestones = pgTable("milestones", {
  id:text("id").primaryKey(), ownerId:text("owner_id").notNull().references(()=>user.id,{onDelete:"restrict"}), goalId:text("goal_id").notNull().references(()=>goals.id,{onDelete:"restrict"}), title:text("title").notNull(), status:milestoneStatus("status").notNull(), targetDate:date("target_date"), completedAt:timestamp("completed_at",{withTimezone:true,mode:"string"}), skippedAt:timestamp("skipped_at",{withTimezone:true,mode:"string"}), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}),
}, table=>[index("milestones_owner_goal_idx").on(table.ownerId,table.goalId)]);

export const seasonSetupDrafts = pgTable("season_setup_drafts", {
  id:text("id").primaryKey(), ownerId:text("owner_id").notNull().references(()=>user.id,{onDelete:"restrict"}), status:setupStatus("status").notNull(), targetSeasonId:text("target_season_id").references(()=>seasons.id,{onDelete:"restrict"}), content:jsonb("content").notNull(), createdAt:timestamp("created_at",{withTimezone:true,mode:"string"}).notNull(), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}).notNull(), confirmedAt:timestamp("confirmed_at",{withTimezone:true,mode:"string"}), convertedAt:timestamp("converted_at",{withTimezone:true,mode:"string"}),
}, table=>[index("setup_owner_status_idx").on(table.ownerId,table.status)]);

export const seasonReviews = pgTable("season_reviews", {
  id:text("id").primaryKey(), ownerId:text("owner_id").notNull().references(()=>user.id,{onDelete:"restrict"}), seasonId:text("season_id").notNull().references(()=>seasons.id,{onDelete:"restrict"}).unique(), status:reviewStatus("status").notNull(), userContent:jsonb("user_content").notNull(), assistantProposal:jsonb("assistant_proposal"), approvedSummary:text("approved_summary"), approvedCarryForwardInsights:jsonb("approved_carry_forward_insights").notNull(), createdAt:timestamp("created_at",{withTimezone:true,mode:"string"}).notNull(), updatedAt:timestamp("updated_at",{withTimezone:true,mode:"string"}).notNull(), finalizedAt:timestamp("finalized_at",{withTimezone:true,mode:"string"}),
}, table=>[index("reviews_owner_season_idx").on(table.ownerId,table.seasonId)]);
