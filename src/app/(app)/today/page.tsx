import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell";
import { Button, Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Today" };

const focusItems = [
  { title: "Outline the next project milestone", source: "Build keep-up", effort: "35 min", status: "Priority" },
  { title: "Take a focused movement break", source: "Move consistently", effort: "20 min", status: "Due today" },
  { title: "Read and capture one useful idea", source: "Learn deliberately", effort: "25 min", status: "Planned" },
];

export default function TodayPage() {
  return (
    <>
      <PageHeader eyebrow="Saturday, July 11" title="Good morning" description="Three priorities will move today forward. Keep the day clear and intentional." />
      <div className="today-layout">
        <div className="content-stack">
          <section aria-labelledby="focus-title">
            <SectionHeading title="Today’s focus" description="The work that matters most right now." action={<span className="preview-label">Static preview</span>} />
            <div className="focus-list">
              {focusItems.map((item, index) => (
                <Card key={item.title} className="focus-item">
                  <button className="completion-preview" type="button" disabled aria-label={`Complete ${item.title}; unavailable in preview`}>
                    <span aria-hidden="true" />
                  </button>
                  <div className="focus-item__body">
                    <div className="focus-item__topline"><span>{item.status}</span><span>{item.effort}</span></div>
                    <h3>{item.title}</h3>
                    <p>{item.source}</p>
                  </div>
                  <span className="focus-number" aria-hidden="true">0{index + 1}</span>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="recurring-title">
            <SectionHeading title="Habits & recurring actions" description="A short rhythm for today." />
            <Card className="recurring-card">
              {["Morning stretch", "Plan tomorrow before signing off", "Read for twenty minutes"].map((item, index) => (
                <div className="recurring-row" key={item}>
                  <span className="recurring-icon" aria-hidden="true">{index === 0 ? "↗" : index === 1 ? "◇" : "○"}</span>
                  <div><h3>{item}</h3><p>{index === 0 ? "Daily habit" : "Recurring action"}</p></div>
                  <span className="status-dot"><span aria-hidden="true" />Due</span>
                </div>
              ))}
            </Card>
          </section>
        </div>

        <aside className="today-aside" aria-label="Today summary">
          <Card className="check-in-card">
            <p className="eyebrow">Daily check-in preview</p>
            <h2>How is today feeling?</h2>
            <div className="check-in-values">
              <div><span>Energy</span><strong>Steady</strong><div className="scale-preview"><i /><i /><i className="is-on" /><i /><i /></div></div>
              <div><span>Focus</span><strong>Clear</strong><div className="scale-preview"><i /><i /><i /><i className="is-on" /><i /></div></div>
            </div>
            <label className="note-preview">Brief note<textarea readOnly value="Ready for a calm, focused day." aria-label="Example daily note" /></label>
            <Button disabled className="w-full">Check-in unavailable in preview</Button>
          </Card>

          <Card className="progress-card">
            <SectionHeading title="Progress snapshot" />
            <div className="progress-stat"><span>Tasks completed</span><strong>2 <small>of 5</small></strong></div>
            <div className="progress-track" aria-label="Two of five tasks complete"><span style={{ width: "40%" }} /></div>
            <div className="progress-pair"><div><span>Weekly consistency</span><strong>82%</strong></div><div><span>Season progress</span><strong>46%</strong></div></div>
          </Card>
        </aside>
      </div>
    </>
  );
}
