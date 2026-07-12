import type { Outcome } from "../../domain/outcome";
import type { GoalId, OutcomeId } from "../../domain/shared";
import type { PersistenceResult } from "../errors";

export interface OutcomeRepository {
  findById(id: OutcomeId): Promise<PersistenceResult<Outcome | null>>;
  listByGoalId(goalId: GoalId): Promise<PersistenceResult<Outcome[]>>;
  save(outcome: Outcome): Promise<PersistenceResult<Outcome>>;
}
