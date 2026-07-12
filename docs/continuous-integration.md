# Continuous Integration

CI supplies only test Better Auth configuration, applies authentication/ownership migrations, and runs PGlite plus real-PostgreSQL owner-isolation and conversion tests. No production auth secret or user data is used.

GitHub Actions runs `CI` for pushes to `main`, pull requests targeting `main`, and manual dispatches. Stale runs for the same ref are cancelled. The single verification job uses Node 20, `npm ci` with setup-node caching, read-only repository permissions, and an official disposable PostgreSQL 16 service.

The job waits for `pg_isready`, applies committed Drizzle migrations, checks migration history, runs the fast suite (including PGlite), runs the dedicated real-PostgreSQL suite, then runs lint, type checking, and the production build. It never generates migrations, deploys, or accesses production infrastructure.

## Test layers

- `npm test` runs domain, persistence, application, workflow, assistant, and PGlite integration tests without requiring an external database.
- `npm run test:db` runs only PGlite migration/repository/transaction tests.
- `npm run test:postgres` requires an explicit safe `DATABASE_URL` and never falls back to PGlite. It applies migrations idempotently, exercises the `pg` driver and server constraints, injects failures at every conversion write stage, and uses three independent pools to prove row-lock contention and exactly-one-success conversion behavior.

Real tests truncate the six known application tables in dependency-safe order between scenarios. The CI database and credentials exist only inside the job. URL guardrails require a database name containing `test` and a localhost/CI-service host unless `ALLOW_REMOTE_TEST_DATABASE=true` is deliberately supplied. These checks reduce accidents but are not a security boundary.

For local testing, run PostgreSQL yourself, create a disposable database whose name contains `test`, set `DATABASE_URL`, and run `npm.cmd run test:postgres`. Docker is optional; no Compose stack is committed because CI already supplies disposable orchestration and Docker is not required locally.

Failures are separated by named migration, fast-test, PostgreSQL, lint, typecheck, and build steps. Logs never print the connection string, password, or tokens. Inspect runs in the repository's Actions tab. Passing PGlite does not replace server testing; passing this PostgreSQL 16 job proves the tested row-lock behavior for this schema/driver/version, not every future hosting configuration. No deployment occurs.
# Guided setup coverage

CI covers the new guided setup validation tests in addition to fast, PGlite, real PostgreSQL, lint, type checking, and production build stages.
