import "server-only";
import { randomUUID } from "node:crypto";
import { requireAuthenticatedAccount } from "@/auth/session";
import { composePostgresPersistence } from "@/database/composition";
import { scopePlanningPersistence } from "@/application/planning/dependencies";
import { scopeSeasonWorkflowDependencies, type IdGenerator, type Clock } from "@/application";

const clock: Clock = { now: () => new Date().toISOString(), today: () => new Date().toISOString().slice(0, 10) };
const ids: IdGenerator & { nextSetupDraftId(): string; nextWorkflowItemId(): string; nextSeasonReviewId(): string; nextCarryForwardInsightId(): string } = {
  nextSeasonId: randomUUID, nextGoalId: randomUUID, nextOutcomeId: randomUUID, nextMilestoneId: randomUUID,
  nextSetupDraftId: randomUUID, nextWorkflowItemId: randomUUID, nextSeasonReviewId: randomUUID, nextCarryForwardInsightId: randomUUID,
};

export async function planningContext() {
  const account = await requireAuthenticatedAccount();
  const persistence = composePostgresPersistence();
  return {
    account,
    persistence,
    planning: { ownerId: account.ownerId, persistence: scopePlanningPersistence(account.ownerId, persistence.planning), clock, ids },
    workflow: scopeSeasonWorkflowDependencies(account.ownerId, { setupDrafts: persistence.workflow.setupDrafts, reviews: persistence.workflow.reviews, seasons: persistence.planning.seasons, clock, ids }),
    conversion: { ownerId: account.ownerId, transactions: persistence.transactions, clock, ids },
  };
}
