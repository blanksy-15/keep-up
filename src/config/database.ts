export interface DatabaseConfig { connectionString: string; }

export function readDatabaseConfig(environment: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  const connectionString = environment.DATABASE_URL?.trim();
  if (!connectionString) throw new Error("DATABASE_URL is required to compose PostgreSQL persistence.");
  return { connectionString };
}
