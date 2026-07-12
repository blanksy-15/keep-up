import { transitionSeason } from "../../domain/behavior/season-lifecycle";
import type { Season, SeasonStatus } from "../../domain/season";
import type { Outcome } from "../../domain/outcome";
import type { SeasonId } from "../../domain/shared";
import { fromPersistence, integrityFailure, mapDomainErrors, type ApplicationResult } from "../errors";
import type { PlanningApplicationDependencies } from "./dependencies";
import { loadSeason } from "./shared";

export async function activateSeason(
  dependencies: PlanningApplicationDependencies,
  seasonId: SeasonId,
): Promise<ApplicationResult<Season>> {
  const loaded = await loadSeason(dependencies, seasonId);
  if (!loaded.ok) return loaded;

  const goalsResult = fromPersistence(await dependencies.persistence.goals.listBySeasonId(seasonId));
  if (!goalsResult.ok) return goalsResult;
  if (goalsResult.value.some((goal) => goal.seasonId !== seasonId)) {
    return integrityFailure("Season activation loaded a goal with an inconsistent parent identifier.");
  }

  const outcomesByGoal: Record<string, readonly Outcome[]> = {};
  for (const goal of goalsResult.value) {
    const outcomesResult = fromPersistence(await dependencies.persistence.outcomes.listByGoalId(goal.id));
    if (!outcomesResult.ok) return outcomesResult;
    if (outcomesResult.value.some((outcome) => outcome.goalId !== goal.id)) {
      return integrityFailure("Season activation loaded an outcome with an inconsistent parent identifier.");
    }
    outcomesByGoal[goal.id] = outcomesResult.value;
  }

  const transitioned = transitionSeason(loaded.value, "active", dependencies.clock.now(), {
    goals: goalsResult.value,
    outcomesByGoal,
  });
  if (!transitioned.ok) return mapDomainErrors(transitioned.errors);
  return fromPersistence(await dependencies.persistence.seasons.save(transitioned.value));
}

async function transitionSeasonUseCase(
  dependencies: PlanningApplicationDependencies,
  seasonId: SeasonId,
  nextStatus: SeasonStatus,
): Promise<ApplicationResult<Season>> {
  const loaded = await loadSeason(dependencies, seasonId);
  if (!loaded.ok) return loaded;
  const transitioned = transitionSeason(loaded.value, nextStatus, dependencies.clock.now());
  if (!transitioned.ok) return mapDomainErrors(transitioned.errors);
  return fromPersistence(await dependencies.persistence.seasons.save(transitioned.value));
}

export function completeSeason(dependencies: PlanningApplicationDependencies, seasonId: SeasonId) {
  return transitionSeasonUseCase(dependencies, seasonId, "completed");
}

export function archiveSeason(dependencies: PlanningApplicationDependencies, seasonId: SeasonId) {
  return transitionSeasonUseCase(dependencies, seasonId, "archived");
}
