import type { SeasonSetupDraft } from "../../domain/season-workflow";
import type { SeasonSetupDraftId } from "../../domain/shared";
import type { SeasonSetupDraftRepository } from "../contracts";
import { persistenceFailure, persistenceSuccess, type PersistenceResult } from "../errors";
const copy = <T>(value: T): T => structuredClone(value);
export class InMemorySeasonSetupDraftRepository implements SeasonSetupDraftRepository {
  readonly #values = new Map<SeasonSetupDraftId, SeasonSetupDraft>();
  async findById(id: SeasonSetupDraftId): Promise<PersistenceResult<SeasonSetupDraft | null>> { try { const value=this.#values.get(id); return persistenceSuccess(value ? copy(value) : null); } catch(cause){ return persistenceFailure({code:"storage_failure",message:"Setup draft lookup failed.",cause}); } }
  async list(): Promise<PersistenceResult<SeasonSetupDraft[]>> { try { return persistenceSuccess([...this.#values.values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id)).map(copy)); } catch(cause){ return persistenceFailure({code:"storage_failure",message:"Setup draft listing failed.",cause}); } }
  async save(value: SeasonSetupDraft): Promise<PersistenceResult<SeasonSetupDraft>> { try { if(!value.id||!value.title.trim()) return persistenceFailure({code:"invalid_record",message:"Setup draft requires an id and title."}); this.#values.set(value.id,copy(value)); return persistenceSuccess(copy(value)); } catch(cause){ return persistenceFailure({code:"storage_failure",message:"Setup draft save failed.",cause}); } }
}
