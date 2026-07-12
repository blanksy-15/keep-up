import type { Goal } from "../../domain/goal";
import type { Season } from "../../domain/season";
import type { PlanningApplicationDependencies } from "./dependencies";
import { fromPersistence, integrityFailure, notFound, type ApplicationResult } from "../errors";

export async function loadSeason(
  dependencies: PlanningApplicationDependencies,
  seasonId: string,
): Promise<ApplicationResult<Season>> {
  const result = fromPersistence(await dependencies.persistence.seasons.findById(seasonId));
  if (!result.ok) return result;
  return result.value ? { ok: true, value: result.value } : notFound("Season", seasonId);
}

export async function loadGoal(
  dependencies: PlanningApplicationDependencies,
  goalId: string,
): Promise<ApplicationResult<Goal>> {
  const result = fromPersistence(await dependencies.persistence.goals.findById(goalId));
  if (!result.ok) return result;
  return result.value ? { ok: true, value: result.value } : notFound("Goal", goalId);
}

export async function loadGoalSeason(
  dependencies: PlanningApplicationDependencies,
  goal: Goal,
): Promise<ApplicationResult<Season>> {
  const result = fromPersistence(await dependencies.persistence.seasons.findById(goal.seasonId));
  if (!result.ok) return result;
  return result.value
    ? { ok: true, value: result.value }
    : integrityFailure(`Goal ${goal.id} references a missing parent season.`);
}
