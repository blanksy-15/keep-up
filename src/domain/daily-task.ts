import type {
  CalendarDate,
  DailyTaskId,
  GoalId,
  HabitId,
  MilestoneId,
  OutcomeId,
  ProjectId,
  RecurringActionId,
  Timestamp,
} from "./shared";

export type DailyTaskStatus = "pending" | "completed" | "deferred" | "dismissed";

export type DailyTaskSourceType =
  | "goal"
  | "outcome"
  | "milestone"
  | "habit"
  | "recurring-action"
  | "project"
  | "manual";

export type DailyTaskSource =
  | { type: "goal"; id: GoalId }
  | { type: "outcome"; id: OutcomeId }
  | { type: "milestone"; id: MilestoneId }
  | { type: "habit"; id: HabitId }
  | { type: "recurring-action"; id: RecurringActionId }
  | { type: "project"; id: ProjectId }
  | { type: "manual" };

/**
 * A unit of work presented for a calendar date. This contract intentionally
 * does not decide whether tasks are stored, generated, or both.
 */
export interface DailyTask {
  id?: DailyTaskId;
  title: string;
  scheduledFor: CalendarDate;
  status: DailyTaskStatus;
  source?: DailyTaskSource;
  completedAt?: Timestamp;
}
