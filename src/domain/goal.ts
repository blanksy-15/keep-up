import type {
  CalendarDate,
  GoalId,
  MilestoneId,
  ProjectId,
  SeasonId,
  Timestamp,
} from "./shared";
import type { AccountOwnerId } from "./identity";

export type GoalStatus = "draft" | "active" | "paused" | "completed" | "abandoned";

export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "skipped";

export interface Goal {
  ownerId: AccountOwnerId;
  id: GoalId;
  seasonId: SeasonId;
  title: string;
  description?: string;
  status: GoalStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  activatedAt?: Timestamp;
  pausedAt?: Timestamp;
  completedAt?: Timestamp;
  abandonedAt?: Timestamp;
}

export interface Milestone {
  ownerId: AccountOwnerId;
  id: MilestoneId;
  goalId: GoalId;
  title: string;
  status: MilestoneStatus;
  targetDate?: CalendarDate;
  completedAt?: Timestamp;
  skippedAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** A coordinated body of work. Whether projects remain distinct from goals is undecided. */
export interface Project {
  id: ProjectId;
  title: string;
  description?: string;
  goalId?: GoalId;
  status: "planned" | "active" | "completed" | "paused" | "cancelled";
}
