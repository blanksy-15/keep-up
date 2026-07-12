import Link from "next/link";
import { PageHeader } from "@/components/app-shell";
import { Button, Card } from "@/components/ui";
import { listSeasonIndex } from "@/server/planning/queries";
export const dynamic = "force-dynamic";
export default async function SeasonPage() {
  const { seasons, drafts } = await listSeasonIndex();
  return <>
    <PageHeader eyebrow="Planning" title="Seasons with intention" description="Build a season deliberately, then keep its authoritative plan separate from the setup proposal." action={<Link href="/season/setup/new"><Button tone="primary">Start a new setup</Button></Link>} />
    <div className="content-stack">
      <section><h2>Your seasons</h2>{seasons.length ? <div className="goal-card-grid">{seasons.map(season => <Card key={season.id}><p className="eyebrow">{season.status}</p><h3>{season.name}</h3><p className="muted">{season.dates.startDate} to {season.dates.endDate}</p><Link href={`/season/${season.id}`}><Button>Open season</Button></Link></Card>)}</div> : <Card><div className="empty-state"><h3>No seasons yet</h3><p>Your first confirmed setup will appear here as a draft season.</p></div></Card>}</section>
      <section><h2>Setup drafts</h2>{drafts.length ? <div className="content-stack">{drafts.map(draft => <Card key={draft.id}><div className="setup-index-row"><div><p className="eyebrow">{draft.status.replaceAll("_", " ")}</p><h3>{draft.title || "Untitled season"}</h3></div><Link href={draft.status === "converted" && draft.targetSeasonId ? `/season/${draft.targetSeasonId}` : draft.status === "confirmed" ? `/season/setup/${draft.id}/complete` : draft.status === "ready_for_review" ? `/season/setup/${draft.id}/review` : `/season/setup/${draft.id}`}><Button>{draft.status === "converted" ? "Open season" : draft.status === "ready_for_review" ? "Review" : draft.status === "confirmed" ? "Create" : "Resume"}</Button></Link></div></Card>)}</div> : <Card><p className="muted">No setup drafts. Start one when you are ready to plan.</p></Card>}</section>
    </div>
  </>;
}
