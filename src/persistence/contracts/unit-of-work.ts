import type { GoalRepository } from "./goal-repository";
import type { MilestoneRepository } from "./milestone-repository";
import type { OutcomeRepository } from "./outcome-repository";
import type { SeasonRepository } from "./season-repository";

/** Groups related repositories for injection; it does not imply transactions. */
export interface PlanningUnitOfWork {
  seasons: SeasonRepository;
  goals: GoalRepository;
  outcomes: OutcomeRepository;
  milestones: MilestoneRepository;
}
