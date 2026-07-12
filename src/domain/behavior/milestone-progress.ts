import type { Milestone, MilestoneStatus } from "../goal";
import type { Timestamp } from "../shared";
import { failure, success, type DomainResult } from "./validation";

const transitions: Record<MilestoneStatus, readonly MilestoneStatus[]> = {
  not_started: ["not_started", "in_progress", "completed", "skipped"],
  in_progress: ["in_progress", "completed", "skipped"],
  completed: ["completed"],
  skipped: ["skipped"],
};

export function canTransitionMilestone(currentStatus: MilestoneStatus, nextStatus: MilestoneStatus): boolean {
  return transitions[currentStatus].includes(nextStatus);
}

export function transitionMilestone(
  milestone: Milestone,
  nextStatus: MilestoneStatus,
  timestamp: Timestamp,
): DomainResult<Milestone> {
  if (!canTransitionMilestone(milestone.status, nextStatus)) {
    return failure({ code: "invalid_transition", field: "status", message: `A milestone cannot transition from ${milestone.status} to ${nextStatus}.` });
  }
  if (milestone.status === nextStatus) return success({ ...milestone });

  const transitioned: Milestone = { ...milestone, status: nextStatus, updatedAt: timestamp };
  if (nextStatus === "completed" && !transitioned.completedAt) transitioned.completedAt = timestamp;
  if (nextStatus === "skipped" && !transitioned.skippedAt) transitioned.skippedAt = timestamp;
  return success(transitioned);
}

export interface MilestoneProgress {
  completed: number;
  included: number;
  skipped: number;
  normalizedProgress: number | null;
}

export function calculateMilestoneProgress(milestones: readonly Milestone[]): MilestoneProgress {
  const skipped = milestones.filter((milestone) => milestone.status === "skipped").length;
  const includedMilestones = milestones.filter((milestone) => milestone.status !== "skipped");
  const completed = includedMilestones.filter((milestone) => milestone.status === "completed").length;
  return {
    completed,
    included: includedMilestones.length,
    skipped,
    normalizedProgress: includedMilestones.length === 0 ? null : (completed / includedMilestones.length) * 100,
  };
}
