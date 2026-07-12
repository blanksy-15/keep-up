import { calculateOutcomeProgress } from "../../domain/behavior/outcome-progress";
import { transitionMilestone } from "../../domain/behavior/milestone-progress";
import type { Goal, Milestone, MilestoneStatus } from "../../domain/goal";
import type { Outcome } from "../../domain/outcome";
import type { Season } from "../../domain/season";
import type { MilestoneId, OutcomeId } from "../../domain/shared";
import { applicationFailure, fromPersistence, integrityFailure, mapDomainErrors, notFound, type ApplicationResult } from "../errors";
import type { ProgressCalculation } from "../../domain/behavior/outcome-progress";
import type { PlanningApplicationDependencies } from "./dependencies";
import { canUpdatePlanningProgress } from "./policies";

export interface UpdateOutcomeProgressInput {
  outcomeId: OutcomeId;
  currentValue: number | boolean;
}

export interface UpdatedOutcomeProgress {
  outcome: Outcome;
  calculation: ProgressCalculation;
}

async function loadProgressParents(
  dependencies: PlanningApplicationDependencies,
  goalId: string,
): Promise<ApplicationResult<{ goal: Goal; season: Season }>> {
  const goalResult = fromPersistence(await dependencies.persistence.goals.findById(goalId));
  if (!goalResult.ok) return goalResult;
  if (!goalResult.value) return integrityFailure("The progress record references a missing parent goal.");
  const seasonResult = fromPersistence(await dependencies.persistence.seasons.findById(goalResult.value.seasonId));
  if (!seasonResult.ok) return seasonResult;
  if (!seasonResult.value) return integrityFailure("The parent goal references a missing season.");
  return { ok: true as const, value: { goal: goalResult.value, season: seasonResult.value } };
}

export async function updateOutcomeProgress(
  dependencies: PlanningApplicationDependencies,
  input: UpdateOutcomeProgressInput,
): Promise<ApplicationResult<UpdatedOutcomeProgress>> {
  const loaded = fromPersistence(await dependencies.persistence.outcomes.findById(input.outcomeId));
  if (!loaded.ok) return loaded;
  if (!loaded.value) return notFound("Outcome", input.outcomeId);

  const parents = await loadProgressParents(dependencies, loaded.value.goalId);
  if (!parents.ok) return parents;
  if (!canUpdatePlanningProgress(parents.value.season, parents.value.goal)) {
    return applicationFailure({ code: "validation_failed", field: "status", message: "Progress can only change for an active goal in an active season." });
  }

  if (loaded.value.type === "boolean" && typeof input.currentValue !== "boolean") {
    return applicationFailure({ code: "validation_failed", field: "currentValue", message: "Boolean outcome progress must be true or false." });
  }
  if (loaded.value.type !== "boolean" && typeof input.currentValue !== "number") {
    return applicationFailure({ code: "validation_failed", field: "currentValue", message: "Numeric outcome progress must be a number." });
  }

  const rawValue = typeof input.currentValue === "boolean" ? (input.currentValue ? 1 : 0) : input.currentValue;
  const timestamp = dependencies.clock.now();
  const updated: Outcome = {
    ...loaded.value,
    progress: {
      value: rawValue,
      ...(loaded.value.progress?.note ? { note: loaded.value.progress.note } : {}),
      recordedAt: timestamp,
    },
  };
  const calculation = calculateOutcomeProgress(updated);
  if (!calculation.ok) return mapDomainErrors(calculation.errors);
  const saved = fromPersistence(await dependencies.persistence.outcomes.save(updated));
  if (!saved.ok) return saved;
  return { ok: true, value: { outcome: saved.value, calculation: calculation.value } };
}

export interface UpdateMilestoneStatusInput {
  milestoneId: MilestoneId;
  status: MilestoneStatus;
}

export async function updateMilestoneStatus(
  dependencies: PlanningApplicationDependencies,
  input: UpdateMilestoneStatusInput,
): Promise<ApplicationResult<Milestone>> {
  const loaded = fromPersistence(await dependencies.persistence.milestones.findById(input.milestoneId));
  if (!loaded.ok) return loaded;
  if (!loaded.value) return notFound("Milestone", input.milestoneId);

  const parents = await loadProgressParents(dependencies, loaded.value.goalId);
  if (!parents.ok) return parents;
  if (!canUpdatePlanningProgress(parents.value.season, parents.value.goal)) {
    return applicationFailure({ code: "validation_failed", field: "status", message: "Milestones can only change for an active goal in an active season." });
  }

  const transitioned = transitionMilestone(loaded.value, input.status, dependencies.clock.now());
  if (!transitioned.ok) return mapDomainErrors(transitioned.errors);
  return fromPersistence(await dependencies.persistence.milestones.save(transitioned.value));
}
