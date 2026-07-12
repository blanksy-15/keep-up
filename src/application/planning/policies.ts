import type { Goal } from "../../domain/goal";
import type { Season } from "../../domain/season";

export function canAddGoalToSeason(season: Season): boolean {
  return season.status === "draft" || season.status === "active";
}

export function canTransitionGoalWithinSeason(season: Season): boolean {
  return season.status === "draft" || season.status === "active";
}

export function canUpdatePlanningProgress(season: Season, goal: Goal): boolean {
  return season.status === "active" && goal.status === "active";
}
