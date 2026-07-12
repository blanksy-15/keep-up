import type { SeasonRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toSeasonDomain, toSeasonRecord } from "../mapping";
import type { SeasonRecord } from "../records";
import type { Season } from "../../domain/season";
import type { SeasonId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";

export class InMemorySeasonRepository implements SeasonRepository {
  readonly #records = new Map<SeasonId, SeasonRecord>();

  async findById(ownerOrId:AccountOwnerId,id?: SeasonId): Promise<PersistenceResult<Season | null>> {const ownerId=id?ownerOrId:"owner-a";id??=ownerOrId;
    try {
      const record = this.#records.get(id);
      if (!record||record.ownerId!==ownerId) return persistenceSuccess(null);
      return toSeasonDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Season lookup failed.", cause });
    }
  }

  async list(ownerId:AccountOwnerId="owner-a"): Promise<PersistenceResult<Season[]>> {
    try {
      const records = [...this.#records.values()].filter(r=>r.ownerId===ownerId).sort((a, b) =>
        a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id),
      );
      const values: Season[] = [];
      for (const record of records) {
        const result = toSeasonDomain({ ...record });
        if (!result.ok) return result;
        values.push(result.value);
      }
      return persistenceSuccess(values);
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Season listing failed.", cause });
    }
  }

  async save(ownerOrSeason:AccountOwnerId|Season,value?: Season): Promise<PersistenceResult<Season>> {const season=typeof ownerOrSeason==="string"?value!:ownerOrSeason,ownerId=typeof ownerOrSeason==="string"?ownerOrSeason:season.ownerId;
    try {
      if(season.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Season owner mismatch."});const existing=this.#records.get(season.id);if(existing&&existing.ownerId!==ownerId)return persistenceFailure({code:"conflict",message:"Season owner mismatch."});const record = toSeasonRecord(season);
      const validation = toSeasonDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toSeasonDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Season save failed.", cause });
    }
  }
}
