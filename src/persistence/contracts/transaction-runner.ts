import type { SeasonSetupDraftId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { PersistenceResult } from "../errors";
import type { PlanningUnitOfWork } from "./unit-of-work";
import type { SeasonReviewRepository } from "./season-review-repository";
import type { SeasonSetupDraftRepository } from "./season-setup-draft-repository";

export interface WorkflowRepositories {
  setupDrafts: SeasonSetupDraftRepository;
  reviews: SeasonReviewRepository;
  lockSetupDraft(ownerId:AccountOwnerId,id: SeasonSetupDraftId): Promise<PersistenceResult<void>>;
}

export interface TransactionContext {
  planning: PlanningUnitOfWork;
  workflow: WorkflowRepositories;
}

export interface PlanningTransactionRunner {
  runInTransaction<T>(operation: (context: TransactionContext) => Promise<PersistenceResult<T>>): Promise<PersistenceResult<T>>;
}
