import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell";
import { Button, Card, EmptyState, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Reflection" };

export default function ReflectionPage() {
  return (
    <>
      <PageHeader eyebrow="Week 12 · July 6–12" title="Weekly reflection" description="Use the week’s activity as evidence, then decide what deserves attention next." action={<Button disabled>Write reflection · unavailable</Button>} />
      <div className="reflection-grid">
        <div className="content-stack">
          <Card><SectionHeading title="Week at a glance" /><div className="week-stats"><div><strong>14</strong><span>tasks completed</span></div><div><strong>9 / 12</strong><span>recurring actions</span></div><div><strong>4</strong><span>daily check-ins</span></div></div><div className="activity-days" aria-label="Illustrative activity by day">{[70,90,45,80,60,20,0].map((v,i)=><div key={i}><span style={{height:`${Math.max(v,8)}%`}} /><small>{["M","T","W","T","F","S","S"][i]}</small></div>)}</div></Card>
          <Card><SectionHeading title="Reflection prompts" description="Preview only—responses cannot be entered yet." /><div className="prompt-list"><div><span>01</span><p>What created the most meaningful progress?</p></div><div><span>02</span><p>Where did friction or avoidance show up?</p></div><div><span>03</span><p>What should change in the coming week?</p></div></div></Card>
          <Card><SectionHeading title="Recent reflections" /><article className="reflection-entry"><div><strong>Week 11</strong><span>July 5</span></div><p>Smaller daily commitments made the week feel lighter without reducing progress.</p></article><article className="reflection-entry"><div><strong>Week 10</strong><span>June 28</span></div><p>Planning the next day before signing off made mornings noticeably calmer.</p></article></Card>
        </div>
        <aside className="content-stack">
          <Card><SectionHeading title="Scorecard preview" /><div className="score-row"><span>Execution</span><strong>86</strong></div><div className="score-row"><span>Consistency</span><strong>78</strong></div><div className="score-row"><span>Alignment</span><strong>82</strong></div><p className="preview-note">Scores are illustrative. Calculation rules remain undecided.</p></Card>
          <Card><SectionHeading title="Season review" /><EmptyState title="Review opens at season end" description="This area will bring goals, outcomes, activity, and weekly lessons together." /></Card>
        </aside>
      </div>
    </>
  );
}
