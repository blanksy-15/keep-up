# Vision

Keep-up is a personal operating system for intentional growth, execution, reflection, and long-term progress. It will bring goals, habits, health, projects, and personal growth into one coherent system that helps a person decide what matters, act consistently, learn from outcomes, and carry useful context forward.

# Core Philosophy

- Favor sustainable progress over short-term intensity.
- Support reflection as well as action.
- Keep the system useful without making it burdensome.
- Favor clarity over excessive complexity.
- Build for the primary user first while preserving a path toward broader use.
- Treat historical outcomes as useful context for future planning.

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
├── src/
│   └── app/            # App Router routes, layouts, metadata, and global styles
├── PROJECT_PLAN.md     # Living architecture and roadmap
└── configuration files
```

The initial structure deliberately retains only directories with immediate value. As product requirements emerge, use these conventions:

- `src/app`: routing and route composition; route files should remain thin.
- `public`: static assets once the application has assets to serve.
- `src/components`: reusable, domain-agnostic UI when shared components actually exist.
- `src/features/<domain>`: domain-oriented modules containing a capability's business concepts and application logic.
- `src/lib`: focused shared utilities with clear names and ownership, not a general dumping ground.
- `src/server`: server-only orchestration, integration boundaries, and data access once introduced.
- `src/config`: typed application configuration once configuration beyond framework defaults exists.
- `src/types`: truly shared types only; domain types should stay with their domain.

Future business capabilities should be organized by domain or feature rather than accumulated in unrelated global folders. Planned directories should be created only when they have a concrete implementation to contain.

# Long-Term Product Vision

The following concepts are future roadmap possibilities only. Their inclusion here does **not** authorize implementation:

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

# Initial Roadmap

1. **Project initialization** — establish the buildable framework, repository, and living documentation.
2. **Product and domain definition** — clarify vocabulary, user needs, boundaries, and initial workflows.
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

Use the following format for substantive decisions. No substantive decisions are recorded yet.

## YYYY-MM-DD — Decision title

**Status:** Proposed | Accepted | Superseded

**Context:**

**Decision:**

**Consequences:**

# Current Milestone

## Project Initialization

**Current objective:** Establish a clean, production-quality, buildable Next.js foundation and the documentation needed to guide later work.

**Included work:** Next.js initialization, TypeScript, Tailwind CSS, ESLint, App Router, `src` organization, npm scripts, Git ignore rules, a neutral landing page, and repository documentation.

**Explicitly excluded work:** Authentication, persistence, ORM configuration, API endpoints, AI, application features, domain behavior, dashboards, analytics, notifications, accounts, and placeholder business logic.

**Completion criteria:** Dependencies install successfully; lint, type checking, and production build pass; the development server starts; the repository root and ignore rules are verified; documentation accurately describes the initialized architecture; and no application features are present.

**Next decision point:** Define the product vocabulary and domain boundaries for the first user workflow before selecting infrastructure or building the application shell.
