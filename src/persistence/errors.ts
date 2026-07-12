export type PersistenceErrorCode =
  | "conflict"
  | "invalid_record"
  | "storage_failure";

export interface PersistenceError {
  code: PersistenceErrorCode;
  message: string;
  field?: string;
  cause?: unknown;
}

export type PersistenceResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: PersistenceError[] };

export function persistenceSuccess<T>(value: T): PersistenceResult<T> {
  return { ok: true, value };
}

export function persistenceFailure<T>(
  ...errors: PersistenceError[]
): PersistenceResult<T> {
  return { ok: false, errors };
}
