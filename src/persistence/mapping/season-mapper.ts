import type { Season, SeasonStatus } from "../../domain/season";
import { persistenceSuccess, type PersistenceResult } from "../errors";
import type { SeasonRecord } from "../records";
import { isCalendarDate, isNonEmptyString, isNullableString, isNullableTimestamp, isString, isTimestamp, recordError } from "./record-validation";

const statuses: readonly SeasonStatus[] = ["draft", "active", "completed", "archived"];

export function toSeasonRecord(season: Season): SeasonRecord {
  return {
    ownerId:season.ownerId,
    id: season.id,
    name: season.name,
    startDate: season.dates.startDate,
    endDate: season.dates.endDate,
    status: season.status,
    intentStatement: season.intent?.statement ?? null,
    createdAt: season.createdAt,
    updatedAt: season.updatedAt,
    activatedAt: season.activatedAt ?? null,
    completedAt: season.completedAt ?? null,
    archivedAt: season.archivedAt ?? null,
  };
}

export function toSeasonDomain(record: SeasonRecord): PersistenceResult<Season> {
  const errors = [];
  if (!isNonEmptyString(record.id)) errors.push(recordError("id", "Season ID must be a non-empty string."));
  if (!isNonEmptyString(record.ownerId)) errors.push(recordError("ownerId", "Season owner ID must be a non-empty string."));
  if (!isString(record.name)) errors.push(recordError("name", "Season name must be a string."));
  if (!isCalendarDate(record.startDate)) errors.push(recordError("startDate", "Season start date must be a valid calendar date."));
  if (!isCalendarDate(record.endDate)) errors.push(recordError("endDate", "Season end date must be a valid calendar date."));
  if (!isString(record.status) || !statuses.includes(record.status as SeasonStatus)) errors.push(recordError("status", "Season status is invalid."));
  if (!isNullableString(record.intentStatement)) errors.push(recordError("intentStatement", "Season intent must be a string or null."));
  if (!isTimestamp(record.createdAt)) errors.push(recordError("createdAt", "Season creation timestamp is invalid."));
  if (!isTimestamp(record.updatedAt)) errors.push(recordError("updatedAt", "Season update timestamp is invalid."));
  for (const field of ["activatedAt", "completedAt", "archivedAt"] as const) {
    if (!isNullableTimestamp(record[field])) errors.push(recordError(field, `Season ${field} must be a timestamp or null.`));
  }
  if (errors.length > 0) return { ok: false, errors };

  return persistenceSuccess({
    ownerId:record.ownerId,
    id: record.id,
    name: record.name,
    dates: { startDate: record.startDate, endDate: record.endDate },
    status: record.status as SeasonStatus,
    ...(record.intentStatement === null ? {} : { intent: { statement: record.intentStatement } }),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    ...(record.activatedAt === null ? {} : { activatedAt: record.activatedAt }),
    ...(record.completedAt === null ? {} : { completedAt: record.completedAt }),
    ...(record.archivedAt === null ? {} : { archivedAt: record.archivedAt }),
  });
}
