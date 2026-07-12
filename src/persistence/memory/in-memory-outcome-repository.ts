import type { Outcome } from "../../domain/outcome";
import type { GoalId, OutcomeId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { OutcomeRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toOutcomeDomain, toOutcomeRecord } from "../mapping";
import type { OutcomeRecord } from "../records";

export class InMemoryOutcomeRepository implements OutcomeRepository {
  readonly #records = new Map<OutcomeId, OutcomeRecord>();

  async findById(ownerOrId:AccountOwnerId,id?: OutcomeId): Promise<PersistenceResult<Outcome | null>> {const ownerId=id?ownerOrId:"owner-a";id??=ownerOrId;
    try {
      const record = this.#records.get(id);
      return record?.ownerId===ownerId ? toOutcomeDomain({ ...record }) : persistenceSuccess(null);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Outcome lookup failed.", cause });
    }
  }

  async listByGoalId(ownerOrGoal:AccountOwnerId,goalId?:GoalId): Promise<PersistenceResult<Outcome[]>> {const ownerId=goalId?ownerOrGoal:"owner-a";goalId??=ownerOrGoal;
    try {
      const records = [...this.#records.values()]
        .filter((record) => record.ownerId===ownerId&&record.goalId === goalId)
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

  async save(ownerOrOutcome:AccountOwnerId|Outcome,value?:Outcome): Promise<PersistenceResult<Outcome>> {const outcome=typeof ownerOrOutcome==="string"?value!:ownerOrOutcome,ownerId=typeof ownerOrOutcome==="string"?ownerOrOutcome:outcome.ownerId;
    try {
      if(outcome.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Outcome owner mismatch."});const existing=this.#records.get(outcome.id);if(existing&&existing.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Outcome owner mismatch."});const record = toOutcomeRecord(outcome);
      const validation = toOutcomeDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toOutcomeDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Outcome save failed.", cause });
    }
  }
}
