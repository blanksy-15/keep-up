import type { Milestone } from "../../domain/goal";
import type { GoalId, MilestoneId } from "../../domain/shared";
import type { PersistenceResult } from "../errors";

export interface MilestoneRepository {
  findById(id: MilestoneId): Promise<PersistenceResult<Milestone | null>>;
  listByGoalId(goalId: GoalId): Promise<PersistenceResult<Milestone[]>>;
  save(milestone: Milestone): Promise<PersistenceResult<Milestone>>;
}
