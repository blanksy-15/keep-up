import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Goal, Milestone, Outcome, Season } from "../src/domain";
import {
  InMemoryGoalRepository,
  InMemoryMilestoneRepository,
  InMemoryOutcomeRepository,
  InMemoryPlanningUnitOfWork,
  InMemorySeasonRepository,
  toGoalDomain,
  toGoalRecord,
  toMilestoneDomain,
  toMilestoneRecord,
  toOutcomeDomain,
  toOutcomeRecord,
  toSeasonDomain,
  toSeasonRecord,
  type SeasonRecord,
} from "../src/persistence";

const createdAt = "2026-07-01T12:00:00.000Z";
const updatedAt = "2026-07-11T12:00:00.000Z";

function season(overrides: Partial<Season> = {}): Season {
  return {
    id: "season-1",
    name: "Build with intention",
    dates: { startDate: "2026-07-01", endDate: "2026-09-30" },
    status: "active",
    intent: { statement: "Choose fewer commitments and finish them well." },
    createdAt,
    updatedAt,
    activatedAt: createdAt,
    ...overrides,
  };
}

function goal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: "goal-1",
    seasonId: "season-1",
    title: "Ship the foundation",
    description: "Create a durable product foundation.",
    status: "active",
    createdAt,
    updatedAt,
    activatedAt: createdAt,
    ...overrides,
  };
}

function outcome(overrides: Partial<Outcome> = {}): Outcome {
  return {
    id: "outcome-1",
    goalId: "goal-1",
    description: "Complete foundation work",
    type: "numeric",
    targetValue: 100,
    unit: "percent",
    progress: { value: 125, note: "Ahead of target", recordedAt: updatedAt },
    ...overrides,
  };
}

function milestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: "milestone-1",
    goalId: "goal-1",
    title: "Define persistence boundary",
    status: "completed",
    targetDate: "2026-07-15",
    completedAt: updatedAt,
    updatedAt,
    ...overrides,
  };
}

function valueOf<T>(result: { ok: true; value: T } | { ok: false; errors: unknown[] }): T {
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("Expected a successful persistence result.");
  return result.value;
}

describe("persistence mappers", () => {
  test("round trips seasons and preserves lifecycle timestamps", () => {
    const original = season({ status: "archived", completedAt: updatedAt, archivedAt: "2026-07-12T12:00:00.000Z" });
    assert.deepEqual(valueOf(toSeasonDomain(toSeasonRecord(original))), original);
  });

  test("round trips goals and preserves parent and lifecycle timestamps", () => {
    const original = goal({ status: "paused", pausedAt: updatedAt });
    assert.deepEqual(valueOf(toGoalDomain(toGoalRecord(original))), original);
  });

  test("round trips outcomes and preserves raw progress", () => {
    const original = outcome();
    assert.deepEqual(valueOf(toOutcomeDomain(toOutcomeRecord(original))), original);
  });

  test("round trips milestones and preserves parent and status", () => {
    const original = milestone();
    assert.deepEqual(valueOf(toMilestoneDomain(toMilestoneRecord(original))), original);
  });

  test("round trips optional fields without injecting defaults", () => {
    const original = season({ intent: undefined, activatedAt: undefined });
    const expected = structuredClone(original);
    delete expected.intent;
    delete expected.activatedAt;
    assert.deepEqual(valueOf(toSeasonDomain(toSeasonRecord(original))), expected);
  });

  test("rejects malformed records with structured errors", () => {
    const malformed = { ...toSeasonRecord(season()), status: "unknown" } as SeasonRecord;
    const result = toSeasonDomain(malformed);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "invalid_record");
  });

  test("rejects partial outcome progress records", () => {
    const malformed = { ...toOutcomeRecord(outcome()), progressRecordedAt: null };
    const result = toOutcomeDomain(malformed);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field === "progress"));
  });

  test("does not mutate mapper inputs", () => {
    const domainInput = outcome();
    const domainSnapshot = structuredClone(domainInput);
    const recordInput = toOutcomeRecord(domainInput);
    const recordSnapshot = structuredClone(recordInput);
    toOutcomeRecord(domainInput);
    toOutcomeDomain(recordInput);
    assert.deepEqual(domainInput, domainSnapshot);
    assert.deepEqual(recordInput, recordSnapshot);
  });
});

describe("in-memory season repository", () => {
  test("saves and retrieves a season", async () => {
    const repository = new InMemorySeasonRepository();
    const original = season();
    assert.deepEqual(valueOf(await repository.save(original)), original);
    assert.deepEqual(valueOf(await repository.findById(original.id)), original);
  });

  test("replaces an existing record with the same ID", async () => {
    const repository = new InMemorySeasonRepository();
    await repository.save(season());
    await repository.save(season({ name: "Revised season", updatedAt: "2026-07-13T12:00:00.000Z" }));
    assert.equal(valueOf(await repository.findById("season-1"))?.name, "Revised season");
  });

  test("lists by start date and then ID regardless of insertion order", async () => {
    const repository = new InMemorySeasonRepository();
    await repository.save(season({ id: "c", dates: { startDate: "2026-08-01", endDate: "2026-09-01" } }));
    await repository.save(season({ id: "b" }));
    await repository.save(season({ id: "a" }));
    assert.deepEqual(valueOf(await repository.list()).map((item) => item.id), ["a", "b", "c"]);
  });

  test("returns null for a missing season", async () => {
    assert.equal(valueOf(await new InMemorySeasonRepository().findById("missing")), null);
  });

  test("isolates stored state from input and returned references", async () => {
    const repository = new InMemorySeasonRepository();
    const original = season();
    await repository.save(original);
    original.dates.startDate = "2099-01-01";
    const first = valueOf(await repository.findById("season-1"));
    assert.ok(first);
    first.dates.startDate = "2088-01-01";
    assert.equal(valueOf(await repository.findById("season-1"))?.dates.startDate, "2026-07-01");
  });

  test("does not share state between repository instances", async () => {
    const first = new InMemorySeasonRepository();
    const second = new InMemorySeasonRepository();
    await first.save(season());
    assert.equal(valueOf(await second.findById("season-1")), null);
  });

  test("returns invalid-record errors for malformed domain input", async () => {
    const malformed = season({ status: "bad" as Season["status"] });
    const result = await new InMemorySeasonRepository().save(malformed);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "invalid_record");
  });
});

describe("in-memory goal repository", () => {
  test("saves, retrieves, and replaces goals", async () => {
    const repository = new InMemoryGoalRepository();
    await repository.save(goal());
    await repository.save(goal({ title: "Updated goal" }));
    assert.equal(valueOf(await repository.findById("goal-1"))?.title, "Updated goal");
  });

  test("lists only goals for the requested season", async () => {
    const repository = new InMemoryGoalRepository();
    await repository.save(goal({ id: "goal-b", seasonId: "season-2" }));
    await repository.save(goal({ id: "goal-a", seasonId: "season-1" }));
    assert.deepEqual(valueOf(await repository.listBySeasonId("season-1")).map((item) => item.id), ["goal-a"]);
  });

  test("orders goals by creation timestamp and then ID", async () => {
    const repository = new InMemoryGoalRepository();
    await repository.save(goal({ id: "b" }));
    await repository.save(goal({ id: "c", createdAt: "2026-06-01T12:00:00.000Z" }));
    await repository.save(goal({ id: "a" }));
    assert.deepEqual(valueOf(await repository.listBySeasonId("season-1")).map((item) => item.id), ["c", "a", "b"]);
  });

  test("isolates returned goal references", async () => {
    const repository = new InMemoryGoalRepository();
    await repository.save(goal());
    const returned = valueOf(await repository.findById("goal-1"));
    assert.ok(returned);
    returned.title = "Mutated";
    assert.equal(valueOf(await repository.findById("goal-1"))?.title, "Ship the foundation");
  });
});

describe("in-memory outcome repository", () => {
  test("saves, retrieves, and replaces outcomes", async () => {
    const repository = new InMemoryOutcomeRepository();
    await repository.save(outcome());
    await repository.save(outcome({ description: "Updated outcome" }));
    assert.equal(valueOf(await repository.findById("outcome-1"))?.description, "Updated outcome");
  });

  test("lists only outcomes for the requested goal in ID order", async () => {
    const repository = new InMemoryOutcomeRepository();
    await repository.save(outcome({ id: "b", goalId: "goal-1" }));
    await repository.save(outcome({ id: "c", goalId: "goal-2" }));
    await repository.save(outcome({ id: "a", goalId: "goal-1" }));
    assert.deepEqual(valueOf(await repository.listByGoalId("goal-1")).map((item) => item.id), ["a", "b"]);
  });

  test("preserves over-target raw progress values", async () => {
    const repository = new InMemoryOutcomeRepository();
    await repository.save(outcome());
    assert.equal(valueOf(await repository.findById("outcome-1"))?.progress?.value, 125);
  });

  test("isolates nested progress references", async () => {
    const repository = new InMemoryOutcomeRepository();
    const original = outcome();
    await repository.save(original);
    if (original.progress) original.progress.value = 0;
    const returned = valueOf(await repository.findById("outcome-1"));
    assert.equal(returned?.progress?.value, 125);
    if (returned?.progress) returned.progress.value = 50;
    assert.equal(valueOf(await repository.findById("outcome-1"))?.progress?.value, 125);
  });
});

describe("in-memory milestone repository", () => {
  test("saves, retrieves, and replaces milestones", async () => {
    const repository = new InMemoryMilestoneRepository();
    await repository.save(milestone());
    await repository.save(milestone({ status: "skipped", completedAt: undefined, skippedAt: updatedAt }));
    assert.equal(valueOf(await repository.findById("milestone-1"))?.status, "skipped");
  });

  test("lists only milestones for the requested goal in ID order", async () => {
    const repository = new InMemoryMilestoneRepository();
    await repository.save(milestone({ id: "b" }));
    await repository.save(milestone({ id: "c", goalId: "goal-2" }));
    await repository.save(milestone({ id: "a" }));
    assert.deepEqual(valueOf(await repository.listByGoalId("goal-1")).map((item) => item.id), ["a", "b"]);
  });

  test("returns null for a missing milestone", async () => {
    assert.equal(valueOf(await new InMemoryMilestoneRepository().findById("missing")), null);
  });
});

describe("in-memory planning unit of work", () => {
  test("groups all planning repositories", async () => {
    const unit = new InMemoryPlanningUnitOfWork();
    await unit.seasons.save(season());
    await unit.goals.save(goal());
    await unit.outcomes.save(outcome());
    await unit.milestones.save(milestone());
    assert.equal(valueOf(await unit.seasons.findById("season-1"))?.id, "season-1");
    assert.equal(valueOf(await unit.goals.findById("goal-1"))?.id, "goal-1");
  });

  test("does not share state between unit-of-work instances", async () => {
    const first = new InMemoryPlanningUnitOfWork();
    const second = new InMemoryPlanningUnitOfWork();
    await first.seasons.save(season());
    assert.equal(valueOf(await second.seasons.findById("season-1")), null);
  });
});
