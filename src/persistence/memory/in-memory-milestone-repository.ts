import type { Milestone } from "../../domain/goal";
import type { GoalId, MilestoneId } from "../../domain/shared";
import type { MilestoneRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toMilestoneDomain, toMilestoneRecord } from "../mapping";
import type { MilestoneRecord } from "../records";

export class InMemoryMilestoneRepository implements MilestoneRepository {
  readonly #records = new Map<MilestoneId, MilestoneRecord>();

  async findById(id: MilestoneId): Promise<PersistenceResult<Milestone | null>> {
    try {
      const record = this.#records.get(id);
      return record ? toMilestoneDomain({ ...record }) : persistenceSuccess(null);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Milestone lookup failed.", cause });
    }
  }

  async listByGoalId(goalId: GoalId): Promise<PersistenceResult<Milestone[]>> {
    try {
      const records = [...this.#records.values()]
        .filter((record) => record.goalId === goalId)
        .sort((a, b) => a.id.localeCompare(b.id));
      const values: Milestone[] = [];
      for (const record of records) {
        const result = toMilestoneDomain({ ...record });
        if (!result.ok) return result;
        values.push(result.value);
      }
      return persistenceSuccess(values);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Milestone listing failed.", cause });
    }
  }

  async save(milestone: Milestone): Promise<PersistenceResult<Milestone>> {
    try {
      const record = toMilestoneRecord(milestone);
      const validation = toMilestoneDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toMilestoneDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Milestone save failed.", cause });
    }
  }
}
