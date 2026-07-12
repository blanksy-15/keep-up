import type { Outcome } from "../../domain/outcome";
import type { GoalId, OutcomeId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { PersistenceResult } from "../errors";

export interface OutcomeRepository {
  findById(ownerId:AccountOwnerId,id: OutcomeId): Promise<PersistenceResult<Outcome | null>>;
  listByGoalId(ownerId:AccountOwnerId,goalId: GoalId): Promise<PersistenceResult<Outcome[]>>;
  save(ownerId:AccountOwnerId,outcome: Outcome): Promise<PersistenceResult<Outcome>>;
}
