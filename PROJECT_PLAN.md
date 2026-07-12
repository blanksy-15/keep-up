# Vision

## Current milestone (2026-07-11)

**Authentication and Data Ownership** — Better Auth, database-backed sessions, protected routes, authentication surfaces, mandatory record ownership, owner-scoped repositories, and authorization tests. Real PostgreSQL Continuous Integration is complete.

New organization includes `src/application/season-workflow`, `src/application/assistant`, `docs/season-workflow.md`, `docs/assistant-boundaries.md`, and `docs/season-summary-standard.md`.

Database organization includes `src/config`, `src/database/schema`, `src/persistence/postgres`, `drizzle`, and `docs/postgresql-persistence.md`.

CI organization includes `.github/workflows/ci.yml`, `.nvmrc`, real-server tests, and `docs/continuous-integration.md`.

Identity organization includes `src/auth`, `src/application/identity`, the Better Auth API route, sign-in/sign-up pages, migration `0001`, and `docs/authentication-and-ownership.md`.

### Decisions

- Goals remain unrestricted, open-ended, user-authored, and never require categories or templates.
- Guided setup drafts stay separate from authoritative planning records.
- Confirmation is explicit and does not activate a season.
- Replaceable assistant providers return proposals requiring selective user application.
- Summaries are pragmatic, grounded, uncertainty-aware, and constructively future-positive.
- Carry-forward insights require explicit approval and are embedded in finalized reviews.
- Conversion produces a deterministic plan because transactional persistence is unavailable.
- Finalized reviews are immutable initially.
- Provider integration, chatbot/API transport, production persistence, authentication, and workflow UI remain postponed.
- PostgreSQL is the durable database model; Drizzle and migration-first schema management are provider-neutral implementation choices.
- `DATABASE_URL` is validated only at explicit composition; no hosted provider is selected.
- A transaction-runner contract hides real PostgreSQL transactions from application services.
- Conversion allocates authoritative IDs, returns proposal mappings, creates draft records only, and rejects repeated conversion.
- `SELECT ... FOR UPDATE` protects conversion status rechecks; database uniqueness provides final enforcement.
- Evolving workflow bodies use validated JSONB while stable planning relationships remain relational.
- In-memory repositories remain; PGlite provides isolated PostgreSQL-compatible migration/transaction tests.
- UI integration, authentication/ownership, AI providers, chatbot transport, hosted provisioning, and daily execution remain postponed.
- GitHub Actions runs on `main` pushes and pull requests with read-only contents permission and no deployment.
- CI uses Node 20 and disposable PostgreSQL 16 with ephemeral test credentials.
- Fast/PGlite tests and guarded real-PostgreSQL tests are separate commands.
- Committed migrations are applied to an empty server database and recognized on a second invocation.
- Independent pools are mandatory for exactly-one-success concurrency verification.
- Failure injection covers season, goal, outcome, milestone, and final workflow writes.
- Known-table truncation isolates real-server scenarios; Docker Compose remains omitted and optional local PostgreSQL is documented.
- Better Auth 1.6 with its Drizzle adapter owns email/password credentials and database sessions.
- Registration is closed by default; required email verification waits for delivery infrastructure.
- Better Auth user IDs map to application-owned `AccountOwnerId` values.
- All authoritative records store non-null owners; repositories bind mandatory owner scope and hide cross-owner existence.
- The protected server layout validates sessions; UI and cookies alone are never authorization boundaries.
- Pre-launch development data is cleared by the ownership migration rather than assigned to an arbitrary user.
- Social login, recovery email, MFA, organizations, family sharing, daily execution, AI providers, and product-data forms remain postponed.

Keep-up is a personal operating system for intentional growth, execution, reflection, and long-term progress. It will bring goals, habits, health, projects, and personal growth into one coherent system that helps a person decide what matters, act consistently, learn from outcomes, and carry useful context forward.

# Core Philosophy

- Favor sustainable progress over short-term intensity.
- Support reflection as well as action.
- Keep the system useful without making it burdensome.
- Favor clarity over excessive complexity.
- Build for the primary user first while preserving a path toward broader use.
- Treat historical outcomes as useful context for future planning.
- Make daily execution fast and clear on a phone without forcing the full planning system into the daily workflow.

# Architecture Principles

- Maintain clear separation between UI, business logic, API boundaries, and data access.
- Do not embed business rules directly in presentation components.
- Do not let infrastructure choices unnecessarily control domain design.
- Introduce external services behind clear boundaries.
- Treat authentication, persistence, AI coaching, analytics, notifications, and multi-user support as future concerns.
- Select server and client components intentionally; prefer server components unless interactivity or browser APIs require a client boundary.
- Validate data at system boundaries once those boundaries are introduced.
- Keep the application buildable after each milestone.
- Avoid speculative abstractions unsupported by real requirements.
- Keep core domain contracts independent from Next.js, React, routes, and infrastructure.

# Technology Stack

## Current dependencies

- Next.js 16.2.10 using the App Router and `src` directory
- React and React DOM 19.2.4
- TypeScript 5 in strict mode
- Tailwind CSS 4
- ESLint 9 with the Next.js configuration
- npm for dependency management
- Git for version control
- Vercel-compatible framework defaults

## Possible future technologies

Future milestones may introduce infrastructure and libraries when requirements are sufficiently defined. No database, authentication provider, analytics provider, AI provider, notification system, state-management library, or component library has been selected.

# Folder Organization

Current structure:

```text
keep-up/
├── docs/               # Product vocabulary, boundaries, workflows, scope, and principles
├── src/
│   ├── app/            # App Router routes, layouts, static product pages, and global styles
│   ├── application/
│   │   ├── contracts/  # Clock and identifier-generation boundaries
│   │   ├── planning/   # Focused planning use cases and parent-state policies
│   │   └── errors.ts   # Stable adapter-facing application results and error mapping
│   ├── components/
│   │   ├── app-shell/  # Responsive shell, navigation, and page headers
│   │   └── ui/         # Small reusable presentation primitives
│   ├── domain/
│       ├── behavior/   # Pure lifecycle, validation, progress, and summary functions
│       └── *.ts        # Framework-independent domain contracts
│   └── persistence/
│       ├── contracts/  # Explicit planning repository interfaces and repository grouping
│       ├── mapping/    # Pure domain/record conversion and reconstruction validation
│       ├── memory/     # Isolated deterministic in-memory implementations
│       └── records/    # Serializable storage-oriented records
├── tests/              # Domain, persistence, and application-service tests using Node's runner
├── PROJECT_PLAN.md     # Living architecture and roadmap
└── configuration files
```

The initial structure deliberately retains only directories with immediate value. As product requirements emerge, use these conventions:

- `src/app`: routing and route composition; route files should remain thin.
- `src/application`: focused dependency-injected use cases coordinating domain behavior and persistence contracts; no framework or concrete-storage imports.
- `docs`: product and domain definitions that govern later implementation decisions.
- `src/domain`: framework-independent types for stable core concepts; no UI or persistence concerns.
- `src/domain/behavior`: pure immutable lifecycle, validation, progress, and summary behavior with structured results.
- `src/persistence`: vendor-neutral repository contracts, records, pure mappers, errors, and replaceable implementations; it may depend on domain contracts, never the reverse.
- `src/components/app-shell`: responsive application framing and navigation shared by product routes.
- `src/components/ui`: modest, immediately used visual primitives rather than a general component library.
- `public`: static assets once the application has assets to serve.
- `src/components`: reusable, domain-agnostic UI when shared components actually exist.
- `src/features/<domain>`: domain-oriented modules containing a capability's business concepts and application logic.
- `src/lib`: focused shared utilities with clear names and ownership, not a general dumping ground.
- `src/server`: server-only orchestration, integration boundaries, and data access once introduced.
- `src/config`: typed application configuration once configuration beyond framework defaults exists.
- `src/types`: truly shared types only; domain types should stay with their domain.

Future business capabilities should be organized by domain or feature rather than accumulated in unrelated global folders. Planned directories should be created only when they have a concrete implementation to contain.

# Product Capability Map

The following capabilities span the initial scope and later roadmap. Their inclusion here does **not** authorize implementation beyond the current milestone; [Initial Product Scope](./docs/initial-product-scope.md) is authoritative about what is initial, postponed, or undecided:

- Seasons and seasonal goal planning
- End-of-season capture and reflection
- Historical context carried into future seasons
- Weekly scorecards
- AI coaching
- Goal templates
- Habit tracking
- Health tracking
- Project tracking
- Analytics and trends
- Mobile-first UX
- Personal dashboard
- Notifications and reminders
- Trusted friend and family accounts
- Privacy boundaries between users
- Optional shared goals or accountability
- API- or chatbot-assisted goal setup

Two connected usage modes guide the product:

- **Planning and reflection:** define seasons and goals, establish outcomes, review progress, reflect weekly, close seasons, and carry lessons forward.
- **Daily execution:** use a fast, mobile-first surface to understand today's priorities, act on tasks and recurring work, and record a lightweight check-in.

The future Today View, or equivalent daily execution surface, is a primary application experience. It must be optimized for phone use while remaining accessible and responsive. Its final name, route, navigation position, and landing-page role remain undecided.

# Initial Roadmap

1. **Project initialization** — completed; established the buildable framework, repository, and living documentation.
2. **Product and domain definition** — completed; clarified vocabulary, user needs, boundaries, and initial workflows.
3. **Application shell and design foundation** — completed; established navigation, layout, accessibility, and visual conventions.
4. **Core season and goal domain modeling** — completed; defined behavior and rules independently of persistence and presentation.
5. **Initial persistence layer** — completed; introduced vendor-neutral storage boundaries and validated them in memory without selecting production storage.
6. **Application service layer** — current; coordinate planning use cases across domain behavior and persistence contracts.
7. **Personal dashboard** — compose the primary user's essential views and actions.
8. **Weekly scorecards and reflection** — support review, learning, and planning cycles.
9. **Habit and health tracking** — add focused tracking capabilities based on validated needs.
10. **Analytics and historical insights** — surface useful patterns without encouraging noisy metrics.
11. **Authentication and account ownership** — establish identity, authorization, and ownership boundaries.
12. **AI coaching boundaries and initial integration** — define safe, useful coaching behavior behind a provider boundary.
13. **Notifications** — introduce intentional reminders through selected channels.
14. **Trusted user expansion** — support separate friend and family accounts, privacy, and optional sharing.
15. **Production hardening** — strengthen security, observability, performance, reliability, and operations.

Milestone ordering may change as requirements become clearer. Detailed implementation tickets for later milestones should wait until their requirements and dependencies are understood.

# Decision Log

## 2026-07-11 — Define the domain before application features

**Status:** Accepted

**Context:** Shared language and boundaries are needed before UI, persistence, or business behavior can be designed responsibly.

**Decision:** Establish formal domain documentation and conservative contracts before implementing product features.

**Consequences:** Later work must use the glossary, boundaries, workflows, scope, and invariants as its starting point and update them when decisions change.

## 2026-07-11 — Make mobile-first daily execution a core capability

**Status:** Accepted

**Context:** The primary user needs to act and check in quickly from a phone.

**Decision:** Treat fast mobile-first daily execution as central to the initial product, not a later adaptation.

**Consequences:** The future daily surface prioritizes immediate clarity, touch-friendly actions, and brief visits over dense analysis.

## 2026-07-11 — Connect distinct planning/reflection and daily-execution workflows

**Status:** Accepted

**Context:** Deep planning and reflection have different interaction needs from everyday action.

**Decision:** Treat planning/reflection and daily execution as distinct but connected usage modes.

**Consequences:** Planning supplies context to execution; dated execution records feed weekly and seasonal reflection without either workflow duplicating ownership.

## 2026-07-11 — Separate conceptual domain responsibilities

**Status:** Accepted

**Context:** Planning, action, interpretation, assistance, identity, and reporting have different sources of truth.

**Decision:** Separate Planning, Execution, Reflection, Coaching, Identity and Access, and Insights conceptually; allow Health to begin with shared primitives while preserving a specialization seam.

**Consequences:** Domains may reference one another through explicit boundaries but must not duplicate or silently mutate another domain's records.

## 2026-07-11 — Keep core domain types framework-independent

**Status:** Accepted

**Context:** Product language should not be controlled by presentation or infrastructure choices.

**Decision:** Keep core domain TypeScript contracts independent from Next.js, React, routes, persistence, and providers.

**Consequences:** `src/domain` contains definitions only; runtime behavior and integration abstractions wait for evidence and later milestones.

## 2026-07-11 — Postpone infrastructure and external configuration

**Status:** Accepted

**Context:** Authentication, persistence, AI, and deployment-domain choices require later requirements and should not distort the first model.

**Decision:** Postpone authentication, persistence, AI integration, production domain selection, and custom domain configuration.

**Consequences:** Initial contracts contain no user IDs, storage assumptions, provider code, or production URL configuration.

## 2026-07-11 — Use `/today` as the initial default application route

**Status:** Accepted

**Context:** The daily execution surface is a central mobile-first experience and needs a concrete shell route.

**Decision:** Redirect `/` to `/today` for the initial application shell.

**Consequences:** Today remains a working name and the route or default landing behavior may change after workflow validation.

## 2026-07-11 — Adapt primary navigation by viewport

**Status:** Accepted

**Context:** Phone use benefits from reachable bottom navigation while wider layouts can provide persistent context.

**Decision:** Use a five-destination bottom navigation on mobile and a persistent left sidebar at desktop widths.

**Consequences:** Both navigation modes share destinations and active-route semantics; future growth may require revisiting mobile overflow.

## 2026-07-11 — Establish semantic CSS design tokens

**Status:** Accepted

**Context:** The shell needs consistent visual language without committing to a large component or theme system.

**Decision:** Define a restrained set of semantic CSS tokens for color, spacing, dimensions, radius, focus, and elevation.

**Consequences:** Visual components consume semantic values, and dark mode remains postponed until a complete accessible palette is justified.

## 2026-07-11 — Use static representative shell data

**Status:** Accepted

**Context:** Page hierarchy and responsive behavior must be evaluated before persistence and domain behavior exist.

**Decision:** Use clearly illustrative local page data and disabled/non-functional controls during this milestone.

**Consequences:** Displayed progress, tasks, check-ins, reflections, and scores are not records or accepted calculation rules.

## 2026-07-11 — Keep the shell independent from persistence

**Status:** Accepted

**Context:** Persistence, generation, scheduling, and interaction rules remain unresolved or postponed.

**Decision:** Implement presentation structure without data access, APIs, server actions, domain services, or working mutations.

**Consequences:** Later behavior must enter through explicit application and domain boundaries rather than becoming embedded in UI components.

## 2026-07-11 — Isolate client-only navigation behavior

**Status:** Accepted

**Context:** Active-route indication requires the current pathname, while the rest of the static shell needs no browser behavior.

**Decision:** Prefer Server Components and isolate `usePathname` to the desktop and mobile navigation renderers.

**Consequences:** Product layouts and pages remain server-rendered, and no global client state is introduced.

## 2026-07-11 — Establish an explicit season lifecycle

**Status:** Accepted

**Context:** Season history requires deliberate transitions rather than implicit status mutation.

**Decision:** Use draft, active, completed, and archived season states. Archived is initially a terminal lifecycle state; completed seasons may be archived while retaining completion history.

**Consequences:** Draft cannot complete directly, completed cannot reactivate, and archiving an active season does not imply completion.

## 2026-07-11 — Establish an explicit goal lifecycle

**Status:** Accepted

**Context:** Pausing, completing, and abandoning goals have distinct historical meaning.

**Decision:** Use draft, active, paused, completed, and abandoned goal states. Completed and abandoned are terminal; paused goals must reactivate before completion.

**Consequences:** Goals are not deleted as lifecycle behavior and remain represented in season history.

## 2026-07-11 — Use pure immutable transitions and structured errors

**Status:** Accepted

**Context:** Core behavior must be testable and independent from presentation, transport, and persistence.

**Decision:** Implement transitions as pure functions returning new values through `DomainResult`, with explicit transition, validation, and progress errors.

**Consequences:** Expected domain failures do not rely on generic exceptions, and source objects remain unchanged.

## 2026-07-11 — Support four initial outcome types

**Status:** Accepted

**Context:** Initial goals need understandable measurement without speculative formulas.

**Decision:** Support boolean, numeric-target, percentage, and count outcomes. Preserve raw values while clamping normalized display progress to `0–100%`.

**Consequences:** Zero/negative targets and invalid progress values are rejected; ranges, weighting, reverse metrics, and forecasting remain postponed.

## 2026-07-11 — Keep goal completion explicit

**Status:** Accepted

**Context:** Measured progress and user intent are related but not interchangeable.

**Decision:** Outcome and milestone progress never changes goal lifecycle automatically; goal completion requires an explicit transition.

**Consequences:** A completed goal need not display exactly `100%`, and progress updates cannot silently complete or reopen it.

## 2026-07-11 — Use transparent unweighted summaries

**Status:** Accepted

**Context:** Dashboard-supporting summaries are useful, but a motivational or weighted score would be premature.

**Decision:** Average outcome progress equally; exclude draft and abandoned goals from season progress averages, include active/paused/completed goals, and retain every status in historical counts. Exclude skipped milestones from their progress denominator.

**Consequences:** Empty aggregates return `null`, abandoned work stays visible historically, and no single motivational score is produced.

## 2026-07-11 — Test domain behavior with Node's built-in runner

**Status:** Accepted

**Context:** Pure TypeScript behavior needs focused tests without browser or component infrastructure.

**Decision:** Compile tests with a dedicated TypeScript configuration and run them with `node:test` through `npm test`.

**Consequences:** The project gains deterministic domain tests without adding a dependency; browser and UI tests remain outside this milestone.

## 2026-07-11 — Introduce explicit planning repository interfaces

**Status:** Accepted

**Context:** Storage must be replaceable without moving persistence concerns into domain objects or exposing vendor query syntax.

**Decision:** Define separate repositories for seasons, goals, outcomes, and milestones. Repositories return domain objects through structured persistence results; normal lookup misses return `null`.

**Consequences:** Application orchestration can depend on narrow contracts while domain behavior remains unaware of persistence.

## 2026-07-11 — Separate persistence records with pure validating mappers

**Status:** Accepted

**Context:** Stored representations need explicit nullable primitives and reconstruction safety without becoming domain rules.

**Decision:** Store each identified planning concept in its own primitive record and use pure mappers to preserve parent IDs, dates, statuses, timestamps, and raw progress. Malformed records return vendor-neutral `invalid_record` errors.

**Consequences:** Records can evolve behind the boundary, mapping does not repair or transition data, and no domain-contract refinement was required.

## 2026-07-11 — Validate repository contracts in memory

**Status:** Accepted

**Context:** Persistence semantics should be proven before selecting production technology.

**Decision:** Provide isolated in-memory repositories with create-or-replace save semantics, deterministic ordering, and record mapping on every read/write for reference isolation.

**Consequences:** Duplicate IDs replace complete records, no state is global, and the implementation provides no production durability.

## 2026-07-11 — Omit repository deletion initially

**Status:** Accepted

**Context:** Product deletion policy is unresolved and historical preservation is already accepted.

**Decision:** Omit delete operations until application policy defines legitimate physical-deletion cases.

**Consequences:** Lifecycle transitions remain the normal record-retention mechanism; draft cleanup and administrative deletion remain future decisions.

## 2026-07-11 — Group repositories without claiming transactions

**Status:** Accepted

**Context:** Future orchestration benefits from receiving one planning persistence dependency, but transaction semantics cannot be designed honestly against isolated maps.

**Decision:** Add `PlanningUnitOfWork` as a repository grouping only, with no commit, rollback, or transaction API.

**Consequences:** Dependency injection is simpler while real atomic behavior waits for a transaction-capable implementation and proven use cases.

## 2026-07-11 — Postpone aggregate loading and production storage selection

**Status:** Accepted

**Context:** No application service consumes persisted planning data yet, so aggregate query shape and storage technology lack evidence.

**Decision:** Postpone season aggregate loading, databases, ORMs, migrations, and vendor constraints. Individual repositories preserve parent IDs but do not fake cross-repository referential integrity.

**Consequences:** Future application orchestration will define focused aggregate queries and parent checks; later database constraints will enforce storage integrity.

## 2026-07-11 — Introduce focused framework-independent application services

**Status:** Accepted

**Context:** Routes and UI should not reproduce use-case coordination or call repositories directly.

**Decision:** Implement focused dependency-injected async functions for planning creation, lifecycle, progress, milestones, and overview assembly. Services depend on domain behavior and persistence interfaces only.

**Consequences:** Future adapters receive one use-case boundary; no command bus, service superclass, framework dependency, or concrete repository dependency is introduced.

## 2026-07-11 — Separate application errors from lower layers

**Status:** Accepted

**Context:** Adapters need stable failures without exposing storage details or losing domain validation context.

**Decision:** Translate domain and persistence results into structured application errors, preserving domain fields while hiding persistence implementation messages. Missing targets and broken parent references remain distinct.

**Consequences:** Expected failures do not throw, `not_found` differs from `integrity_failure`, and vendor errors do not cross the application boundary.

## 2026-07-11 — Inject clock and identifier generation

**Status:** Accepted

**Context:** Creation and lifecycle operations require deterministic timestamps and IDs without coupling use cases to platform randomness or time.

**Decision:** Define `Clock` and `IdGenerator` contracts and require them through planning dependencies.

**Consequences:** Tests use fixed time and deterministic IDs; no UUID dependency or production implementation is required yet.

## 2026-07-11 — Freeze historical parents and active-only progress

**Status:** Accepted

**Context:** Child changes after season completion would undermine historical snapshots, and progress on inactive goals is ambiguous.

**Decision:** Allow goal creation/lifecycle within draft or active seasons, freeze children of completed/archived seasons, and allow outcome/milestone progress only for active goals in active seasons.

**Consequences:** These remain explicit application policies around domain rules and may evolve only through a documented product decision.

## 2026-07-11 — Assemble season overview in the application layer

**Status:** Accepted

**Context:** Future adapters need one planning read model without turning placeholder UI or repository aggregates into domain concepts.

**Decision:** Compose season, ordered children, and existing domain summaries into a non-persisted `SeasonOverview`; fail explicitly on inconsistent relationships.

**Consequences:** Repository aggregate queries remain postponed and may later optimize this use case behind compatible boundaries.

## 2026-07-11 — Limit commands to one write without transaction claims

**Status:** Accepted

**Context:** The current unit of work has no transaction semantics.

**Decision:** Permit multi-repository reads followed by at most one write per implemented command. Do not claim commit, rollback, or atomic multi-record behavior.

**Consequences:** No partial multi-write operations exist; future production persistence must supply transactions and uniqueness constraints where required.

# Product and Domain Documents

- [Domain glossary](./docs/domain-glossary.md)
- [Domain boundaries](./docs/domain-boundaries.md)
- [Primary-user workflows](./docs/primary-user-workflows.md)
- [Initial product scope](./docs/initial-product-scope.md)
- [Domain invariants](./docs/domain-invariants.md)
- [Mobile-first principles](./docs/mobile-first-principles.md)
- [Application shell and design foundation](./docs/application-shell.md)
- [Season and goal domain behavior](./docs/season-goal-behavior.md)
- [Initial persistence boundary](./docs/persistence-boundary.md)
- [Application service layer](./docs/application-services.md)

# Unresolved Product Questions

Important open questions are maintained in [Initial Product Scope](./docs/initial-product-scope.md). The highest-impact questions concern season length and goal limits; stored versus generated daily tasks and stable occurrence identities; habit versus recurring-action and project versus goal models; rollover and deferral history; check-in contents and editing; reflection version history; score calculation; and whether Today remains the final name, route, navigation position, and landing page. Final production domain, URL structure, dark mode, and expanded-navigation behavior remain postponed.

# Current Milestone

## Application Service Layer

**Current objective:** Establish framework-independent planning use cases that coordinate domain behavior and persistence contracts through deterministic dependencies and stable application results.

**Included work:** Season/goal creation and lifecycle orchestration; outcome and milestone updates; centralized parent-state policies; application error translation; clock/ID contracts; season overview assembly; deterministic integration tests; and documented atomicity limits.

**Explicitly excluded work:** Route/UI/server-action/API wiring, authentication/ownership, production database/ORM, transaction APIs, multi-record writes, general editing, outcome/milestone creation, daily execution, reflections, AI, notifications, analytics, caching, and deployment configuration.

**Completion criteria:** Services reuse domain behavior, depend on repository interfaces, translate failures, enforce documented parent policies, perform at most one write, assemble deterministic overviews, pass all suites and dependency audits, and leave routes/static UI unchanged.

**Next decision point:** Connect one read-only product surface to the application layer through a thin framework adapter without introducing mutation or production storage.
