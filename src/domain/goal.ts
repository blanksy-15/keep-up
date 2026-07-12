import type {
  CalendarDate,
  GoalId,
  MilestoneId,
  ProjectId,
  SeasonId,
  Timestamp,
} from "./shared";

export type GoalStatus = "planned" | "active" | "completed" | "paused" | "cancelled";

export interface Goal {
  id: GoalId;
  seasonId: SeasonId;
  title: string;
  description?: string;
  status: GoalStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Milestone {
  id: MilestoneId;
  goalId: GoalId;
  title: string;
  targetDate?: CalendarDate;
  completedAt?: Timestamp;
}

/** A coordinated body of work. Whether projects remain distinct from goals is undecided. */
export interface Project {
  id: ProjectId;
  title: string;
  description?: string;
  goalId?: GoalId;
  status: "planned" | "active" | "completed" | "paused" | "cancelled";
}
