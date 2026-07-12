import test from "node:test";
import assert from "node:assert/strict";
import { addProposedGoal, addProposedOutcome, createSeasonSetupDraft, updateSeasonSetupDetails } from "../src/application";
import { workflowContext } from "./support/workflow-fixtures";
const value = <T>(result: { ok: boolean; value?: T; errors?: unknown[] }) => { assert.equal(result.ok, true); return result.value as T; };

test("guided setup rejects an invalid foundation date range before persistence", async () => {
  const context = workflowContext();
  const draft = value(await createSeasonSetupDraft(context, { title: "Season" }));
  const result = await updateSeasonSetupDetails(context, { draftId: draft.id, startDate: "2026-10-01", endDate: "2026-09-01" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errors[0]?.field, "endDate");
  const stored = value(await context.setupDrafts.findById(draft.id));
  assert.equal(stored?.startDate, undefined);
});

test("guided setup preserves explicit outcome types and unrestricted goals", async () => {
  const context = workflowContext();
  let draft = value(await createSeasonSetupDraft(context, { title: "Season" }));
  draft = value(await addProposedGoal(context, { draftId: draft.id, text: "Learn an unusual subject" }));
  const goal = draft.proposedGoals[0]!;
  draft = value(await addProposedOutcome(context, { draftId: draft.id, goalId: goal.id, text: "Reach 80 percent", type: "percentage", targetValue: 80, unit: "%" }));
  assert.equal(draft.proposedOutcomes[0]?.type, "percentage");
  assert.equal(draft.proposedGoals[0]?.text, "Learn an unusual subject");
});
