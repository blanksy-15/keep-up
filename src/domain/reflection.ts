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
  status: "draft" | "ready_for_summary" | "summary_proposed" | "finalized";
  userContent: {
    highlights: string;
    challenges: string;
    lessons: string;
    nextSeasonConsiderations: string;
  };
  assistantProposal?: SeasonReviewSummaryProposal;
  approvedSummary?: string;
  approvedCarryForwardInsights: CarryForwardInsight[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  finalizedAt?: Timestamp;
}

export interface SeasonReviewSummaryProposal {
  executiveSummary: string;
  observations: string[];
  carryForwardCandidates: { id: string; insight: string }[];
}

export interface CarryForwardInsight {
  id: CarryForwardInsightId;
  seasonId: SeasonId;
  insight: string;
  sourceType: "weekly-reflection" | "season-review";
  sourceId: WeeklyReflectionId | SeasonReviewId;
  approvedAt?: Timestamp;
}
