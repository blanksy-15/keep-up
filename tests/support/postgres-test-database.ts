import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabaseConnection } from "../../src/database";

export function requireSafeTestDatabaseUrl(environment:NodeJS.ProcessEnv=process.env):string {
  const raw=environment.DATABASE_URL?.trim();
  if(!raw)throw new Error("DATABASE_URL is required for real PostgreSQL tests.");
  let url:URL;try{url=new URL(raw);}catch{throw new Error("DATABASE_URL is not a valid URL.");}
  const database=url.pathname.replace(/^\//,"").toLowerCase();
  const host=url.hostname.toLowerCase();
  const safeHost=host==="localhost"||host==="127.0.0.1"||host==="postgres";
  if(!database||!database.includes("test"))throw new Error("Real PostgreSQL tests require a database name containing 'test'.");
  if(!safeHost&&environment.ALLOW_REMOTE_TEST_DATABASE!=="true")throw new Error("Real PostgreSQL tests require localhost, 127.0.0.1, or postgres unless ALLOW_REMOTE_TEST_DATABASE=true.");
  return raw;
}

export async function createRealTestDatabase(){const connection=createDatabaseConnection({connectionString:requireSafeTestDatabaseUrl()});return connection;}
export async function applyMigrations(database:ReturnType<typeof createDatabaseConnection>["database"]){await migrate(database,{migrationsFolder:"drizzle"});}
export async function cleanDatabase(database:ReturnType<typeof createDatabaseConnection>["database"]){await database.execute(sql`truncate table season_reviews, season_setup_drafts, milestones, outcomes, goals, seasons, auth_sessions, auth_accounts, auth_verifications, auth_users restart identity cascade`);}
