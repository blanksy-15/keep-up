import Link from "next/link";
import { notFound } from "next/navigation";
import { evaluateSetupReadiness } from "@/application";
import { Button, Card } from "@/components/ui";
import { getSetupDraft } from "@/server/planning/queries";
import { confirmSetup } from "@/server/planning/setup-actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ setupDraftId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const { setupDraftId } = await params;
  const draft = await getSetupDraft(setupDraftId);
  const query = searchParams ? await searchParams : {};
  const error = typeof query.error === "string" ? query.error : undefined;
  if (!draft || (draft.status !== "ready_for_review" && !(error === "confirmation" && draft.status === "draft"))) notFound();
  const readiness = evaluateSetupReadiness(draft);

  return <div className="content-stack">
    <header className="setup-progress"><p className="eyebrow">Step 5 · Review</p><h1>Review your season setup</h1><p>Blockers must be resolved. Warnings are guidance, not rejection.</p></header>
    {error === "confirmation" ? <div className="issue-list issue-list--error" role="alert"><h2>Confirmation could not be completed</h2><p>We could not lock this setup. Review the blockers and try again.</p></div> : null}
    <Card><h2>{readiness.ready ? "Ready to confirm" : "Needs attention"}</h2>{readiness.blockers.length ? <div className="issue-list issue-list--error"><h3>Blockers</h3><ul>{readiness.blockers.map(x => <li key={`${x.code}-${x.field}`}>{x.message}</li>)}</ul></div> : <p className="form-success" role="status">No blockers remain.</p>}{readiness.warnings.length ? <div className="issue-list"><h3>Warnings</h3><ul>{readiness.warnings.map(x => <li key={`${x.code}-${x.field}`}>{x.message}</li>)}</ul></div> : null}</Card>
    <Card><h2>{draft.title}</h2><p className="muted">{draft.intent}</p><p>{draft.startDate} → {draft.endDate}</p>{draft.constraints.length ? <p className="muted">Constraints: {draft.constraints.map(x => x.text).join(" · ")}</p> : null}<h3>Selected priorities</h3><ul>{draft.priorityIdeas.filter(x => x.selected).map(x => <li key={x.id}>{x.text}</li>)}</ul><h3>Goals and outcomes</h3>{draft.proposedGoals.map(goal => <div className="review-goal" key={goal.id}><strong>{goal.text}</strong><ul>{draft.proposedOutcomes.filter(x => goal.outcomeIds.includes(x.id)).map(x => <li key={x.id}>{x.text} ({x.type ?? "numeric"}{typeof x.targetValue === "number" ? ` · target ${x.targetValue}` : ""})</li>)}</ul></div>)}</Card>
    <div className="form-actions"><Link href={`/season/setup/${draft.id}`}><Button>Back to editing</Button></Link>{draft.status === "ready_for_review" && readiness.ready ? <form action={confirmSetup}><input type="hidden" name="setupDraftId" value={draft.id} /><Button type="submit" tone="primary">Confirm and lock setup</Button></form> : null}</div>
    <p className="muted">Confirmation locks this proposal. It does not create or activate a season.</p>
  </div>;
}
