import type { Goal } from "../../domain/goal";
import type { GoalId, SeasonId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { PersistenceResult } from "../errors";

export interface GoalRepository {
  findById(ownerId:AccountOwnerId,id: GoalId): Promise<PersistenceResult<Goal | null>>;
  listBySeasonId(ownerId:AccountOwnerId,seasonId: SeasonId): Promise<PersistenceResult<Goal[]>>;
  save(ownerId:AccountOwnerId,goal: Goal): Promise<PersistenceResult<Goal>>;
}
