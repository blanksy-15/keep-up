import { summarizeGoal, summarizeSeason, type GoalSummary, type SeasonSummary } from "../../domain/behavior/season-summary";
import type { Goal, Milestone } from "../../domain/goal";
import type { Outcome } from "../../domain/outcome";
import type { Season } from "../../domain/season";
import type { SeasonId } from "../../domain/shared";
import { fromPersistence, integrityFailure, mapDomainErrors, type ApplicationResult } from "../errors";
import type { PlanningApplicationDependencies } from "./dependencies";
import { loadSeason } from "./shared";

export interface SeasonOverviewGoal {
  goal: Goal;
  outcomes: Outcome[];
  milestones: Milestone[];
  summary: GoalSummary;
}

export interface SeasonOverview {
  season: Season;
  goals: SeasonOverviewGoal[];
  summary: SeasonSummary;
}

export async function getSeasonOverview(
  dependencies: PlanningApplicationDependencies,
  seasonId: SeasonId,
): Promise<ApplicationResult<SeasonOverview>> {
  const season = await loadSeason(dependencies, seasonId);
  if (!season.ok) return season;
  const goalsResult = fromPersistence(await dependencies.persistence.goals.listBySeasonId(seasonId));
  if (!goalsResult.ok) return goalsResult;
  if (goalsResult.value.some((goal) => goal.seasonId !== seasonId)) {
    return integrityFailure("Season overview contains a goal with an inconsistent parent identifier.");
  }

  const overviewGoals: SeasonOverviewGoal[] = [];
  const summaryInputs = [];
  for (const goal of goalsResult.value) {
    const outcomesResult = fromPersistence(await dependencies.persistence.outcomes.listByGoalId(goal.id));
    if (!outcomesResult.ok) return outcomesResult;
    const milestonesResult = fromPersistence(await dependencies.persistence.milestones.listByGoalId(goal.id));
    if (!milestonesResult.ok) return milestonesResult;
    if (outcomesResult.value.some((outcome) => outcome.goalId !== goal.id) ||
        milestonesResult.value.some((milestone) => milestone.goalId !== goal.id)) {
      return integrityFailure("Season overview contains a child record with an inconsistent parent identifier.");
    }
    const input = { goal, outcomes: outcomesResult.value, milestones: milestonesResult.value };
    const summary = summarizeGoal(input);
    if (!summary.ok) return mapDomainErrors(summary.errors);
    summaryInputs.push(input);
    overviewGoals.push({ ...input, summary: summary.value });
  }

  const seasonSummary = summarizeSeason(season.value, summaryInputs);
  if (!seasonSummary.ok) return mapDomainErrors(seasonSummary.errors);
  return { ok: true, value: { season: season.value, goals: overviewGoals, summary: seasonSummary.value } };
}
