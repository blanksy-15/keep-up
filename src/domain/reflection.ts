import type {
  CalendarDate,
  CarryForwardInsightId,
  SeasonId,
  SeasonReviewId,
  Timestamp,
  WeeklyReflectionId,
  WeeklyScorecardId,
} from "./shared";

export interface WeeklyScorecard {
  id: WeeklyScorecardId;
  seasonId: SeasonId;
  weekStartDate: CalendarDate;
  weekEndDate: CalendarDate;
  summary?: string;
  createdAt: Timestamp;
}

export interface WeeklyReflection {
  id: WeeklyReflectionId;
  seasonId: SeasonId;
  weekStartDate: CalendarDate;
  weekEndDate: CalendarDate;
  reflection: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SeasonReview {
  id: SeasonReviewId;
  seasonId: SeasonId;
  summary: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CarryForwardInsight {
  id: CarryForwardInsightId;
  seasonId: SeasonId;
  insight: string;
  sourceType: "weekly-reflection" | "season-review";
  sourceId: WeeklyReflectionId | SeasonReviewId;
}
