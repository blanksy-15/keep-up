import type { SeasonReview } from "../../domain/reflection";
import type { SeasonId, SeasonReviewId } from "../../domain/shared";
import type { SeasonReviewRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
const copy = <T>(value:T):T => structuredClone(value);
export class InMemorySeasonReviewRepository implements SeasonReviewRepository {
  readonly #values=new Map<SeasonReviewId,SeasonReview>();
  async findById(id:SeasonReviewId):Promise<PersistenceResult<SeasonReview|null>>{try{const v=this.#values.get(id);return persistenceSuccess(v?copy(v):null);}catch(cause){return persistenceFailure({code:"storage_failure",message:"Season review lookup failed.",cause});}}
  async findBySeasonId(id:SeasonId):Promise<PersistenceResult<SeasonReview|null>>{try{const v=[...this.#values.values()].find(x=>x.seasonId===id);return persistenceSuccess(v?copy(v):null);}catch(cause){return persistenceFailure({code:"storage_failure",message:"Season review lookup failed.",cause});}}
  async list():Promise<PersistenceResult<SeasonReview[]>>{try{return persistenceSuccess([...this.#values.values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id)).map(copy));}catch(cause){return persistenceFailure({code:"storage_failure",message:"Season review listing failed.",cause});}}
  async save(v:SeasonReview):Promise<PersistenceResult<SeasonReview>>{try{if(!v.id||!v.seasonId)return persistenceFailure({code:"invalid_record",message:"Season review requires identifiers."});this.#values.set(v.id,copy(v));return persistenceSuccess(copy(v));}catch(cause){return persistenceFailure({code:"storage_failure",message:"Season review save failed.",cause});}}
}
