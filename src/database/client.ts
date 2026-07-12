import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { DatabaseConfig } from "../config";
import * as schema from "./schema";

export type KeepUpDatabase = NodePgDatabase<typeof schema>;
export interface DatabaseConnection { database:KeepUpDatabase; close():Promise<void>; }
export function createDatabaseConnection(config:DatabaseConfig):DatabaseConnection {
  const pool=new Pool({connectionString:config.connectionString});
  return {database:drizzle(pool,{schema}),close:()=>pool.end()};
}
