import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  calculateMilestoneProgress,
  calculateOutcomeProgress,
  summarizeSeason,
  transitionGoal,
  transitionMilestone,
  transitionSeason,
  validateGoalActivation,
  validateSeasonActivation,
  type Goal,
  type Milestone,
  type Outcome,
  type Season,
} from "../src/domain";

const createdAt = "2026-07-01T12:00:00.000Z";
const transitionedAt = "2026-07-11T12:00:00.000Z";

function season(overrides: Partial<Season> = {}): Season {
  return {
    id: "season-1",
    name: "Build with intention",
    dates: { startDate: "2026-07-01", endDate: "2026-09-30" },
    status: "draft",
    intent: { statement: "Choose fewer commitments and finish them well." },
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

function goal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: "goal-1",
    seasonId: "season-1",
    title: "Ship the foundation",
    description: "Create a durable foundation for the product.",
    status: "draft",
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

function outcome(overrides: Partial<Outcome> = {}): Outcome {
  return {
    id: "outcome-1",
    goalId: "goal-1",
    description: "Complete the foundation milestones",
    type: "numeric",
    targetValue: 100,
    progress: { value: 30, recordedAt: createdAt },
    ...overrides,
  };
}

function milestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: "milestone-1",
    goalId: "goal-1",
    title: "Define the domain",
    status: "not_started",
    ...overrides,
  };
}

const activationContext = () => ({
  goals: [goal()],
  outcomesByGoal: { "goal-1": [outcome()] },
});

describe("season lifecycle", () => {
  test("transitions a valid draft season to active", () => {
    const result = transitionSeason(season(), "active", transitionedAt, activationContext());
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.status, "active");
      assert.equal(result.value.activatedAt, transitionedAt);
    }
  });

  test("rejects draft to completed", () => {
    const result = transitionSeason(season(), "completed", transitionedAt);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, "invalid_transition");
  });

  test("transitions active to completed", () => {
    const result = transitionSeason(season({ status: "active", activatedAt: createdAt }), "completed", transitionedAt);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.completedAt, transitionedAt);
  });

  test("rejects completed to active", () => {
    const result = transitionSeason(season({ status: "completed", completedAt: createdAt }), "active", transitionedAt, activationContext());
    assert.equal(result.ok, false);
  });

  test("preserves completion timestamp when archiving", () => {
    const result = transitionSeason(season({ status: "completed", completedAt: createdAt }), "archived", transitionedAt);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.completedAt, createdAt);
      assert.equal(result.value.archivedAt, transitionedAt);
    }
  });

  test("does not mutate its input", () => {
    const input = season();
    const snapshot = structuredClone(input);
    transitionSeason(input, "active", transitionedAt, activationContext());
    assert.deepEqual(input, snapshot);
  });
});

describe("goal lifecycle", () => {
  test("transitions draft to active", () => {
    const result = transitionGoal(goal(), "active", transitionedAt, [outcome()]);
    assert.equal(result.ok, true);
  });

  test("transitions active to paused", () => {
    const result = transitionGoal(goal({ status: "active" }), "paused", transitionedAt);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.pausedAt, transitionedAt);
  });

  test("transitions paused to active", () => {
    const result = transitionGoal(goal({ status: "paused", activatedAt: createdAt }), "active", transitionedAt, [outcome()]);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.activatedAt, createdAt);
  });

  test("transitions active to completed explicitly", () => {
    const result = transitionGoal(goal({ status: "active" }), "completed", transitionedAt);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.completedAt, transitionedAt);
  });

  test("rejects completed to active", () => {
    assert.equal(transitionGoal(goal({ status: "completed" }), "active", transitionedAt, [outcome()]).ok, false);
  });

  test("rejects abandoned to active", () => {
    assert.equal(transitionGoal(goal({ status: "abandoned" }), "active", transitionedAt, [outcome()]).ok, false);
  });

  test("does not mutate its input", () => {
    const input = goal({ status: "active" });
    const snapshot = structuredClone(input);
    transitionGoal(input, "completed", transitionedAt);
    assert.deepEqual(input, snapshot);
  });
});

describe("activation validation", () => {
  test("accepts a valid season with activation-ready draft goals", () => {
    assert.equal(validateSeasonActivation(season(), activationContext()).ok, true);
  });

  test("rejects a missing season title", () => {
    const result = validateSeasonActivation(season({ name: " " }), activationContext());
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field === "name"));
  });

  test("rejects an invalid season date range", () => {
    const result = validateSeasonActivation(season({ dates: { startDate: "2026-10-01", endDate: "2026-09-01" } }), activationContext());
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field === "dates"));
  });

  test("rejects missing season intent", () => {
    const result = validateSeasonActivation(season({ intent: undefined }), activationContext());
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field === "intent"));
  });

  test("rejects a season with no goals", () => {
    const result = validateSeasonActivation(season(), { goals: [], outcomesByGoal: {} });
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field === "goals"));
  });

  test("rejects a goal with no outcome", () => {
    const result = validateGoalActivation(goal(), []);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.some((error) => error.field === "outcomes"));
  });
});

describe("outcome progress", () => {
  test("calculates boolean false and true", () => {
    const no = calculateOutcomeProgress(outcome({ type: "boolean", targetValue: undefined, progress: { value: 0, recordedAt: createdAt } }));
    const yes = calculateOutcomeProgress(outcome({ type: "boolean", targetValue: undefined, progress: { value: 1, recordedAt: createdAt } }));
    assert.equal(no.ok && no.value.normalizedProgress, 0);
    assert.equal(yes.ok && yes.value.normalizedProgress, 100);
  });

  test("calculates numeric target progress", () => {
    const result = calculateOutcomeProgress(outcome());
    assert.equal(result.ok && result.value.normalizedProgress, 30);
  });

  test("calculates count progress", () => {
    const result = calculateOutcomeProgress(outcome({ type: "count", targetValue: 8, progress: { value: 2, recordedAt: createdAt } }));
    assert.equal(result.ok && result.value.normalizedProgress, 25);
  });

  test("calculates percentage progress", () => {
    const result = calculateOutcomeProgress(outcome({ type: "percentage", targetValue: undefined, progress: { value: 65, recordedAt: createdAt } }));
    assert.equal(result.ok && result.value.normalizedProgress, 65);
  });

  test("preserves raw over-target values while clamping display progress", () => {
    const result = calculateOutcomeProgress(outcome({ progress: { value: 125, recordedAt: createdAt } }));
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.value, { rawValue: 125, normalizedProgress: 100, isComplete: true });
  });

  test("rejects a zero target", () => {
    assert.equal(calculateOutcomeProgress(outcome({ targetValue: 0 })).ok, false);
  });

  test("rejects a negative target", () => {
    assert.equal(calculateOutcomeProgress(outcome({ targetValue: -10 })).ok, false);
  });

  test("rejects a negative progress value", () => {
    assert.equal(calculateOutcomeProgress(outcome({ progress: { value: -1, recordedAt: createdAt } })).ok, false);
  });
});

describe("milestones", () => {
  test("allows expected forward transitions", () => {
    assert.equal(transitionMilestone(milestone(), "in_progress", transitionedAt).ok, true);
    assert.equal(transitionMilestone(milestone({ status: "in_progress" }), "completed", transitionedAt).ok, true);
    assert.equal(transitionMilestone(milestone(), "skipped", transitionedAt).ok, true);
  });

  test("rejects completed to in progress", () => {
    assert.equal(transitionMilestone(milestone({ status: "completed" }), "in_progress", transitionedAt).ok, false);
  });

  test("excludes skipped milestones from progress", () => {
    const result = calculateMilestoneProgress([
      milestone({ id: "1", status: "completed" }),
      milestone({ id: "2", status: "not_started" }),
      milestone({ id: "3", status: "skipped" }),
    ]);
    assert.deepEqual(result, { completed: 1, included: 2, skipped: 1, normalizedProgress: 50 });
  });

  test("returns no normalized progress for an empty list", () => {
    assert.deepEqual(calculateMilestoneProgress([]), { completed: 0, included: 0, skipped: 0, normalizedProgress: null });
  });
});

describe("season summaries", () => {
  test("excludes draft goals from active progress", () => {
    const result = summarizeSeason(season(), [{ goal: goal(), outcomes: [outcome()] }]);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.averageGoalProgress, null);
  });

  test("counts abandoned goals historically but excludes them from averages", () => {
    const result = summarizeSeason(season(), [
      { goal: goal({ id: "active", status: "active" }), outcomes: [outcome({ goalId: "active", progress: { value: 50, recordedAt: createdAt } })] },
      { goal: goal({ id: "abandoned", status: "abandoned" }), outcomes: [outcome({ goalId: "abandoned", progress: { value: 100, recordedAt: createdAt } })] },
    ]);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.abandonedGoalCount, 1);
      assert.equal(result.value.averageGoalProgress, 50);
    }
  });

  test("includes completed and paused goals in unweighted progress", () => {
    const result = summarizeSeason(season(), [
      { goal: goal({ id: "done", status: "completed" }), outcomes: [outcome({ goalId: "done", progress: { value: 100, recordedAt: createdAt } })] },
      { goal: goal({ id: "paused", status: "paused" }), outcomes: [outcome({ goalId: "paused", progress: { value: 40, recordedAt: createdAt } })] },
    ]);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.completedGoalCount, 1);
      assert.equal(result.value.pausedGoalCount, 1);
      assert.equal(result.value.averageGoalProgress, 70);
    }
  });

  test("returns explicit empty-season values", () => {
    const result = summarizeSeason(season(), []);
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.value, {
      status: "draft", goalCount: 0, draftGoalCount: 0, activeGoalCount: 0,
      pausedGoalCount: 0, completedGoalCount: 0, abandonedGoalCount: 0,
      outcomeCount: 0, completedOutcomeCount: 0, averageGoalProgress: null,
    });
  });
});
