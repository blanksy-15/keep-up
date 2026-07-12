import type { SeasonSetupDraftId, SeasonReviewId, WorkflowItemId } from "../../domain/shared";
import type { SeasonReviewRepository, SeasonSetupDraftRepository, SeasonRepository } from "../../persistence/contracts";
import type { Clock } from "../contracts";
export interface WorkflowIdGenerator { nextSetupDraftId():SeasonSetupDraftId; nextWorkflowItemId():WorkflowItemId; nextSeasonReviewId():SeasonReviewId; nextCarryForwardInsightId():string; }
export interface SeasonWorkflowDependencies { setupDrafts:SeasonSetupDraftRepository; reviews:SeasonReviewRepository; seasons:SeasonRepository; clock:Clock; ids:WorkflowIdGenerator; }
