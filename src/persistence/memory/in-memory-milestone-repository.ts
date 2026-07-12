import type { Milestone } from "../../domain/goal";
import type { GoalId, MilestoneId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { MilestoneRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toMilestoneDomain, toMilestoneRecord } from "../mapping";
import type { MilestoneRecord } from "../records";

export class InMemoryMilestoneRepository implements MilestoneRepository {
  readonly #records = new Map<MilestoneId, MilestoneRecord>();

  async findById(ownerOrId:AccountOwnerId,id?: MilestoneId): Promise<PersistenceResult<Milestone | null>> {const ownerId=id?ownerOrId:"owner-a";id??=ownerOrId;
    try {
      const record = this.#records.get(id);
      return record?.ownerId===ownerId ? toMilestoneDomain({ ...record }) : persistenceSuccess(null);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Milestone lookup failed.", cause });
    }
  }

  async listByGoalId(ownerOrGoal:AccountOwnerId,goalId?:GoalId): Promise<PersistenceResult<Milestone[]>> {const ownerId=goalId?ownerOrGoal:"owner-a";goalId??=ownerOrGoal;
    try {
      const records = [...this.#records.values()]
        .filter((record) => record.ownerId===ownerId&&record.goalId === goalId)
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

  async save(ownerOrMilestone:AccountOwnerId|Milestone,value?:Milestone): Promise<PersistenceResult<Milestone>> {const milestone=typeof ownerOrMilestone==="string"?value!:ownerOrMilestone,ownerId=typeof ownerOrMilestone==="string"?ownerOrMilestone:milestone.ownerId;
    try {
      if(milestone.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Milestone owner mismatch."});const existing=this.#records.get(milestone.id);if(existing&&existing.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Milestone owner mismatch."});const record = toMilestoneRecord(milestone);
      const validation = toMilestoneDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toMilestoneDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Milestone save failed.", cause });
    }
  }
}
