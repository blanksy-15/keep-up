import type { Goal } from "../goal";
import type { Outcome } from "../outcome";
import type { Season } from "../season";

export type DomainErrorCode =
  | "invalid_transition"
  | "validation_failed"
  | "invalid_progress_value";

export interface DomainError {
  code: DomainErrorCode;
  message: string;
  field?: string;
}

export type DomainResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: DomainError[] };

export function success<T>(value: T): DomainResult<T> {
  return { ok: true, value };
}

export function failure<T>(...errors: DomainError[]): DomainResult<T> {
  return { ok: false, errors };
}

function required(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function validCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateGoalActivation(
  goal: Goal,
  outcomes: readonly Outcome[],
): DomainResult<Goal> {
  const errors: DomainError[] = [];

  if (!required(goal.title)) {
    errors.push({ code: "validation_failed", field: "title", message: "A goal title is required." });
  }
  if (!required(goal.description)) {
    errors.push({ code: "validation_failed", field: "description", message: "A goal description or intent is required." });
  }
  if (outcomes.length === 0) {
    errors.push({ code: "validation_failed", field: "outcomes", message: "At least one measurable outcome is required." });
  }
  for (const outcome of outcomes) {
    if (outcome.goalId !== goal.id) {
      errors.push({ code: "validation_failed", field: `outcomes.${outcome.id}.goalId`, message: "An outcome must belong to the goal being activated." });
    }
    if ((outcome.type === "numeric" || outcome.type === "count") &&
        (!Number.isFinite(outcome.targetValue) || (outcome.targetValue ?? 0) <= 0)) {
      errors.push({
        code: "validation_failed",
        field: `outcomes.${outcome.id}.targetValue`,
        message: `${outcome.type === "count" ? "Count" : "Numeric"} outcomes require a target greater than zero.`,
      });
    }
    if (outcome.type === "count" && !Number.isInteger(outcome.targetValue)) {
      errors.push({
        code: "validation_failed",
        field: `outcomes.${outcome.id}.targetValue`,
        message: "Count outcome targets must be whole numbers.",
      });
    }
  }

  return errors.length > 0 ? { ok: false, errors } : success(goal);
}

export interface SeasonActivationContext {
  goals: readonly Goal[];
  outcomesByGoal: Readonly<Record<string, readonly Outcome[]>>;
}

export function validateSeasonActivation(
  season: Season,
  context: SeasonActivationContext,
): DomainResult<Season> {
  const errors: DomainError[] = [];

  if (!required(season.name)) {
    errors.push({ code: "validation_failed", field: "name", message: "A season title is required." });
  }
  if (!required(season.dates.startDate)) {
    errors.push({ code: "validation_failed", field: "startDate", message: "A season start date is required." });
  } else if (!validCalendarDate(season.dates.startDate)) {
    errors.push({ code: "validation_failed", field: "startDate", message: "The season start date must be a valid calendar date." });
  }
  if (!required(season.dates.endDate)) {
    errors.push({ code: "validation_failed", field: "endDate", message: "A season end date is required." });
  } else if (!validCalendarDate(season.dates.endDate)) {
    errors.push({ code: "validation_failed", field: "endDate", message: "The season end date must be a valid calendar date." });
  }
  if (validCalendarDate(season.dates.startDate) && validCalendarDate(season.dates.endDate) && season.dates.startDate > season.dates.endDate) {
    errors.push({ code: "validation_failed", field: "dates", message: "The season start date must not be after its end date." });
  }
  if (!required(season.intent?.statement)) {
    errors.push({ code: "validation_failed", field: "intent", message: "A season intent is required." });
  }

  const eligibleGoals = context.goals.filter((goal) => goal.status !== "abandoned");
  if (eligibleGoals.length === 0) {
    errors.push({ code: "validation_failed", field: "goals", message: "At least one non-abandoned goal is required." });
  }

  for (const goal of eligibleGoals) {
    if (goal.seasonId !== season.id) {
      errors.push({ code: "validation_failed", field: `goals.${goal.id}.seasonId`, message: "A goal must belong to the season being activated." });
    }
    const result = validateGoalActivation(goal, context.outcomesByGoal[goal.id] ?? []);
    if (!result.ok) {
      errors.push(
        ...result.errors.map((error) => ({
          ...error,
          field: `goals.${goal.id}.${error.field ?? "goal"}`,
        })),
      );
    }
  }

  return errors.length > 0 ? { ok: false, errors } : success(season);
}
