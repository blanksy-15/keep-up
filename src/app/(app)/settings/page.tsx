import type { Metadata } from "next";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui";

export const metadata: Metadata = { title: "Settings" };

const settings = [
  ["Appearance", "Theme, density, and display preferences", "Dark mode is postponed"],
  ["Daily experience", "Daily-view preferences and check-in options", "Not yet available"],
  ["Notifications", "Intentional reminders through selected channels", "Postponed"],
  ["Data & privacy", "Export, retention, and privacy controls", "Requires persistence"],
  ["Account", "Identity, ownership, and trusted relationships", "Authentication postponed"],
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Settings" description="A deliberately minimal preview of future personal preferences and controls." />
      <Card className="settings-list">
        {settings.map(([title, description, status]) => <section key={title} className="settings-row"><div><h2>{title}</h2><p>{description}</p></div><span>{status}</span></section>)}
      </Card>
      <p className="settings-footnote">No settings are active in this milestone. This page contains representative structure only.</p>
    </>
  );
}
