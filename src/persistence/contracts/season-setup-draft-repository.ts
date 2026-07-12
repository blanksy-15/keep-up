import type { SeasonSetupDraft } from "../../domain/season-workflow";
import type { SeasonSetupDraftId } from "../../domain/shared";
import type { AccountOwnerId } from "../../domain/identity";
import type { PersistenceResult } from "../errors";
export interface SeasonSetupDraftRepository {
  findById(ownerId:AccountOwnerId,id: SeasonSetupDraftId): Promise<PersistenceResult<SeasonSetupDraft | null>>;
  list(ownerId:AccountOwnerId): Promise<PersistenceResult<SeasonSetupDraft[]>>;
  save(ownerId:AccountOwnerId,draft: SeasonSetupDraft): Promise<PersistenceResult<SeasonSetupDraft>>;
}
