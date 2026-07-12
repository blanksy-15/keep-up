import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { getSetupDraft } from "@/server/planning/queries";
import { convertSetup } from "@/server/planning/setup-actions";
export const dynamic = "force-dynamic";
export default async function CompletePage({ params }: { params: Promise<{ setupDraftId: string }> }) { const { setupDraftId } = await params; const draft = await getSetupDraft(setupDraftId); if (!draft || (draft.status !== "confirmed" && draft.status !== "converted")) notFound(); return <div className="content-stack"><header className="setup-progress"><p className="eyebrow">Step 6 · Confirm and create</p><h1>{draft.status === "converted" ? "Your draft season is ready" : "Create your draft season"}</h1><p>The setup is confirmed. Conversion creates authoritative draft records but does not activate the season.</p></header><Card><h2>{draft.title}</h2><p>{draft.proposedGoals.length} goals · {draft.proposedOutcomes.length} outcomes</p>{draft.status === "converted" && draft.targetSeasonId ? <Link href={`/season/${draft.targetSeasonId}`}><Button tone="primary">Open resulting season</Button></Link> : <form action={convertSetup}><input type="hidden" name="setupDraftId" value={draft.id} /><Button type="submit" tone="primary">Create draft season</Button></form>}</Card></div>; }
