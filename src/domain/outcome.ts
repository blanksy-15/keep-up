import type { GoalId, OutcomeId, Timestamp } from "./shared";

export type OutcomeType = "binary" | "numeric" | "percentage" | "descriptive";

export interface OutcomeProgress {
  value?: number;
  note?: string;
  recordedAt: Timestamp;
}

export interface Outcome {
  id: OutcomeId;
  goalId: GoalId;
  description: string;
  type: OutcomeType;
  targetValue?: number;
  unit?: string;
  progress?: OutcomeProgress;
}
