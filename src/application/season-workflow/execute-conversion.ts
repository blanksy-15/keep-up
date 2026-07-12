import type { Goal, Milestone, Outcome, Season, SeasonSetupDraft, SetupReadiness, SupportingStructure } from "../../domain";
import type { GoalId, MilestoneId, OutcomeId, SeasonId, SeasonSetupDraftId } from "../../domain/shared";
import type { PlanningTransactionRunner } from "../../persistence/contracts";
import { persistenceFailure, persistenceSuccess } from "../../persistence/errors";
import type { Clock, IdGenerator } from "../contracts";
import { applicationFailure, applicationSuccess, mapPersistenceErrors, type ApplicationResult } from "../errors";
import { createSeasonSetupConversionPlan } from "./setup";
import { evaluateSetupReadiness } from "./readiness";

export interface SeasonSetupConversionResult {
  season:Season; goals:Goal[]; outcomes:Outcome[]; milestones:Milestone[]; readiness:SetupReadiness;
  unconvertedItems:SupportingStructure[];
  idMap:{seasonId:SeasonId;goalIdsByProposalId:Record<string,GoalId>;outcomeIdsByProposalId:Record<string,OutcomeId>;milestoneIdsByProposalId:Record<string,MilestoneId>};
}
export interface SetupConversionDependencies {transactions:PlanningTransactionRunner;clock:Clock;ids:IdGenerator;}

export async function executeSeasonSetupConversion(deps:SetupConversionDependencies,draftId:SeasonSetupDraftId):Promise<ApplicationResult<SeasonSetupConversionResult>> {
  const result=await deps.transactions.runInTransaction<SeasonSetupConversionResult>(async context=>{
    const locked=await context.workflow.lockSetupDraft(draftId);if(!locked.ok)return persistenceFailure(...locked.errors);
    const found=await context.workflow.setupDrafts.findById(draftId);if(!found.ok)return persistenceFailure(...found.errors);if(!found.value)return persistenceFailure({code:"invalid_record",message:"Setup draft was not found."});
    const draft=found.value;if(draft.status!=="confirmed")return persistenceFailure({code:"conflict",message:draft.status==="converted"&&draft.targetSeasonId?`Setup draft already converted to ${draft.targetSeasonId}.`:"Setup draft is not confirmed."});
    const readiness=evaluateSetupReadiness(draft);if(!readiness.ready)return persistenceFailure({code:"invalid_record",message:"Confirmed setup draft has readiness blockers."});
    const planned=createSeasonSetupConversionPlan(draft);if(!planned.ok)return persistenceFailure({code:"invalid_record",message:"Conversion plan could not be created."});
    const now=deps.clock.now(),seasonId=deps.ids.nextSeasonId();
    const season:Season={id:seasonId,name:planned.value.season.title,dates:{startDate:planned.value.season.startDate,endDate:planned.value.season.endDate},status:"draft",...(draft.intent?{intent:{statement:draft.intent}}:{}),createdAt:now,updatedAt:now};
    const goalIdsByProposalId:Record<string,GoalId>={},outcomeIdsByProposalId:Record<string,OutcomeId>={},milestoneIdsByProposalId:Record<string,MilestoneId>={};
    const goals:Goal[]=planned.value.goals.map(p=>{const id=deps.ids.nextGoalId();goalIdsByProposalId[p.proposalId]=id;return{id,seasonId,title:p.title,status:"draft",createdAt:now,updatedAt:now};});
    const outcomes:Outcome[]=[];for(const p of draft.proposedOutcomes){const parent=draft.proposedGoals.find(g=>g.outcomeIds.includes(p.id));if(!parent)continue;const id=deps.ids.nextOutcomeId();outcomeIdsByProposalId[p.id]=id;outcomes.push({id,goalId:goalIdsByProposalId[parent.id]!,description:p.text,type:typeof p.targetValue==="boolean"?"boolean":"numeric",...(typeof p.targetValue==="number"?{targetValue:p.targetValue}:{}),...(p.unit?{unit:p.unit}:{})});}
    const milestones:Milestone[]=[],unconvertedItems=[...planned.value.unsupportedStructures];for(const p of draft.supportingStructures.filter(x=>x.kind==="milestone")){const goalId=p.proposedGoalId?goalIdsByProposalId[p.proposedGoalId]:undefined;if(!goalId){unconvertedItems.push(p);continue;}const id=deps.ids.nextMilestoneId();milestoneIdsByProposalId[p.id]=id;milestones.push({id,goalId,title:p.text,status:"not_started",...(p.dueDate?{targetDate:p.dueDate}:{})});}
    const savedSeason=await context.planning.seasons.save(season);if(!savedSeason.ok)return persistenceFailure(...savedSeason.errors);for(const v of goals){const x=await context.planning.goals.save(v);if(!x.ok)return persistenceFailure(...x.errors);}for(const v of outcomes){const x=await context.planning.outcomes.save(v);if(!x.ok)return persistenceFailure(...x.errors);}for(const v of milestones){const x=await context.planning.milestones.save(v);if(!x.ok)return persistenceFailure(...x.errors);}
    const converted:SeasonSetupDraft={...draft,status:"converted",targetSeasonId:seasonId,convertedAt:now,updatedAt:now};const savedDraft=await context.workflow.setupDrafts.save(converted);if(!savedDraft.ok)return persistenceFailure(...savedDraft.errors);
    return persistenceSuccess({season:savedSeason.value,goals,outcomes,milestones,readiness,unconvertedItems,idMap:{seasonId,goalIdsByProposalId,outcomeIdsByProposalId,milestoneIdsByProposalId}});
  });
  if(result.ok)return applicationSuccess(result.value);
  if(result.errors.some(e=>e.code==="conflict"))return applicationFailure({code:"conflict",message:result.errors[0]?.message??"Setup conversion conflicts with existing state."});
  return mapPersistenceErrors(result.errors);
}
