import type { Milestone, MilestoneStatus } from "../../domain/goal";
import { persistenceSuccess, type PersistenceResult } from "../errors";
import type { MilestoneRecord } from "../records";
import { isCalendarDate, isNonEmptyString, isNullableString, isNullableTimestamp, isString, recordError } from "./record-validation";

const statuses: readonly MilestoneStatus[] = ["not_started", "in_progress", "completed", "skipped"];

export function toMilestoneRecord(milestone: Milestone): MilestoneRecord {
  return {
    id: milestone.id,
    goalId: milestone.goalId,
    title: milestone.title,
    status: milestone.status,
    targetDate: milestone.targetDate ?? null,
    completedAt: milestone.completedAt ?? null,
    skippedAt: milestone.skippedAt ?? null,
    updatedAt: milestone.updatedAt ?? null,
  };
}

export function toMilestoneDomain(record: MilestoneRecord): PersistenceResult<Milestone> {
  const errors = [];
  if (!isNonEmptyString(record.id)) errors.push(recordError("id", "Milestone ID must be a non-empty string."));
  if (!isNonEmptyString(record.goalId)) errors.push(recordError("goalId", "Milestone goal ID must be a non-empty string."));
  if (!isString(record.title)) errors.push(recordError("title", "Milestone title must be a string."));
  if (!isString(record.status) || !statuses.includes(record.status as MilestoneStatus)) errors.push(recordError("status", "Milestone status is invalid."));
  if (!isNullableString(record.targetDate) || (record.targetDate !== null && !isCalendarDate(record.targetDate))) errors.push(recordError("targetDate", "Milestone target date must be a valid calendar date or null."));
  for (const field of ["completedAt", "skippedAt", "updatedAt"] as const) {
    if (!isNullableTimestamp(record[field])) errors.push(recordError(field, `Milestone ${field} must be a timestamp or null.`));
  }
  if (errors.length > 0) return { ok: false, errors };

  return persistenceSuccess({
    id: record.id,
    goalId: record.goalId,
    title: record.title,
    status: record.status as MilestoneStatus,
    ...(record.targetDate === null ? {} : { targetDate: record.targetDate }),
    ...(record.completedAt === null ? {} : { completedAt: record.completedAt }),
    ...(record.skippedAt === null ? {} : { skippedAt: record.skippedAt }),
    ...(record.updatedAt === null ? {} : { updatedAt: record.updatedAt }),
  });
}
