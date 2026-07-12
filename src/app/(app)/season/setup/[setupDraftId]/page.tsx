import { notFound } from "next/navigation";
import { getSetupDraft } from "@/server/planning/queries";
import { SetupEditor } from "@/components/season-setup/setup-editor";
export const dynamic = "force-dynamic";
export default async function SetupDraftPage({ params }: { params: Promise<{ setupDraftId: string }> }) { const { setupDraftId } = await params; const draft = await getSetupDraft(setupDraftId); if (!draft || (draft.status !== "draft" && draft.status !== "ready_for_review")) notFound(); return <SetupEditor draft={draft} />; }
