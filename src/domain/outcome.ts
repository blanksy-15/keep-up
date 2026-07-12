import type { GoalId, OutcomeId, Timestamp } from "./shared";
import type { AccountOwnerId } from "./identity";

export type OutcomeType = "boolean" | "numeric" | "percentage" | "count";

export interface OutcomeProgress {
  value: number;
  note?: string;
  recordedAt: Timestamp;
}

export interface Outcome {
  ownerId: AccountOwnerId;
  id: OutcomeId;
  goalId: GoalId;
  description: string;
  type: OutcomeType;
  targetValue?: number;
  unit?: string;
  progress?: OutcomeProgress;
}
