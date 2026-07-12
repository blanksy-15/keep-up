import type { PlanningUnitOfWork } from "../contracts";
import { InMemoryGoalRepository } from "./in-memory-goal-repository";
import { InMemoryMilestoneRepository } from "./in-memory-milestone-repository";
import { InMemoryOutcomeRepository } from "./in-memory-outcome-repository";
import { InMemorySeasonRepository } from "./in-memory-season-repository";

export class InMemoryPlanningUnitOfWork implements PlanningUnitOfWork {
  readonly seasons = new InMemorySeasonRepository();
  readonly goals = new InMemoryGoalRepository();
  readonly outcomes = new InMemoryOutcomeRepository();
  readonly milestones = new InMemoryMilestoneRepository();
}
