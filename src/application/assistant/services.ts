import { applicationFailure, applicationSuccess, type ApplicationResult } from "../errors";
import type { SeasonReviewAssistant, SeasonReviewAssistantRequest, SeasonSetupAssistant, SeasonSetupAssistantRequest, SeasonSetupSuggestion } from "./contracts";
import type { SeasonReviewSummaryProposal } from "../../domain";
function failure<T>(code:string,message:string):ApplicationResult<T>{return applicationFailure({code:code==="unavailable"?"assistant_unavailable":"assistant_failure",message});}
export async function requestSeasonSetupSuggestion(a:SeasonSetupAssistant,r:SeasonSetupAssistantRequest):Promise<ApplicationResult<SeasonSetupSuggestion>>{const x=await a.propose(r);return x.ok?applicationSuccess(x.value):failure(x.error.code,x.error.message);}
export async function requestSeasonReviewSummary(a:SeasonReviewAssistant,r:SeasonReviewAssistantRequest):Promise<ApplicationResult<SeasonReviewSummaryProposal>>{const x=await a.proposeSummary(r);return x.ok?applicationSuccess(x.value):failure(x.error.code,x.error.message);}
