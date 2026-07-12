import type { SeasonReview } from "../../domain/reflection";
import type { SeasonId, SeasonReviewId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { PersistenceResult } from "../errors";
export interface SeasonReviewRepository {
  findById(ownerId:AccountOwnerId,id: SeasonReviewId): Promise<PersistenceResult<SeasonReview | null>>;
  findBySeasonId(ownerId:AccountOwnerId,id: SeasonId): Promise<PersistenceResult<SeasonReview | null>>;
  list(ownerId:AccountOwnerId): Promise<PersistenceResult<SeasonReview[]>>;
  save(ownerId:AccountOwnerId,review: SeasonReview): Promise<PersistenceResult<SeasonReview>>;
}
