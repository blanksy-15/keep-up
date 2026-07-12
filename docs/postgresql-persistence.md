# PostgreSQL Persistence

PostgreSQL is the first durable database model and Drizzle is the sole ORM/query layer. Production composition uses the standard `pg` driver and a conventional connection string, keeping Neon, Supabase, Vercel, Railway, and other hosting choices interchangeable. No hosted provider or production credentials are selected.

## Schema and mapping

Migration-owned tables store seasons, goals, outcomes, milestones, setup drafts, and season reviews. PostgreSQL enums provide typed, legible status constraints; changing their value sets requires an explicit migration. Parent relationships use indexed foreign keys with restrictive deletion. Calendar dates use `date`; lifecycle instants use timezone-aware timestamps normalized to ISO strings on reads. Stable planning fields are relational. Evolving setup content, review content, assistant proposals, and embedded approved insights use JSONB behind explicit shape validation. Raw provider responses are never stored.

Database constraints protect keys, relationships, date order, and positive outcome targets. Domain and application behavior remain responsible for lifecycle policy; there are no triggers, cascade deletion, or automatic completion/activation rules.

## Configuration and migrations

`src/config/database.ts` reads and validates `DATABASE_URL` only when PostgreSQL composition is requested. Missing configuration does not break builds, tests, or static routes. `.env.example` contains a placeholder only. Use `npm.cmd run db:generate` after intentional schema changes, `npm.cmd run db:check` to validate migration history, and `npm.cmd run db:migrate` only against a deliberately selected database. Migration files, not schema push, own production evolution.

## Repositories and transactions

PostgreSQL repositories implement existing persistence contracts and accept a supplied database or transaction context. They preserve save/upsert, null not-found, deterministic ordering, timestamp/date semantics, and structured error translation. In-memory repositories remain supported for fast tests and development.

The transaction runner supplies transaction-bound planning and workflow repositories. A returned failure or thrown exception rolls back. Setup conversion locks the setup row with `SELECT ... FOR UPDATE`, rechecks confirmed status, creates the draft planning graph with newly allocated authoritative IDs, updates the workflow target/status last, and commits only on success. Converted drafts cannot convert again. Proposal-to-authoritative mappings are returned. Unsupported habits, recurring actions, and projects remain workflow JSON and are reported as warnings rather than discarded.

## Testing and limitations

Automated database tests apply the committed migration to a fresh in-memory PGlite database per test. PGlite is PostgreSQL-compatible and exercises Drizzle queries, constraints, commit, and rollback without accessing personal or production data. It is not a substitute for server PostgreSQL multi-connection concurrency testing; row-locking SQL is exercised, but simultaneous independent-connection conversion remains environment-blocked until a disposable PostgreSQL server is available.

No authentication, ownership, row-level security, or multi-user safety exists. The schema is single-user only by omission, not permanent design; trusted multi-user support requires a deliberate ownership migration. Application pages remain disconnected. Conversion creates draft records only. Daily execution, hosted provisioning, deployment, and destructive deletion remain postponed.
