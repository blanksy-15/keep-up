import type { PersistenceError } from "../errors";

export function recordError(field: string, message: string): PersistenceError {
  return { code: "invalid_record", field, message };
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

export function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

export function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

export function isCalendarDate(value: unknown): value is string {
  if (!isString(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function isTimestamp(value: unknown): value is string {
  return isString(value) && value.length > 0 && !Number.isNaN(Date.parse(value));
}

export function isNullableTimestamp(value: unknown): value is string | null {
  return value === null || isTimestamp(value);
}
