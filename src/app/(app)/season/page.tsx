import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell";
import { Button, Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Season" };

export default function SeasonPage() {
  return (
    <>
      <PageHeader eyebrow="April 20 – July 19" title="Build with intention" description="Create a durable foundation, strengthen daily rhythms, and finish the season with useful evidence—not noise." action={<Button disabled>Edit season · unavailable</Button>} />
      <div className="content-stack">
        <Card className="intent-card"><p className="eyebrow">Season intent</p><blockquote>Choose fewer commitments, give them sustained attention, and finish what creates lasting value.</blockquote></Card>
        <section><SectionHeading title="Season goals" description="Static planning examples for the shell milestone." />
          <div className="goal-card-grid">
            {[{n:"01",title:"Ship a durable foundation",outcome:"A production-ready application foundation with clear product boundaries.",progress:"72%",milestones:["Product definition complete","Application shell in progress"]},{n:"02",title:"Build a movement rhythm",outcome:"Move intentionally at least four days each week.",progress:"58%",milestones:["Eight consistent weeks","Choose next training block"]},{n:"03",title:"Read and synthesize",outcome:"Finish six books and capture one useful idea from each.",progress:"67%",milestones:["Four books complete","Two summaries remaining"]}].map(goal=><Card key={goal.n} className="goal-card"><span className="goal-card__number">{goal.n}</span><h3>{goal.title}</h3><p>{goal.outcome}</p><div className="goal-card__progress"><span>Outcome progress</span><strong>{goal.progress}</strong></div><ul>{goal.milestones.map(m=><li key={m}>{m}</li>)}</ul></Card>)}
          </div>
        </section>
      </div>
    </>
  );
}
