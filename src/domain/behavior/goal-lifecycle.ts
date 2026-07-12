import type { Goal, GoalStatus } from "../goal";
import type { Outcome } from "../outcome";
import type { Timestamp } from "../shared";
import { failure, success, validateGoalActivation, type DomainResult } from "./validation";

const transitions: Record<GoalStatus, readonly GoalStatus[]> = {
  draft: ["draft", "active", "abandoned"],
  active: ["active", "paused", "completed", "abandoned"],
  paused: ["paused", "active", "abandoned"],
  completed: ["completed"],
  abandoned: ["abandoned"],
};

export function canTransitionGoal(currentStatus: GoalStatus, nextStatus: GoalStatus): boolean {
  return transitions[currentStatus].includes(nextStatus);
}

export function transitionGoal(
  goal: Goal,
  nextStatus: GoalStatus,
  timestamp: Timestamp,
  outcomes: readonly Outcome[] = [],
): DomainResult<Goal> {
  if (!canTransitionGoal(goal.status, nextStatus)) {
    return failure({ code: "invalid_transition", field: "status", message: `A goal cannot transition from ${goal.status} to ${nextStatus}.` });
  }
  if (goal.status === nextStatus) return success({ ...goal });

  if (nextStatus === "active") {
    const validation = validateGoalActivation(goal, outcomes);
    if (!validation.ok) return validation;
  }

  const transitioned: Goal = { ...goal, status: nextStatus, updatedAt: timestamp };
  if (nextStatus === "active" && !transitioned.activatedAt) transitioned.activatedAt = timestamp;
  if (nextStatus === "paused") transitioned.pausedAt = timestamp;
  if (nextStatus === "completed" && !transitioned.completedAt) transitioned.completedAt = timestamp;
  if (nextStatus === "abandoned" && !transitioned.abandonedAt) transitioned.abandonedAt = timestamp;

  return success(transitioned);
}
