import { scopePlanningPersistence,type Clock, type IdGenerator, type PlanningApplicationDependencies } from "../../src/application";
import type { Goal, Milestone, Outcome, Season } from "../../src/domain";
import { InMemoryPlanningUnitOfWork } from "../../src/persistence";

export const fixedTimestamp = "2026-07-11T12:00:00.000Z";
export const ownerId="owner-a";

export class FixedClock implements Clock {
  constructor(
    readonly timestamp = fixedTimestamp,
    readonly date = "2026-07-11",
  ) {}

  now() { return this.timestamp; }
  today() { return this.date; }
}

export class DeterministicIdGenerator implements IdGenerator {
  #season = 0;
  #goal = 0;
  #outcome = 0;
  #milestone = 0;

  nextSeasonId() { this.#season += 1; return `season-generated-${this.#season}`; }
  nextGoalId() { this.#goal += 1; return `goal-generated-${this.#goal}`; }
  nextOutcomeId() { this.#outcome += 1; return `outcome-generated-${this.#outcome}`; }
  nextMilestoneId() { this.#milestone += 1; return `milestone-generated-${this.#milestone}`; }
}

export function createTestContext(): {
  dependencies: PlanningApplicationDependencies;
  persistence: InMemoryPlanningUnitOfWork;
} {
  const persistence = new InMemoryPlanningUnitOfWork();
  return {
    persistence,
    dependencies: {
      ownerId,
      persistence:scopePlanningPersistence(ownerId,persistence),
      clock: new FixedClock(),
      ids: new DeterministicIdGenerator(),
    },
  };
}

export function seasonFixture(overrides: Partial<Season> = {}): Season {
  return {
    ownerId,
    id: "season-1",
    name: "Build with intention",
    dates: { startDate: "2026-07-01", endDate: "2026-09-30" },
    status: "draft",
    intent: { statement: "Choose fewer commitments and finish them well." },
    createdAt: fixedTimestamp,
    updatedAt: fixedTimestamp,
    ...overrides,
  };
}

export function goalFixture(overrides: Partial<Goal> = {}): Goal {
  return {
    ownerId,
    id: "goal-1",
    seasonId: "season-1",
    title: "Ship the foundation",
    description: "Create a durable product foundation.",
    status: "draft",
    createdAt: fixedTimestamp,
    updatedAt: fixedTimestamp,
    ...overrides,
  };
}

export function outcomeFixture(overrides: Partial<Outcome> = {}): Outcome {
  return {
    ownerId,
    id: "outcome-1",
    goalId: "goal-1",
    description: "Complete foundation work",
    type: "numeric",
    targetValue: 100,
    progress: { value: 25, recordedAt: fixedTimestamp },
    ...overrides,
  };
}

export function milestoneFixture(overrides: Partial<Milestone> = {}): Milestone {
  return {
    ownerId,
    id: "milestone-1",
    goalId: "goal-1",
    title: "Define application services",
    status: "not_started",
    ...overrides,
  };
}

export function valueOf<T>(result: { ok: true; value: T } | { ok: false; errors: unknown[] }): T {
  if (!result.ok) throw new Error("Expected success.");
  return result.value;
}
