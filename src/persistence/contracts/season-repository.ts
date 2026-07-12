import type { Season } from "../../domain/season";
import type { SeasonId } from "../../domain/shared";
import type { PersistenceResult } from "../errors";

export interface SeasonRepository {
  findById(id: SeasonId): Promise<PersistenceResult<Season | null>>;
  list(): Promise<PersistenceResult<Season[]>>;
  save(season: Season): Promise<PersistenceResult<Season>>;
}
