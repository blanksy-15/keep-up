import type {
  CalendarDate,
  CompletionRecordId,
  DailyTaskId,
  GoalId,
  HabitId,
  RecurringActionId,
  Timestamp,
} from "./shared";

export interface Habit {
  id: HabitId;
  title: string;
  goalId?: GoalId;
  activeFrom?: CalendarDate;
  activeUntil?: CalendarDate;
}

/** A repeated commitment. Its schedule representation remains undecided. */
export interface RecurringAction {
  id: RecurringActionId;
  title: string;
  goalId?: GoalId;
  activeFrom?: CalendarDate;
  activeUntil?: CalendarDate;
}

export interface CompletionRecord {
  id: CompletionRecordId;
  taskId?: DailyTaskId;
  source?: import("./daily-task").DailyTaskSource;
  completedOn: CalendarDate;
  completedAt?: Timestamp;
  note?: string;
}
