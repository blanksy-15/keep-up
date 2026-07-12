import { scopeSeasonWorkflowDependencies,type AssistantResult, type SeasonReviewAssistant, type SeasonReviewAssistantRequest, type SeasonSetupAssistant, type SeasonSetupAssistantRequest, type SeasonSetupSuggestion, type SeasonWorkflowDependencies, type WorkflowIdGenerator } from "../../src/application";
import type { SeasonReviewSummaryProposal } from "../../src/domain";
import { InMemorySeasonRepository, InMemorySeasonReviewRepository, InMemorySeasonSetupDraftRepository } from "../../src/persistence";
import { FixedClock } from "./planning-fixtures";
class WorkflowIds implements WorkflowIdGenerator {
  #n=0; nextSetupDraftId(){return `setup-${++this.#n}`;} nextWorkflowItemId(){return `item-${++this.#n}`;} nextSeasonReviewId(){return `review-${++this.#n}`;} nextCarryForwardInsightId(){return `insight-${++this.#n}`;}
}
export function workflowContext():SeasonWorkflowDependencies{return scopeSeasonWorkflowDependencies("owner-a",{setupDrafts:new InMemorySeasonSetupDraftRepository(),reviews:new InMemorySeasonReviewRepository(),seasons:new InMemorySeasonRepository(),clock:new FixedClock(),ids:new WorkflowIds()});}
export class DeterministicAssistant implements SeasonSetupAssistant,SeasonReviewAssistant {
  constructor(readonly available=true){}
  async propose(request:SeasonSetupAssistantRequest):Promise<AssistantResult<SeasonSetupSuggestion>>{void request;return this.available?{ok:true,value:{rationale:"Focus",priorityIdeas:[{id:"p1",text:"Protect focus"}],proposedGoals:[{id:"g1",text:"Ship one durable result"}],observations:["Scope is a choice."]}}:{ok:false,error:{code:"unavailable",message:"Assistant unavailable."}};}
  async proposeSummary(request:SeasonReviewAssistantRequest):Promise<AssistantResult<SeasonReviewSummaryProposal>>{void request;return {ok:true,value:{executiveSummary:"A season of deliberate progress.",observations:["Focus helped."],carryForwardCandidates:[{id:"c1",insight:"Keep weekly scope small."}]}};}
}
