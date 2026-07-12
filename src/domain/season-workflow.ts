import type { CalendarDate, CarryForwardInsightId, SeasonId, SeasonSetupDraftId, Timestamp, WorkflowItemId } from "./shared";

export type WorkflowContentSource = "user" | "assistant";
export type SeasonSetupStatus = "draft" | "ready_for_review" | "confirmed" | "converted" | "abandoned";

export interface SourcedWorkflowItem { id: WorkflowItemId; text: string; source: WorkflowContentSource; }
export interface ProposedOutcome extends SourcedWorkflowItem { targetValue?: number | boolean; unit?: string; }
export interface ProposedGoal extends SourcedWorkflowItem { outcomeIds: WorkflowItemId[]; }
export interface SupportingStructure extends SourcedWorkflowItem {
  kind: "milestone" | "habit" | "recurring_action" | "project";
  proposedGoalId?: WorkflowItemId;
  dueDate?: CalendarDate;
}
export interface SetupCarryForwardContext { insightId: CarryForwardInsightId; insight: string; sourceSeasonId: string; }

export interface SeasonSetupDraft {
  id: SeasonSetupDraftId;
  status: SeasonSetupStatus;
  title: string;
  startDate?: CalendarDate;
  endDate?: CalendarDate;
  intent?: string;
  priorityIdeas: SourcedWorkflowItem[];
  proposedGoals: ProposedGoal[];
  proposedOutcomes: ProposedOutcome[];
  supportingStructures: SupportingStructure[];
  constraints: SourcedWorkflowItem[];
  openQuestions: SourcedWorkflowItem[];
  carryForwardContext: SetupCarryForwardContext[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  convertedAt?: Timestamp;
  targetSeasonId?: SeasonId;
}

export interface SetupReadinessIssue { code: string; message: string; field?: string; }
export interface SetupReadiness { ready: boolean; blockers: SetupReadinessIssue[]; warnings: SetupReadinessIssue[]; }

export interface SeasonSetupConversionPlan {
  draftId: SeasonSetupDraftId;
  season: { title: string; startDate: CalendarDate; endDate: CalendarDate };
  goals: { proposalId: WorkflowItemId; title: string; outcomeProposalIds: WorkflowItemId[] }[];
  outcomes: { proposalId: WorkflowItemId; title: string; targetValue?: number; unit?: string }[];
  milestones: { proposalId: WorkflowItemId; title: string; goalProposalId?: WorkflowItemId; dueDate?: CalendarDate }[];
  unsupportedStructures: SupportingStructure[];
}
