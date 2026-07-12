import { applicationFailure, applicationSuccess, type ApplicationResult } from "../errors";
import type { SeasonReviewAssistant, SeasonReviewAssistantRequest, SeasonSetupAssistant, SeasonSetupAssistantRequest, SeasonSetupSuggestion } from "./contracts";
import type { SeasonReviewSummaryProposal } from "../../domain";
function failure<T>(code:string,message:string):ApplicationResult<T>{return applicationFailure({code:code==="unavailable"?"assistant_unavailable":"assistant_failure",message});}
const object=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null;
function validSetup(v:unknown):v is SeasonSetupSuggestion{return object(v)&&typeof v.rationale==="string"&&Array.isArray(v.priorityIdeas)&&Array.isArray(v.proposedGoals)&&Array.isArray(v.observations);}
function validReview(v:unknown):v is SeasonReviewSummaryProposal{return object(v)&&typeof v.executiveSummary==="string"&&Array.isArray(v.observations)&&Array.isArray(v.carryForwardCandidates);}
export async function requestSeasonSetupSuggestion(a:SeasonSetupAssistant,r:SeasonSetupAssistantRequest):Promise<ApplicationResult<SeasonSetupSuggestion>>{const x=await a.propose(r);if(!x.ok)return failure(x.error.code,x.error.message);return validSetup(x.value)?applicationSuccess(x.value):failure("invalid_response","Assistant returned an invalid setup proposal.");}
export async function requestSeasonReviewSummary(a:SeasonReviewAssistant,r:SeasonReviewAssistantRequest):Promise<ApplicationResult<SeasonReviewSummaryProposal>>{const x=await a.proposeSummary(r);if(!x.ok)return failure(x.error.code,x.error.message);return validReview(x.value)?applicationSuccess(x.value):failure("invalid_response","Assistant returned an invalid review proposal.");}
