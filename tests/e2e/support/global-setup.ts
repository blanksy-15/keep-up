import { applyMigrations, cleanDatabase, createRealTestDatabase } from "../../support/postgres-test-database";

export default async function globalSetup() {
  const connection = await createRealTestDatabase();
  try {
    await applyMigrations(connection.database);
    await cleanDatabase(connection.database);
  } finally {
    await connection.close();
  }
}
