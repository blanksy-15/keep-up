import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader eyebrow="Planning & progress" title="Dashboard" description="A clear view of the season, its goals, and the context worth carrying forward." />
      <div className="dashboard-grid">
        <Card className="season-summary dashboard-span-2">
          <div><p className="eyebrow">Current season</p><h2>Build with intention</h2><p>April 20 – July 19 · Week 12 of 13</p></div>
          <div className="season-ring" aria-label="Season 88 percent elapsed"><strong>88%</strong><span>elapsed</span></div>
        </Card>
        <Card><SectionHeading title="Weekly score" description="Illustrative snapshot" /><strong className="metric-large">82<span>/100</span></strong><p className="positive-note">↑ 6 points from last week</p></Card>
        <Card className="dashboard-span-2"><SectionHeading title="Active goals" description="Three priorities for this season." />
          <div className="goal-list">
            {[{name:"Ship a durable foundation",value:72},{name:"Build a consistent movement rhythm",value:58},{name:"Read and synthesize six books",value:67}].map(goal=><div key={goal.name}><div><strong>{goal.name}</strong><span>{goal.value}%</span></div><div className="progress-track"><span style={{width:`${goal.value}%`}} /></div></div>)}
          </div>
        </Card>
        <Card><SectionHeading title="Outcome progress" /><div className="metric-list"><div><strong>4 / 6</strong><span>Books completed</span></div><div><strong>3 / 4</strong><span>Foundation milestones</span></div><div><strong>8</strong><span>Active weeks</span></div></div></Card>
        <Card><SectionHeading title="Recent reflection" /><blockquote>“Smaller daily commitments made the week feel lighter without reducing progress.”</blockquote><p className="card-meta">Week 11 reflection</p></Card>
        <Card><SectionHeading title="Carry-forward insight" /><p className="insight-text">Protect focused mornings. They create the clearest work and leave more energy for the rest of the day.</p><p className="card-meta">From the previous season review</p></Card>
      </div>
    </>
  );
}
