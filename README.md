# keep-up

The current milestone is **PostgreSQL Persistence and Transactional Setup Conversion**. Framework-independent orchestration lives in `src/application/season-workflow`, workflow contracts in `src/domain`, and replaceable assistant ports in `src/application/assistant`. Goals remain unrestricted and user-owned; categories, templates, and assistant suggestions cannot determine validity.

Run `npm.cmd test` for the full suite. There is no real assistant provider, chatbot/API integration, interactive workflow UI, authentication, hosted database, or production credential configuration yet.

## Database

The durable adapter uses PostgreSQL, Drizzle, and the standard `pg` driver. Copy the placeholder shape from `.env.example` and provide `DATABASE_URL` only when explicitly composing database infrastructure. Use `npm.cmd run db:generate`, `npm.cmd run db:check`, and `npm.cmd run db:migrate`; `npm.cmd run test:db` uses an isolated PGlite engine. Confirmed setup conversion atomically creates draft planning records without activation. No hosted provider, credentials, UI connection, authentication, or multi-user ownership is included.

## Continuous integration

`.github/workflows/ci.yml` runs on `main` pushes and pull requests. It installs with `npm ci`, applies migrations to disposable PostgreSQL 16, runs `npm test` and `npm run test:postgres`, then lint, type checking, and the production build. Local real-server tests require a running PostgreSQL test database and a guarded `DATABASE_URL`; CI performs no deployment.

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
