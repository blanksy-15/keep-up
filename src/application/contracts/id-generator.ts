import type { GoalId, MilestoneId, OutcomeId, SeasonId } from "../../domain/shared";

export interface IdGenerator {
  nextSeasonId(): SeasonId;
  nextGoalId(): GoalId;
  nextOutcomeId(): OutcomeId;
  nextMilestoneId(): MilestoneId;
}
