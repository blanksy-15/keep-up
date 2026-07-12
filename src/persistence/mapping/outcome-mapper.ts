import type { Outcome, OutcomeType } from "../../domain/outcome";
import { persistenceSuccess, type PersistenceResult } from "../errors";
import type { OutcomeRecord } from "../records";
import { isNonEmptyString, isNullableFiniteNumber, isNullableString, isNullableTimestamp, isString, recordError } from "./record-validation";

const types: readonly OutcomeType[] = ["boolean", "numeric", "percentage", "count"];

export function toOutcomeRecord(outcome: Outcome): OutcomeRecord {
  return {
    ownerId:outcome.ownerId,
    id: outcome.id,
    goalId: outcome.goalId,
    description: outcome.description,
    type: outcome.type,
    targetValue: outcome.targetValue ?? null,
    unit: outcome.unit ?? null,
    progressValue: outcome.progress?.value ?? null,
    progressNote: outcome.progress?.note ?? null,
    progressRecordedAt: outcome.progress?.recordedAt ?? null,
  };
}

export function toOutcomeDomain(record: OutcomeRecord): PersistenceResult<Outcome> {
  const errors = [];
  if (!isNonEmptyString(record.id)) errors.push(recordError("id", "Outcome ID must be a non-empty string."));
  if (!isNonEmptyString(record.ownerId)) errors.push(recordError("ownerId", "Outcome owner ID must be a non-empty string."));
  if (!isNonEmptyString(record.goalId)) errors.push(recordError("goalId", "Outcome goal ID must be a non-empty string."));
  if (!isString(record.description)) errors.push(recordError("description", "Outcome description must be a string."));
  if (!isString(record.type) || !types.includes(record.type as OutcomeType)) errors.push(recordError("type", "Outcome type is invalid."));
  if (!isNullableFiniteNumber(record.targetValue)) errors.push(recordError("targetValue", "Outcome target must be a finite number or null."));
  if (!isNullableString(record.unit)) errors.push(recordError("unit", "Outcome unit must be a string or null."));
  if (!isNullableFiniteNumber(record.progressValue)) errors.push(recordError("progressValue", "Outcome progress must be a finite number or null."));
  if (!isNullableString(record.progressNote)) errors.push(recordError("progressNote", "Outcome progress note must be a string or null."));
  if (!isNullableTimestamp(record.progressRecordedAt)) errors.push(recordError("progressRecordedAt", "Outcome progress timestamp must be a timestamp or null."));
  const hasProgress = record.progressValue !== null || record.progressNote !== null || record.progressRecordedAt !== null;
  if (hasProgress && (record.progressValue === null || record.progressRecordedAt === null)) {
    errors.push(recordError("progress", "Outcome progress requires both a value and recorded timestamp."));
  }
  if (errors.length > 0) return { ok: false, errors };

  return persistenceSuccess({
    ownerId:record.ownerId,
    id: record.id,
    goalId: record.goalId,
    description: record.description,
    type: record.type as OutcomeType,
    ...(record.targetValue === null ? {} : { targetValue: record.targetValue }),
    ...(record.unit === null ? {} : { unit: record.unit }),
    ...(record.progressValue === null || record.progressRecordedAt === null ? {} : {
      progress: {
        value: record.progressValue,
        ...(record.progressNote === null ? {} : { note: record.progressNote }),
        recordedAt: record.progressRecordedAt,
      },
    }),
  });
}
