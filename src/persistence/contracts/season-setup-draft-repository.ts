import type { SeasonSetupDraft } from "../../domain/season-workflow";
import type { SeasonSetupDraftId } from "../../domain/shared";
import type { PersistenceResult } from "../errors";
export interface SeasonSetupDraftRepository {
  findById(id: SeasonSetupDraftId): Promise<PersistenceResult<SeasonSetupDraft | null>>;
  list(): Promise<PersistenceResult<SeasonSetupDraft[]>>;
  save(draft: SeasonSetupDraft): Promise<PersistenceResult<SeasonSetupDraft>>;
}
