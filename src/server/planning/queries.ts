"use server";
import { getSeasonOverview } from "@/application";
import { planningContext } from "./dependencies";
export async function listSeasonIndex() { const ctx = await planningContext(); const [seasons, drafts] = await Promise.all([ctx.planning.persistence.seasons.list(), ctx.workflow.setupDrafts.list()]); return { seasons: seasons.ok ? seasons.value : [], drafts: drafts.ok ? drafts.value : [] }; }
export async function getSetupDraft(id: string) { const ctx = await planningContext(); const result = await ctx.workflow.setupDrafts.findById(id); return result.ok ? result.value : null; }
export async function getSeason(id: string) { const ctx = await planningContext(); return getSeasonOverview(ctx.planning, id); }
