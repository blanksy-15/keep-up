import type { PlanningUnitOfWork } from "../../persistence/contracts";
import type { AccountOwnerId, Goal, Milestone, Outcome, Season } from "../../domain";
import type { GoalId,MilestoneId,OutcomeId,SeasonId } from "../../domain/shared";
import type { PersistenceResult } from "../../persistence";
import type { Clock, IdGenerator } from "../contracts";

export interface PlanningApplicationDependencies {
  ownerId:AccountOwnerId;
  persistence: OwnerScopedPlanningUnitOfWork;
  clock: Clock;
  ids: IdGenerator;
}
export interface OwnerScopedPlanningUnitOfWork {seasons:{findById(id:SeasonId):Promise<PersistenceResult<Season|null>>;list():Promise<PersistenceResult<Season[]>>;save(v:Season):Promise<PersistenceResult<Season>>};goals:{findById(id:GoalId):Promise<PersistenceResult<Goal|null>>;listBySeasonId(id:SeasonId):Promise<PersistenceResult<Goal[]>>;save(v:Goal):Promise<PersistenceResult<Goal>>};outcomes:{findById(id:OutcomeId):Promise<PersistenceResult<Outcome|null>>;listByGoalId(id:GoalId):Promise<PersistenceResult<Outcome[]>>;save(v:Outcome):Promise<PersistenceResult<Outcome>>};milestones:{findById(id:MilestoneId):Promise<PersistenceResult<Milestone|null>>;listByGoalId(id:GoalId):Promise<PersistenceResult<Milestone[]>>;save(v:Milestone):Promise<PersistenceResult<Milestone>>}}
export function scopePlanningPersistence(ownerId:AccountOwnerId,p:PlanningUnitOfWork):OwnerScopedPlanningUnitOfWork{return{seasons:{findById:id=>p.seasons.findById(ownerId,id),list:()=>p.seasons.list(ownerId),save:v=>p.seasons.save(ownerId,v)},goals:{findById:id=>p.goals.findById(ownerId,id),listBySeasonId:id=>p.goals.listBySeasonId(ownerId,id),save:v=>p.goals.save(ownerId,v)},outcomes:{findById:id=>p.outcomes.findById(ownerId,id),listByGoalId:id=>p.outcomes.listByGoalId(ownerId,id),save:v=>p.outcomes.save(ownerId,v)},milestones:{findById:id=>p.milestones.findById(ownerId,id),listByGoalId:id=>p.milestones.listByGoalId(ownerId,id),save:v=>p.milestones.save(ownerId,v)}};}
