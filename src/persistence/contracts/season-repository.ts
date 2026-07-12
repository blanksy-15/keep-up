import type { Season } from "../../domain/season";
import type { SeasonId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { PersistenceResult } from "../errors";

export interface SeasonRepository {
  findById(ownerId:AccountOwnerId,id: SeasonId): Promise<PersistenceResult<Season | null>>;
  list(ownerId:AccountOwnerId): Promise<PersistenceResult<Season[]>>;
  save(ownerId:AccountOwnerId,season: Season): Promise<PersistenceResult<Season>>;
}
