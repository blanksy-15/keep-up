import type { Outcome } from "../../domain/outcome";
import type { GoalId, OutcomeId } from "../../domain/shared";
import type { OutcomeRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toOutcomeDomain, toOutcomeRecord } from "../mapping";
import type { OutcomeRecord } from "../records";

export class InMemoryOutcomeRepository implements OutcomeRepository {
  readonly #records = new Map<OutcomeId, OutcomeRecord>();

  async findById(id: OutcomeId): Promise<PersistenceResult<Outcome | null>> {
    try {
      const record = this.#records.get(id);
      return record ? toOutcomeDomain({ ...record }) : persistenceSuccess(null);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Outcome lookup failed.", cause });
    }
  }

  async listByGoalId(goalId: GoalId): Promise<PersistenceResult<Outcome[]>> {
    try {
      const records = [...this.#records.values()]
        .filter((record) => record.goalId === goalId)
        .sort((a, b) => a.id.localeCompare(b.id));
      const values: Outcome[] = [];
      for (const record of records) {
        const result = toOutcomeDomain({ ...record });
        if (!result.ok) return result;
        values.push(result.value);
      }
      return persistenceSuccess(values);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Outcome listing failed.", cause });
    }
  }

  async save(outcome: Outcome): Promise<PersistenceResult<Outcome>> {
    try {
      const record = toOutcomeRecord(outcome);
      const validation = toOutcomeDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toOutcomeDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Outcome save failed.", cause });
    }
  }
}
