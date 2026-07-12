import type { Goal } from "../../domain/goal";
import type { GoalId, SeasonId } from "../../domain/shared";
import type { GoalRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toGoalDomain, toGoalRecord } from "../mapping";
import type { GoalRecord } from "../records";

export class InMemoryGoalRepository implements GoalRepository {
  readonly #records = new Map<GoalId, GoalRecord>();

  async findById(id: GoalId): Promise<PersistenceResult<Goal | null>> {
    try {
      const record = this.#records.get(id);
      return record ? toGoalDomain({ ...record }) : persistenceSuccess(null);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Goal lookup failed.", cause });
    }
  }

  async listBySeasonId(seasonId: SeasonId): Promise<PersistenceResult<Goal[]>> {
    try {
      const records = [...this.#records.values()]
        .filter((record) => record.seasonId === seasonId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
      const values: Goal[] = [];
      for (const record of records) {
        const result = toGoalDomain({ ...record });
        if (!result.ok) return result;
        values.push(result.value);
      }
      return persistenceSuccess(values);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Goal listing failed.", cause });
    }
  }

  async save(goal: Goal): Promise<PersistenceResult<Goal>> {
    try {
      const record = toGoalRecord(goal);
      const validation = toGoalDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toGoalDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Goal save failed.", cause });
    }
  }
}
