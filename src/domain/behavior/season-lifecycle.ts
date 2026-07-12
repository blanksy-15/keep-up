import type { Season, SeasonStatus } from "../season";
import type { Timestamp } from "../shared";
import { failure, success, validateSeasonActivation, type DomainResult, type SeasonActivationContext } from "./validation";

const transitions: Record<SeasonStatus, readonly SeasonStatus[]> = {
  draft: ["draft", "active", "archived"],
  active: ["active", "completed", "archived"],
  completed: ["completed", "archived"],
  archived: ["archived"],
};

export function canTransitionSeason(currentStatus: SeasonStatus, nextStatus: SeasonStatus): boolean {
  return transitions[currentStatus].includes(nextStatus);
}

export function transitionSeason(
  season: Season,
  nextStatus: SeasonStatus,
  timestamp: Timestamp,
  activationContext?: SeasonActivationContext,
): DomainResult<Season> {
  if (!canTransitionSeason(season.status, nextStatus)) {
    return failure({
      code: "invalid_transition",
      field: "status",
      message: `A season cannot transition from ${season.status} to ${nextStatus}.`,
    });
  }

  if (season.status === nextStatus) {
    return success({ ...season });
  }

  if (nextStatus === "active") {
    if (!activationContext) {
      return failure({ code: "validation_failed", field: "activation", message: "Season activation context is required." });
    }
    const validation = validateSeasonActivation(season, activationContext);
    if (!validation.ok) return validation;
  }

  const transitioned: Season = { ...season, status: nextStatus, updatedAt: timestamp };
  if (nextStatus === "active" && !transitioned.activatedAt) transitioned.activatedAt = timestamp;
  if (nextStatus === "completed" && !transitioned.completedAt) transitioned.completedAt = timestamp;
  if (nextStatus === "archived" && !transitioned.archivedAt) transitioned.archivedAt = timestamp;

  return success(transitioned);
}
