import { PageHeader } from "@/components/app-shell";
import { Button, Card } from "@/components/ui";
import { startSeasonSetupDirect } from "@/server/planning/setup-actions";
export const dynamic = "force-dynamic";
export default function NewSetupPage() { return <><PageHeader eyebrow="Season setup" title="Start a new season" description="Create a durable draft, then shape it at your own pace." /><Card><form action={startSeasonSetupDirect} className="setup-form"><label>Working title<input name="title" placeholder="A season for…" required /></label><Button type="submit" tone="primary">Start setup</Button></form></Card></>; }
