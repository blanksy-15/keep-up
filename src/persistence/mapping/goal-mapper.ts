import type { Goal, GoalStatus } from "../../domain/goal";
import { persistenceSuccess, type PersistenceResult } from "../errors";
import type { GoalRecord } from "../records";
import { isNonEmptyString, isNullableString, isNullableTimestamp, isString, isTimestamp, recordError } from "./record-validation";

const statuses: readonly GoalStatus[] = ["draft", "active", "paused", "completed", "abandoned"];

export function toGoalRecord(goal: Goal): GoalRecord {
  return {
    id: goal.id,
    seasonId: goal.seasonId,
    title: goal.title,
    description: goal.description ?? null,
    status: goal.status,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    activatedAt: goal.activatedAt ?? null,
    pausedAt: goal.pausedAt ?? null,
    completedAt: goal.completedAt ?? null,
    abandonedAt: goal.abandonedAt ?? null,
  };
}

export function toGoalDomain(record: GoalRecord): PersistenceResult<Goal> {
  const errors = [];
  if (!isNonEmptyString(record.id)) errors.push(recordError("id", "Goal ID must be a non-empty string."));
  if (!isNonEmptyString(record.seasonId)) errors.push(recordError("seasonId", "Goal season ID must be a non-empty string."));
  if (!isString(record.title)) errors.push(recordError("title", "Goal title must be a string."));
  if (!isNullableString(record.description)) errors.push(recordError("description", "Goal description must be a string or null."));
  if (!isString(record.status) || !statuses.includes(record.status as GoalStatus)) errors.push(recordError("status", "Goal status is invalid."));
  if (!isTimestamp(record.createdAt)) errors.push(recordError("createdAt", "Goal creation timestamp is invalid."));
  if (!isTimestamp(record.updatedAt)) errors.push(recordError("updatedAt", "Goal update timestamp is invalid."));
  for (const field of ["activatedAt", "pausedAt", "completedAt", "abandonedAt"] as const) {
    if (!isNullableTimestamp(record[field])) errors.push(recordError(field, `Goal ${field} must be a timestamp or null.`));
  }
  if (errors.length > 0) return { ok: false, errors };

  return persistenceSuccess({
    id: record.id,
    seasonId: record.seasonId,
    title: record.title,
    ...(record.description === null ? {} : { description: record.description }),
    status: record.status as GoalStatus,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    ...(record.activatedAt === null ? {} : { activatedAt: record.activatedAt }),
    ...(record.pausedAt === null ? {} : { pausedAt: record.pausedAt }),
    ...(record.completedAt === null ? {} : { completedAt: record.completedAt }),
    ...(record.abandonedAt === null ? {} : { abandonedAt: record.abandonedAt }),
  });
}
