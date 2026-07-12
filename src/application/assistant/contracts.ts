import type { SeasonReviewSummaryProposal, SeasonSetupDraft } from "../../domain";

export type AssistantErrorCode = "unavailable" | "invalid_response" | "provider_failure";
export type AssistantResult<T> = { ok:true; value:T } | { ok:false; error:{code:AssistantErrorCode; message:string} };
export type SeasonSetupAssistantMode = "clarify_intent" | "suggest_priorities" | "suggest_goals" | "challenge_scope";
export interface SeasonSetupAssistantRequest { mode:SeasonSetupAssistantMode; draft:SeasonSetupDraft; }
export interface SeasonSetupSuggestion {
  rationale:string;
  priorityIdeas:{id:string;text:string}[];
  proposedGoals:{id:string;text:string}[];
  observations:string[];
}
export interface SeasonSetupAssistant { propose(request:SeasonSetupAssistantRequest):Promise<AssistantResult<SeasonSetupSuggestion>>; }
export interface ReviewDataAvailability { weeklyReflections:"available"|"unavailable"; dailyCheckIns:"available"|"unavailable"; completionHistory:"available"|"unavailable"; }
export interface SeasonReviewAssistantRequest { season:{id:string;name:string;status:string;intent?:string}; userContent:{highlights:string;challenges:string;lessons:string;nextSeasonConsiderations:string}; planningOverview:unknown; availability:ReviewDataAvailability; }
export interface SeasonReviewAssistant { proposeSummary(request:SeasonReviewAssistantRequest):Promise<AssistantResult<SeasonReviewSummaryProposal>>; }
