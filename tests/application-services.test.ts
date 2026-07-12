import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  abandonGoal,
  activateGoal,
  activateSeason,
  archiveSeason,
  completeGoal,
  completeSeason,
  createGoal,
  createSeason,
  getSeasonOverview,
  pauseGoal,
  resumeGoal,
  updateMilestoneStatus,
  updateOutcomeProgress,
  type PlanningApplicationDependencies,
} from "../src/application";
import type { PlanningUnitOfWork } from "../src/persistence";
import { persistenceFailure, persistenceSuccess } from "../src/persistence";
import {
  createTestContext,
  fixedTimestamp,
  goalFixture,
  milestoneFixture,
  outcomeFixture,
  seasonFixture,
  valueOf,
} from "./support/planning-fixtures";

async function seedActiveGoal() {
  const context = createTestContext();
  await context.persistence.seasons.save(seasonFixture({ status: "active", activatedAt: fixedTimestamp }));
  await context.persistence.goals.save(goalFixture({ status: "active", activatedAt: fixedTimestamp }));
  await context.persistence.outcomes.save(outcomeFixture());
  await context.persistence.milestones.save(milestoneFixture());
  return context;
}

describe("create season", () => {
  test("creates and saves a deterministic draft season", async () => {
    const { dependencies, persistence } = createTestContext();
    const result = await createSeason(dependencies, {
      title: " New season ", intent: " Focus clearly ", startDate: "2026-08-01", endDate: "2026-10-31",
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.id, "season-generated-1");
      assert.equal(result.value.status, "draft");
      assert.equal(result.value.createdAt, fixedTimestamp);
      assert.equal(result.value.name, "New season");
    }
    assert.equal(valueOf(await persistence.seasons.findById("season-generated-1"))?.id, "season-generated-1");
  });

  test("rejects missing title", async () => {
    const { dependencies } = createTestContext();
    const result = await createSeason(dependencies, { title: " ", intent: "Focus", startDate: "2026-08-01", endDate: "2026-10-31" });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].field, "title");
  });

  test("rejects missing intent", async () => {
    const { dependencies } = createTestContext();
    const result = await createSeason(dependencies, { title: "Season", intent: " ", startDate: "2026-08-01", endDate: "2026-10-31" });
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field === "intent"));
  });

  test("rejects invalid date ranges without saving", async () => {
    const { dependencies, persistence } = createTestContext();
    const result = await createSeason(dependencies, { title: "Season", intent: "Focus", startDate: "2026-11-01", endDate: "2026-10-31" });
    assert.equal(result.ok, false);
    assert.equal(valueOf(await persistence.seasons.list()).length, 0);
  });
});

describe("create goal", () => {
  test("creates a draft goal under draft and active seasons", async () => {
    for (const status of ["draft", "active"] as const) {
      const { dependencies, persistence } = createTestContext();
      await persistence.seasons.save(seasonFixture({ status }));
      const result = await createGoal(dependencies, { seasonId: "season-1", title: " New goal ", description: " Clear intent " });
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.value.status, "draft");
        assert.equal(result.value.seasonId, "season-1");
        assert.equal(result.value.id, "goal-generated-1");
      }
    }
  });

  test("returns not found for a missing season", async () => {
    const { dependencies } = createTestContext();
    const result = await createGoal(dependencies, { seasonId: "missing", title: "Goal", description: "Intent" });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "not_found");
  });

  test("rejects completed and archived parent seasons", async () => {
    for (const status of ["completed", "archived"] as const) {
      const { dependencies, persistence } = createTestContext();
      await persistence.seasons.save(seasonFixture({ status }));
      const result = await createGoal(dependencies, { seasonId: "season-1", title: "Goal", description: "Intent" });
      assert.equal(result.ok, false);
      assert.equal(valueOf(await persistence.goals.listBySeasonId("season-1")).length, 0);
    }
  });
});

describe("season lifecycle services", () => {
  test("loads goals/outcomes and activates a valid season", async () => {
    const { dependencies, persistence } = createTestContext();
    await persistence.seasons.save(seasonFixture());
    await persistence.goals.save(goalFixture());
    await persistence.outcomes.save(outcomeFixture({ progress: undefined }));
    const result = await activateSeason(dependencies, "season-1");
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.status, "active");
  });

  test("returns validation errors and does not write when goals are missing", async () => {
    const { dependencies, persistence } = createTestContext();
    await persistence.seasons.save(seasonFixture());
    const result = await activateSeason(dependencies, "season-1");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "validation_failed");
    assert.equal(valueOf(await persistence.seasons.findById("season-1"))?.status, "draft");
  });

  test("rejects activation when a goal is not activation-ready", async () => {
    const { dependencies, persistence } = createTestContext();
    await persistence.seasons.save(seasonFixture());
    await persistence.goals.save(goalFixture({ description: undefined }));
    await persistence.outcomes.save(outcomeFixture());
    const result = await activateSeason(dependencies, "season-1");
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field?.includes("description")));
  });

  test("returns not found for a missing season", async () => {
    const { dependencies } = createTestContext();
    const result = await activateSeason(dependencies, "missing");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "not_found");
  });

  test("completes an active season without completing its goals", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    const result = await completeSeason(dependencies, "season-1");
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.status, "completed");
    assert.equal(valueOf(await persistence.goals.findById("goal-1"))?.status, "active");
  });

  test("rejects invalid completion and archives valid states without deleting children", async () => {
    const { dependencies, persistence } = createTestContext();
    await persistence.seasons.save(seasonFixture());
    await persistence.goals.save(goalFixture());
    const invalid = await completeSeason(dependencies, "season-1");
    assert.equal(invalid.ok, false);
    if (!invalid.ok) assert.equal(invalid.errors[0].code, "invalid_transition");
    const archived = await archiveSeason(dependencies, "season-1");
    assert.equal(archived.ok && archived.value.status, "archived");
    assert.ok(valueOf(await persistence.goals.findById("goal-1")));
  });
});

describe("goal lifecycle services", () => {
  test("activates, pauses, resumes, completes, and abandons through domain behavior", async () => {
    const { dependencies, persistence } = createTestContext();
    await persistence.seasons.save(seasonFixture({ status: "active" }));
    await persistence.goals.save(goalFixture());
    await persistence.outcomes.save(outcomeFixture());
    assert.equal((await activateGoal(dependencies, "goal-1")).ok, true);
    assert.equal((await pauseGoal(dependencies, "goal-1")).ok, true);
    assert.equal((await resumeGoal(dependencies, "goal-1")).ok, true);
    assert.equal((await completeGoal(dependencies, "goal-1")).ok, true);

    await persistence.goals.save(goalFixture({ id: "goal-2", status: "active" }));
    assert.equal((await abandonGoal(dependencies, "goal-2")).ok, true);
  });

  test("rejects every goal mutation under completed or archived seasons", async () => {
    for (const status of ["completed", "archived"] as const) {
      const { dependencies, persistence } = createTestContext();
      await persistence.seasons.save(seasonFixture({ status }));
      await persistence.goals.save(goalFixture({ status: "active" }));
      const result = await pauseGoal(dependencies, "goal-1");
      assert.equal(result.ok, false);
      assert.equal(valueOf(await persistence.goals.findById("goal-1"))?.status, "active");
    }
  });

  test("does not write after a domain transition failure", async () => {
    const { dependencies, persistence } = createTestContext();
    await persistence.seasons.save(seasonFixture());
    await persistence.goals.save(goalFixture());
    const result = await pauseGoal(dependencies, "goal-1");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "invalid_transition");
    assert.equal(valueOf(await persistence.goals.findById("goal-1"))?.status, "draft");
  });
});

describe("outcome progress service", () => {
  test("updates numeric progress, preserves over-target raw value, and returns normalization", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    const result = await updateOutcomeProgress(dependencies, { outcomeId: "outcome-1", currentValue: 125 });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.outcome.progress?.value, 125);
      assert.equal(result.value.calculation.normalizedProgress, 100);
      assert.equal(result.value.calculation.isComplete, true);
    }
    assert.equal(valueOf(await persistence.goals.findById("goal-1"))?.status, "active");
  });

  test("rejects invalid progress without changing the stored outcome", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    const result = await updateOutcomeProgress(dependencies, { outcomeId: "outcome-1", currentValue: -1 });
    assert.equal(result.ok, false);
    assert.equal(valueOf(await persistence.outcomes.findById("outcome-1"))?.progress?.value, 25);
  });

  test("rejects progress for draft, paused, completed, and abandoned goals", async () => {
    for (const status of ["draft", "paused", "completed", "abandoned"] as const) {
      const { dependencies, persistence } = await seedActiveGoal();
      await persistence.goals.save(goalFixture({ status }));
      const result = await updateOutcomeProgress(dependencies, { outcomeId: "outcome-1", currentValue: 50 });
      assert.equal(result.ok, false);
    }
  });

  test("rejects progress under completed seasons", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    await persistence.seasons.save(seasonFixture({ status: "completed" }));
    assert.equal((await updateOutcomeProgress(dependencies, { outcomeId: "outcome-1", currentValue: 50 })).ok, false);
  });

  test("requires boolean input for boolean outcomes", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    await persistence.outcomes.save(outcomeFixture({ type: "boolean", targetValue: undefined, progress: { value: 0, recordedAt: fixedTimestamp } }));
    assert.equal((await updateOutcomeProgress(dependencies, { outcomeId: "outcome-1", currentValue: 1 })).ok, false);
    const valid = await updateOutcomeProgress(dependencies, { outcomeId: "outcome-1", currentValue: true });
    assert.equal(valid.ok && valid.value.calculation.normalizedProgress, 100);
  });
});

describe("milestone status service", () => {
  test("applies a valid transition without completing the goal", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    const result = await updateMilestoneStatus(dependencies, { milestoneId: "milestone-1", status: "completed" });
    assert.equal(result.ok && result.value.status, "completed");
    assert.equal(valueOf(await persistence.goals.findById("goal-1"))?.status, "active");
  });

  test("rejects invalid transitions and terminal parent states", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    await persistence.milestones.save(milestoneFixture({ status: "completed", completedAt: fixedTimestamp }));
    assert.equal((await updateMilestoneStatus(dependencies, { milestoneId: "milestone-1", status: "in_progress" })).ok, false);
    await persistence.goals.save(goalFixture({ status: "paused" }));
    assert.equal((await updateMilestoneStatus(dependencies, { milestoneId: "milestone-1", status: "completed" })).ok, false);
  });

  test("rejects milestone updates under a completed season", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    await persistence.seasons.save(seasonFixture({ status: "completed" }));
    assert.equal((await updateMilestoneStatus(dependencies, { milestoneId: "milestone-1", status: "completed" })).ok, false);
  });
});

describe("season overview", () => {
  test("loads an ordered graph and reuses domain summaries", async () => {
    const { dependencies, persistence } = await seedActiveGoal();
    await persistence.goals.save(goalFixture({ id: "goal-2", status: "paused", createdAt: "2026-07-12T12:00:00.000Z" }));
    await persistence.outcomes.save(outcomeFixture({ id: "outcome-2", goalId: "goal-2", progress: { value: 50, recordedAt: fixedTimestamp } }));
    const result = await getSeasonOverview(dependencies, "season-1");
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.value.goals.map((item) => item.goal.id), ["goal-1", "goal-2"]);
      assert.equal(result.value.goals[0].summary.outcomeCount, 1);
      assert.equal(result.value.summary.goalCount, 2);
      assert.equal(result.value.summary.averageGoalProgress, 37.5);
    }
  });

  test("returns not found for a missing season", async () => {
    const { dependencies } = createTestContext();
    const result = await getSeasonOverview(dependencies, "missing");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "not_found");
  });

  test("returned changes do not mutate repository state", async () => {
    const { dependencies } = await seedActiveGoal();
    const first = valueOf(await getSeasonOverview(dependencies, "season-1"));
    first.season.name = "Mutated";
    first.goals[0].goal.title = "Mutated";
    const second = valueOf(await getSeasonOverview(dependencies, "season-1"));
    assert.equal(second.season.name, "Build with intention");
    assert.equal(second.goals[0].goal.title, "Ship the foundation");
  });

  test("returns an integrity failure for inconsistent repository relationships", async () => {
    const { dependencies, persistence } = createTestContext();
    await persistence.seasons.save(seasonFixture());
    const inconsistent: PlanningUnitOfWork = {
      ...persistence,
      goals: {
        findById: (id) => persistence.goals.findById(id),
        save: (value) => persistence.goals.save(value),
        listBySeasonId: async () => persistenceSuccess([goalFixture({ seasonId: "other-season" })]),
      },
    };
    const result = await getSeasonOverview({ ...dependencies, persistence: inconsistent }, "season-1");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "integrity_failure");
  });
});

describe("application error mapping", () => {
  test("maps persistence failures without exposing implementation messages", async () => {
    const { dependencies, persistence } = createTestContext();
    const failingPersistence: PlanningUnitOfWork = {
      goals: persistence.goals,
      outcomes: persistence.outcomes,
      milestones: persistence.milestones,
      seasons: {
        findById: async () => persistenceFailure({ code: "storage_failure", message: "vendor secret" }),
        list: () => persistence.seasons.list(),
        save: (value) => persistence.seasons.save(value),
      },
    };
    const failingDependencies: PlanningApplicationDependencies = { ...dependencies, persistence: failingPersistence };
    const result = await createGoal(failingDependencies, { seasonId: "season-1", title: "Goal", description: "Intent" });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.errors[0].code, "persistence_failure");
      assert.equal(result.errors[0].message.includes("vendor"), false);
    }
  });
});
