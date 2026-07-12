import type { DomainError } from "../domain/behavior";
import type { PersistenceError, PersistenceResult } from "../persistence/errors";

export type ApplicationErrorCode =
  | "not_found"
  | "validation_failed"
  | "invalid_transition"
  | "conflict"
  | "persistence_failure"
  | "integrity_failure"
  | "atomicity_failure"
  | "assistant_unavailable"
  | "assistant_failure";

export interface ApplicationError {
  code: ApplicationErrorCode;
  message: string;
  field?: string;
  cause?: unknown;
}

export type ApplicationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ApplicationError[] };

export function applicationSuccess<T>(value: T): ApplicationResult<T> {
  return { ok: true, value };
}

export function applicationFailure<T>(...errors: ApplicationError[]): ApplicationResult<T> {
  return { ok: false, errors };
}

export function mapDomainErrors<T>(errors: readonly DomainError[]): ApplicationResult<T> {
  return {
    ok: false,
    errors: errors.map((error) => ({
      code: error.code === "invalid_transition" ? "invalid_transition" : "validation_failed",
      message: error.message,
      ...(error.field ? { field: error.field } : {}),
    })),
  };
}

export function mapPersistenceErrors<T>(errors: readonly PersistenceError[]): ApplicationResult<T> {
  return {
    ok: false,
    errors: errors.map((error) => {
      if (error.code === "conflict") {
        return { code: "conflict" as const, message: "The planning record conflicts with existing state." };
      }
      if (error.code === "invalid_record") {
        return { code: "persistence_failure" as const, message: "Stored planning data could not be reconstructed." };
      }
      return { code: "persistence_failure" as const, message: "Planning data could not be accessed." };
    }),
  };
}

export function fromPersistence<T>(result: PersistenceResult<T>): ApplicationResult<T> {
  return result.ok ? applicationSuccess(result.value) : mapPersistenceErrors(result.errors);
}

export function notFound<T>(entity: string, id: string): ApplicationResult<T> {
  return applicationFailure({ code: "not_found", message: `${entity} ${id} was not found.` });
}

export function integrityFailure<T>(message: string): ApplicationResult<T> {
  return applicationFailure({ code: "integrity_failure", message });
}
