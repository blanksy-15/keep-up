# keep-up

## Authentication

Better Auth provides email/password sign-up, sign-in, sign-out, and database-backed sessions through Drizzle. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `ALLOW_PUBLIC_SIGN_UP` from `.env.example`, then apply migrations with `npm.cmd run db:migrate`. Registration is closed by default. Product routes validate sessions server-side and all product repositories require owner scope.

There is no social login, email verification delivery, password recovery, MFA, organization/family sharing, or production auth configuration yet.

The current milestone is **Authenticated Browser End-to-End Verification**. Playwright exercises guided setup through the browser, Better Auth, session-derived ownership, PostgreSQL repositories, and transactional conversion. AI assistance and activation remain postponed.

Run `npm.cmd test` for the full suite, `npm.cmd run test:db` for PGlite, and `npm.cmd run test:postgres` when a safe PostgreSQL test database exists. Required local variables are listed in `.env.example`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `ALLOW_PUBLIC_SIGN_UP`.

## PostgreSQL and migrations

The durable adapter and browser tests use PostgreSQL, Drizzle, and `pg`. `drizzle.config.ts` loads `.env.local` through `@next/env`; `npm.cmd run db:migrate` therefore uses the intended local environment without a manual PowerShell export and fails clearly when `DATABASE_URL` is absent. Use `npm.cmd run db:generate`, `npm.cmd run db:check`, and `npm.cmd run db:migrate`. E2E cleanup requires a separate database with `test` in its name. Browser tests never fall back to PGlite; `npm.cmd run test:db` remains the isolated PGlite layer.

## Continuous integration

`.github/workflows/ci.yml` runs on `main` pushes and pull requests. The verification job runs the lower-level suites, lint, type checking, and build. A separate E2E job uses disposable PostgreSQL 16, installs Chromium, applies migrations, and runs `npm.cmd run test:e2e` with synthetic values. Local browser execution requires a separate safe PostgreSQL E2E database; Docker is not mandatory because CI supplies one.

## Playwright browser verification

Install Chromium with `npx playwright install chromium`, then use `npm.cmd run test:e2e`, `npm.cmd run test:e2e:headed`, `npm.cmd run test:e2e:ui`, or `npm.cmd run test:e2e:report`. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PLAYWRIGHT_BASE_URL`, `ALLOW_PUBLIC_SIGN_UP=true`, and `E2E_TEST_MODE=true`. The database name must contain `test`; do not use the normal development database. Test accounts are synthetic, authentication state is not committed, and `playwright/.auth/`, reports, and failure artifacts are ignored. See [`docs/browser-end-to-end-testing.md`](./docs/browser-end-to-end-testing.md).

Keep-up is a long-term personal operating system for goals, habits, health, projects, and personal growth. It is intended to support intentional growth, consistent execution, reflection, and durable progress without becoming burdensome.

## Status

The project is in **Application Service Layer**. It contains a responsive static shell, framework-independent domain behavior, vendor-neutral persistence, and tested planning use cases. No production database or authentication exists, and the UI remains disconnected.

Keep-up is intended to be mobile-first. A fast daily execution experience for priorities, due work, completion, and lightweight check-ins is a central product capability alongside deeper planning and reflection. The final production URL and custom domain have not been selected.

## Technology stack

- Next.js 16 with the App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- ESLint 9 with the Next.js configuration
- npm and Git
- Vercel-compatible, mobile-first application structure

## Prerequisites

- Node.js 20.9 or newer
- npm (included with Node.js)
- Git

## Installation

```bash
npm install
```

## Local development

```bash
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000). Other useful checks are:

```bash
npm run lint
npm run typecheck
npm test
```

## Application structure

The root route redirects to `/today`. Current static product routes are:

- `/today` — mobile-first daily execution preview
- `/dashboard` — season planning and progress overview
- `/season` — season intent, goals, outcomes, and milestones
- `/reflection` — weekly activity, scorecard, and reflection preview
- `/settings` — unavailable future settings categories

All displayed tasks, scores, check-ins, reflections, and progress values are illustrative placeholders. Controls do not save or mutate data.

## Domain behavior

Pure season, goal, milestone, outcome-progress, activation, and summary behavior lives in [`src/domain/behavior`](./src/domain/behavior). It has no React, Next.js, or persistence imports and returns immutable values with structured domain errors. The static routes do not consume this behavior yet.

## Persistence boundary

Repository contracts, serializable records, pure mappers, and isolated in-memory repositories live in [`src/persistence`](./src/persistence). The in-memory implementation exists to validate the boundary and is not production storage. Domain behavior does not import persistence, and no database or ORM has been selected.

## Application services

Focused planning use cases live in [`src/application`](./src/application). They coordinate domain behavior and repository interfaces for season/goal creation and lifecycle, outcome progress, milestone status, and season overviews. Services use injected clock and ID boundaries and return structured application results. Routes and the static UI do not call these services yet.

## Production build

```bash
npm run build
npm start
```

## Development philosophy

Favor clarity, maintainability, and sustainable progress. Keep framework conventions unless a documented requirement justifies departing from them. Introduce abstractions and dependencies only when real product needs support them, keep business rules outside presentation components, and leave the application buildable after every milestone.

## Documentation

Documentation is part of the implementation. Update relevant documentation alongside code whenever behavior, setup, conventions, or architecture changes. Commands in this README should remain executable and accurate.

- [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) — living vision, architecture principles, roadmap, milestone, and decisions
- [Domain glossary](./docs/domain-glossary.md) — shared product vocabulary
- [Domain boundaries](./docs/domain-boundaries.md) — ownership and integration boundaries
- [Primary-user workflows](./docs/primary-user-workflows.md) — season lifecycle and daily mobile execution
- [Initial product scope](./docs/initial-product-scope.md) — included, postponed, and undecided work
- [Domain invariants](./docs/domain-invariants.md) — accepted, proposed, and unresolved rules
- [Mobile-first principles](./docs/mobile-first-principles.md) — guidance for the future daily experience
- [Application shell](./docs/application-shell.md) — routes, responsive navigation, design tokens, accessibility, and placeholder policy
- [Season and goal behavior](./docs/season-goal-behavior.md) — lifecycle, activation, progress, summary, and preservation rules
- [Persistence boundary](./docs/persistence-boundary.md) — repositories, records, mapping, in-memory semantics, and postponed storage choices
- [Application services](./docs/application-services.md) — use-case orchestration, parent policies, errors, read models, and atomicity limits

Any future change to architecture, scope, roadmap, conventions, or a major decision must update the relevant documentation and `PROJECT_PLAN.md` in the same change.
