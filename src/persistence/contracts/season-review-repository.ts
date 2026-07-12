import type { SeasonReview } from "../../domain/reflection";
import type { SeasonId, SeasonReviewId } from "../../domain/shared";
import type { PersistenceResult } from "../errors";
export interface SeasonReviewRepository {
  findById(id: SeasonReviewId): Promise<PersistenceResult<SeasonReview | null>>;
  findBySeasonId(id: SeasonId): Promise<PersistenceResult<SeasonReview | null>>;
  list(): Promise<PersistenceResult<SeasonReview[]>>;
  save(review: SeasonReview): Promise<PersistenceResult<SeasonReview>>;
}
