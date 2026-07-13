import { Pool } from "pg";
import { requireSafeTestDatabaseUrl } from "../../support/postgres-test-database";

export function openE2EDatabase() {
  return new Pool({ connectionString: requireSafeTestDatabaseUrl(process.env), max: 2 });
}

export async function countSeasonGraph(pool: Pool, title: string) {
  const result = await pool.query<{ seasons: string; goals: string; outcomes: string }>(
    `select count(distinct s.id)::text as seasons, count(distinct g.id)::text as goals, count(distinct o.id)::text as outcomes
     from seasons s left join goals g on g.season_id = s.id left join outcomes o on o.goal_id = g.id where s.name = $1`,
    [title],
  );
  const row = result.rows[0];
  return { seasons: Number(row?.seasons ?? 0), goals: Number(row?.goals ?? 0), outcomes: Number(row?.outcomes ?? 0) };
}

export async function countDrafts(pool: Pool, title: string) {
  const result = await pool.query<{ count: string }>("select count(*)::text as count from season_setup_drafts where content->>'title' = $1", [title]);
  return Number(result.rows[0]?.count ?? 0);
}
