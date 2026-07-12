/** A calendar date in ISO 8601 `YYYY-MM-DD` form. */
export type CalendarDate = string;

/** An ISO 8601 timestamp representing a specific instant. */
export type Timestamp = string;

export type SeasonId = string;
export type GoalId = string;
export type OutcomeId = string;
export type MilestoneId = string;
export type HabitId = string;
export type RecurringActionId = string;
export type ProjectId = string;
export type DailyTaskId = string;
export type CompletionRecordId = string;
export type DailyCheckInId = string;
export type WeeklyScorecardId = string;
export type WeeklyReflectionId = string;
export type SeasonReviewId = string;
export type CarryForwardInsightId = string;

export interface DateRange {
  startDate: CalendarDate;
  endDate: CalendarDate;
}
