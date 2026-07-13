import type { Goal, GoalStatus, Milestone } from "../goal";
import type { Outcome } from "../outcome";
import type { Season, SeasonStatus } from "../season";
import { calculateMilestoneProgress, type MilestoneProgress } from "./milestone-progress";
import { calculateOutcomeProgress } from "./outcome-progress";
import { success, type DomainError, type DomainResult } from "./validation";

export interface GoalSummary {
  status: GoalStatus;
  outcomeCount: number;
  completedOutcomeCount: number;
  averageOutcomeProgress: number | null;
  milestoneProgress: MilestoneProgress;
}

export interface GoalSummaryInput {
  goal: Goal;
  outcomes: readonly Outcome[];
  milestones?: readonly Milestone[];
}

export function summarizeGoal(input: GoalSummaryInput): DomainResult<GoalSummary> {
  const progress = input.outcomes.map((outcome) => calculateOutcomeProgress(outcome));
  const errors = progress.flatMap((result, index) =>
    result.ok || !input.outcomes[index]?.progress ? [] : result.errors,
  );
  if (errors.length > 0) return { ok: false, errors };

  const values = progress.flatMap((result) => (result.ok ? [result.value] : []));
  const averageOutcomeProgress = values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value.normalizedProgress, 0) / values.length;

  return success({
    status: input.goal.status,
    outcomeCount: input.outcomes.length,
    completedOutcomeCount: values.filter((value) => value.isComplete).length,
    averageOutcomeProgress,
    milestoneProgress: calculateMilestoneProgress(input.milestones ?? []),
  });
}

export interface SeasonSummary {
  status: SeasonStatus;
  goalCount: number;
  draftGoalCount: number;
  activeGoalCount: number;
  pausedGoalCount: number;
  completedGoalCount: number;
  abandonedGoalCount: number;
  outcomeCount: number;
  completedOutcomeCount: number;
  averageGoalProgress: number | null;
}

export function summarizeSeason(
  season: Season,
  inputs: readonly GoalSummaryInput[],
): DomainResult<SeasonSummary> {
  const summaries: GoalSummary[] = [];
  const errors: DomainError[] = [];
  for (const input of inputs) {
    const result = summarizeGoal(input);
    if (result.ok) summaries.push(result.value);
    else errors.push(...result.errors);
  }
  if (errors.length > 0) return { ok: false, errors };

  const count = (status: GoalStatus) => inputs.filter((input) => input.goal.status === status).length;
  const includedForAverage = summaries.filter((summary) =>
    summary.status !== "draft" && summary.status !== "abandoned" && summary.averageOutcomeProgress !== null,
  );
  const averageGoalProgress = includedForAverage.length === 0
    ? null
    : includedForAverage.reduce((sum, summary) => sum + (summary.averageOutcomeProgress ?? 0), 0) / includedForAverage.length;

  return success({
    status: season.status,
    goalCount: inputs.length,
    draftGoalCount: count("draft"),
    activeGoalCount: count("active"),
    pausedGoalCount: count("paused"),
    completedGoalCount: count("completed"),
    abandonedGoalCount: count("abandoned"),
    outcomeCount: summaries.reduce((sum, summary) => sum + summary.outcomeCount, 0),
    completedOutcomeCount: summaries.reduce((sum, summary) => sum + summary.completedOutcomeCount, 0),
    averageGoalProgress,
  });
}
