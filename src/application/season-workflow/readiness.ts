import type { SeasonSetupDraft, SetupReadiness } from "../../domain";
export function evaluateSetupReadiness(draft:SeasonSetupDraft):SetupReadiness {
  const blockers:SetupReadiness["blockers"]=[], warnings:SetupReadiness["warnings"]=[];
  if(!draft.title.trim()) blockers.push({code:"missing_title",message:"A season title is required.",field:"title"});
  if(!draft.startDate) blockers.push({code:"missing_start_date",message:"A start date is required.",field:"startDate"});
  if(!draft.endDate) blockers.push({code:"missing_end_date",message:"An end date is required.",field:"endDate"});
  if(draft.startDate&&draft.endDate&&draft.startDate>draft.endDate) blockers.push({code:"invalid_date_range",message:"The end date cannot precede the start date.",field:"endDate"});
  if(!draft.intent?.trim()) blockers.push({code:"missing_intent",message:"A season intent is required.",field:"intent"});
  if(!draft.proposedGoals.length) blockers.push({code:"missing_goals",message:"At least one user-owned proposed goal is required.",field:"proposedGoals"});
  for(const goal of draft.proposedGoals){if(!goal.text.trim())blockers.push({code:"goal_missing_title",message:"Every proposed goal needs a title.",field:"proposedGoals"});if(!goal.outcomeIds.length)blockers.push({code:"goal_missing_outcome",message:`Goal ${goal.id} needs a measurable outcome.`,field:"proposedGoals"});}
  for(const outcome of draft.proposedOutcomes){if(typeof outcome.targetValue==="number"&&outcome.targetValue<=0)blockers.push({code:"invalid_outcome_target",message:`Outcome ${outcome.id} needs a positive target.`,field:"proposedOutcomes"});}
  if(draft.proposedGoals.length>7) warnings.push({code:"broad_scope",message:"More than seven goals may dilute focus.",field:"proposedGoals"});
  if(!draft.priorityIdeas.length) warnings.push({code:"no_priorities",message:"No priority ideas have been recorded.",field:"priorityIdeas"});
  if(!draft.constraints.length) warnings.push({code:"no_constraints",message:"No constraints have been recorded.",field:"constraints"});
  return {ready:blockers.length===0,blockers,warnings};
}
