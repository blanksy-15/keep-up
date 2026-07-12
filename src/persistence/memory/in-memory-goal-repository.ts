import type { Goal } from "../../domain/goal";
import type { GoalId, SeasonId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { GoalRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toGoalDomain, toGoalRecord } from "../mapping";
import type { GoalRecord } from "../records";

export class InMemoryGoalRepository implements GoalRepository {
  readonly #records = new Map<GoalId, GoalRecord>();

  async findById(ownerOrId:AccountOwnerId,id?: GoalId): Promise<PersistenceResult<Goal | null>> {const ownerId=id?ownerOrId:"owner-a";id??=ownerOrId;
    try {
      const record = this.#records.get(id);
      return record?.ownerId===ownerId ? toGoalDomain({ ...record }) : persistenceSuccess(null);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Goal lookup failed.", cause });
    }
  }

  async listBySeasonId(ownerOrSeason:AccountOwnerId,seasonId?: SeasonId): Promise<PersistenceResult<Goal[]>> {const ownerId=seasonId?ownerOrSeason:"owner-a";seasonId??=ownerOrSeason;
    try {
      const records = [...this.#records.values()]
        .filter((record) => record.ownerId===ownerId&&record.seasonId === seasonId)
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

  async save(ownerOrGoal:AccountOwnerId|Goal,value?:Goal): Promise<PersistenceResult<Goal>> {const goal=typeof ownerOrGoal==="string"?value!:ownerOrGoal,ownerId=typeof ownerOrGoal==="string"?ownerOrGoal:goal.ownerId;
    try {
      if(goal.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Goal owner mismatch."});const existing=this.#records.get(goal.id);if(existing&&existing.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Goal owner mismatch."});const record = toGoalRecord(goal);
      const validation = toGoalDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toGoalDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Goal save failed.", cause });
    }
  }
}
