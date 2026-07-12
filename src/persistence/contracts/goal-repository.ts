import type { Goal } from "../../domain/goal";
import type { GoalId, SeasonId } from "../../domain/shared";
import type { PersistenceResult } from "../errors";

export interface GoalRepository {
  findById(id: GoalId): Promise<PersistenceResult<Goal | null>>;
  listBySeasonId(seasonId: SeasonId): Promise<PersistenceResult<Goal[]>>;
  save(goal: Goal): Promise<PersistenceResult<Goal>>;
}
