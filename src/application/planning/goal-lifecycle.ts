import { transitionGoal } from "../../domain/behavior/goal-lifecycle";
import type { Goal, GoalStatus } from "../../domain/goal";
import type { Outcome } from "../../domain/outcome";
import type { GoalId } from "../../domain/shared";
import { applicationFailure, fromPersistence, integrityFailure, mapDomainErrors, type ApplicationResult } from "../errors";
import type { PlanningApplicationDependencies } from "./dependencies";
import { canTransitionGoalWithinSeason } from "./policies";
import { loadGoal, loadGoalSeason } from "./shared";

async function transitionGoalUseCase(
  dependencies: PlanningApplicationDependencies,
  goalId: GoalId,
  nextStatus: GoalStatus,
): Promise<ApplicationResult<Goal>> {
  const loaded = await loadGoal(dependencies, goalId);
  if (!loaded.ok) return loaded;
  const season = await loadGoalSeason(dependencies, loaded.value);
  if (!season.ok) return season;
  if (!canTransitionGoalWithinSeason(season.value)) {
    return applicationFailure({ code: "validation_failed", field: "season.status", message: "Goals cannot change after their season is completed or archived." });
  }

  let outcomes: Outcome[] = [];
  if (nextStatus === "active") {
    const outcomesResult = fromPersistence(await dependencies.persistence.outcomes.listByGoalId(goalId));
    if (!outcomesResult.ok) return outcomesResult;
    if (outcomesResult.value.some((outcome) => outcome.goalId !== goalId)) {
      return integrityFailure("Goal activation loaded an outcome with an inconsistent parent identifier.");
    }
    outcomes = outcomesResult.value;
  }

  const transitioned = transitionGoal(loaded.value, nextStatus, dependencies.clock.now(), outcomes);
  if (!transitioned.ok) return mapDomainErrors(transitioned.errors);
  return fromPersistence(await dependencies.persistence.goals.save(transitioned.value));
}

export function activateGoal(dependencies: PlanningApplicationDependencies, goalId: GoalId) {
  return transitionGoalUseCase(dependencies, goalId, "active");
}

export function pauseGoal(dependencies: PlanningApplicationDependencies, goalId: GoalId) {
  return transitionGoalUseCase(dependencies, goalId, "paused");
}

export function resumeGoal(dependencies: PlanningApplicationDependencies, goalId: GoalId) {
  return transitionGoalUseCase(dependencies, goalId, "active");
}

export function completeGoal(dependencies: PlanningApplicationDependencies, goalId: GoalId) {
  return transitionGoalUseCase(dependencies, goalId, "completed");
}

export function abandonGoal(dependencies: PlanningApplicationDependencies, goalId: GoalId) {
  return transitionGoalUseCase(dependencies, goalId, "abandoned");
}
