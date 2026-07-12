# Vision

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
│   ├── app/            # App Router routes, layouts, metadata, and global styles
│   └── domain/         # Framework-independent domain contracts
├── PROJECT_PLAN.md     # Living architecture and roadmap
└── configuration files
```

The initial structure deliberately retains only directories with immediate value. As product requirements emerge, use these conventions:

- `src/app`: routing and route composition; route files should remain thin.
- `docs`: product and domain definitions that govern later implementation decisions.
- `src/domain`: framework-independent types for stable core concepts; no UI, persistence, or runtime services.
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
2. **Product and domain definition** — current; clarify vocabulary, user needs, boundaries, and initial workflows.
3. **Application shell and design foundation** — establish navigation, layout, accessibility, and visual conventions.
4. **Core season and goal domain modeling** — define behavior and rules independently of persistence and presentation.
5. **Initial persistence layer** — select and introduce storage behind explicit data-access boundaries.
6. **Personal dashboard** — compose the primary user's essential views and actions.
7. **Weekly scorecards and reflection** — support review, learning, and planning cycles.
8. **Habit and health tracking** — add focused tracking capabilities based on validated needs.
9. **Analytics and historical insights** — surface useful patterns without encouraging noisy metrics.
10. **Authentication and account ownership** — establish identity, authorization, and ownership boundaries.
11. **AI coaching boundaries and initial integration** — define safe, useful coaching behavior behind a provider boundary.
12. **Notifications** — introduce intentional reminders through selected channels.
13. **Trusted user expansion** — support separate friend and family accounts, privacy, and optional sharing.
14. **Production hardening** — strengthen security, observability, performance, reliability, and operations.

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

# Product and Domain Documents

- [Domain glossary](./docs/domain-glossary.md)
- [Domain boundaries](./docs/domain-boundaries.md)
- [Primary-user workflows](./docs/primary-user-workflows.md)
- [Initial product scope](./docs/initial-product-scope.md)
- [Domain invariants](./docs/domain-invariants.md)
- [Mobile-first principles](./docs/mobile-first-principles.md)

# Unresolved Product Questions

Important open questions are maintained in [Initial Product Scope](./docs/initial-product-scope.md). The highest-impact questions concern season length and goal limits; stored versus generated daily tasks and stable occurrence identities; habit versus recurring-action and project versus goal models; rollover and deferral history; check-in contents and editing; reflection version history; score calculation; and the Today View's name, route, navigation, and landing-page role. Final production domain and URL structure are postponed.

# Current Milestone

## Product and Domain Definition

**Current objective:** Establish shared terminology, domain boundaries, primary-user workflows, initial scope, stable proposed invariants, and lightweight framework-independent contracts before building features.

**Included work:** Product and domain documentation, season and daily-execution workflows, mobile-first principles, conservative TypeScript contracts, and updates to living project guidance.

**Explicitly excluded work:** UI and routes, runtime domain behavior, authentication, persistence, schemas, APIs, AI, analytics, notifications, accounts, scheduling/task generation, and production/custom domain configuration.

**Completion criteria:** Required documents and contracts agree; uncertainty is preserved rather than encoded as behavior; lint, type checking, and production build pass; and no application feature or dependency is introduced.

**Next decision point:** Use the approved product model to define the application shell and design foundation without prematurely implementing unresolved domain behavior.
