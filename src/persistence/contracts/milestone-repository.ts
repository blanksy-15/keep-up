import type { Milestone } from "../../domain/goal";
import type { GoalId, MilestoneId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { PersistenceResult } from "../errors";

export interface MilestoneRepository {
  findById(ownerId:AccountOwnerId,id: MilestoneId): Promise<PersistenceResult<Milestone | null>>;
  listByGoalId(ownerId:AccountOwnerId,goalId: GoalId): Promise<PersistenceResult<Milestone[]>>;
  save(ownerId:AccountOwnerId,milestone: Milestone): Promise<PersistenceResult<Milestone>>;
}
