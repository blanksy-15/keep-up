import type { SeasonRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
import { toSeasonDomain, toSeasonRecord } from "../mapping";
import type { SeasonRecord } from "../records";
import type { Season } from "../../domain/season";
import type { SeasonId } from "../../domain/shared";

export class InMemorySeasonRepository implements SeasonRepository {
  readonly #records = new Map<SeasonId, SeasonRecord>();

  async findById(id: SeasonId): Promise<PersistenceResult<Season | null>> {
    try {
      const record = this.#records.get(id);
      if (!record) return persistenceSuccess(null);
      return toSeasonDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Season lookup failed.", cause });
    }
  }

  async list(): Promise<PersistenceResult<Season[]>> {
    try {
      const records = [...this.#records.values()].sort((a, b) =>
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

  async save(season: Season): Promise<PersistenceResult<Season>> {
    try {
      const record = toSeasonRecord(season);
      const validation = toSeasonDomain(record);
      if (!validation.ok) return validation;
      this.#records.set(record.id, { ...record });
      return toSeasonDomain({ ...record });
    } catch (cause) {
      return persistenceFailure({ code: "storage_failure", message: "Season save failed.", cause });
    }
  }
}
