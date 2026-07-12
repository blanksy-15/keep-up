# Application Service Layer

Season workflow services edit setup drafts, evaluate readiness, require confirmation, generate conversion plans, capture reviews, apply explicitly accepted proposals, approve selected insights, and finalize reviews. Dependencies are injected and workflow persistence remains separate from authoritative planning writes.

The application layer represents planning use cases by coordinating domain behavior with persistence contracts. It is framework-independent and is not connected to routes, server actions, APIs, or the static UI.

## Dependency direction

```text
Future routes, server actions, or UI adapters
                    ↓
Focused application-service functions
                    ↓
Domain behavior + persistence contracts
                    ↓
Replaceable persistence implementations
```

Domain code imports neither application nor persistence. Persistence imports domain contracts but not application. Application services import domain contracts/behavior and persistence interfaces, never the in-memory implementations, React, Next.js, Tailwind, routes, or UI components.

Routes and UI adapters must eventually call application services rather than coordinate repositories directly.

## Service style

Each use case is a focused async function receiving explicit `PlanningApplicationDependencies` and a typed input or identifier. Dependencies contain repository interfaces grouped by `PlanningUnitOfWork`, a `Clock`, and an `IdGenerator`. There are no stateful service classes, generic command handlers, mediator, event bus, or dependency-injection framework.

## Results and errors

Normal use-case failures return `ApplicationResult<T>` with application-level errors:

- `not_found`
- `validation_failed`
- `invalid_transition`
- `conflict`
- `persistence_failure`
- `integrity_failure`
- `atomicity_failure` (reserved for a real detected case; currently unused)

Domain validation fields and messages are retained while domain codes are translated. Persistence failures are converted to stable application messages, so storage implementation details and vendor errors are not exposed. A normal missing target becomes `not_found`; a missing parent of an existing child becomes `integrity_failure`. Unexpected programming errors may still throw, but expected failures do not use exceptions.

## Clock and ID boundaries

Use cases never call `Date.now()` or generate random IDs directly. `Clock.now()` supplies lifecycle/update timestamps and `Clock.today()` reserves a date-only boundary for future date-based use cases. `IdGenerator` supplies externally generated season, goal, outcome, and milestone identifiers. Current creation services use season and goal IDs; deterministic test implementations cover both timestamps and IDs without a UUID dependency.

## Implemented use cases

### Season creation

`createSeason` validates a non-empty title/intent and real ordered calendar dates, checks generated-ID conflict, constructs a draft season, and performs one save. Draft creation has narrower rules than activation and does not require goals.

### Goal creation

`createGoal` validates title/description, loads its parent season, checks generated-ID conflict, and creates a draft goal with the parent `seasonId`. Draft and active seasons may accept new draft goals. Completed and archived seasons are historically frozen. No default outcome is created.

### Season lifecycle

`activateSeason` loads the season, its deterministically ordered goals, and each goal's outcomes, checks relationship integrity, then calls the existing domain transition. Activation-ready draft goals remain draft; activation does not transition them. `completeSeason` and `archiveSeason` call the same domain lifecycle behavior. No operation changes child records, completes goals, creates reviews, or deletes history.

### Goal lifecycle

Focused functions activate, pause, resume, complete, and abandon goals through existing domain behavior. Goal activation/resumption loads outcomes for domain validation. Goal lifecycle changes are allowed while the parent season is draft or active and rejected after the season is completed or archived.

### Outcome progress

`updateOutcomeProgress` loads the outcome, goal, and season; applies parent-state policy; builds the existing `OutcomeProgress` representation; calls domain progress calculation; saves one outcome; and returns the saved outcome plus normalized calculation. Boolean outcomes require boolean input; other outcome types require numbers. Raw over-target values are preserved. No progress update changes goal status or writes summary/history records.

### Milestone status

`updateMilestoneStatus` loads the milestone and its parents, applies the same progress policy, calls domain transition behavior, and saves one milestone. It does not create completion records or change goal status.

### Season overview

`getSeasonOverview` is an application read model, not a domain entity or persisted record. It contains the season, ordered goals, each goal's ordered outcomes/milestones and domain `GoalSummary`, plus a domain `SeasonSummary`. It reuses repository ordering and domain summary functions. Any child returned with an inconsistent parent identifier produces `integrity_failure`; relationships are never silently hidden or repaired.

## Parent-state application policies

These restrictions are application policies around existing domain lifecycle rules:

| Parent state | Goal creation/lifecycle | Outcome or milestone progress |
| --- | --- | --- |
| Draft season | Goal creation and valid goal lifecycle transitions allowed | Rejected |
| Active season | Goal creation and valid goal lifecycle transitions allowed | Allowed only for active goals |
| Completed season | All child mutation rejected | Rejected |
| Archived season | All child mutation rejected | Rejected |
| Draft goal | Planning/lifecycle transitions allowed by domain | Rejected |
| Active goal | Lifecycle transitions allowed by domain | Allowed in active season |
| Paused goal | Resume/abandon allowed by domain | Rejected |
| Completed goal | Terminal | Rejected |
| Abandoned goal | Terminal | Rejected |

These policies preserve completed-season snapshots. They may evolve with explicit product evidence and should not be mistaken for new domain lifecycle transitions.

## Atomicity expectations

Every implemented command performs multiple reads when validation needs related state, followed by at most one repository write. No use case writes several records. A generated-ID conflict check followed by save is best-effort without a transaction and may need a storage uniqueness constraint later.

The current `PlanningUnitOfWork` only groups repositories. No commit, rollback, or transaction behavior is claimed. Future production persistence must provide transactions and constraints when a use case needs atomic multi-record writes or race-free read-then-write guarantees. `atomicity_failure` remains unused until a real partial-write condition exists.

## Testing strategy

Application services are tested against isolated in-memory units of work using a fixed clock, deterministic ID generator, and small domain fixtures. Tests cover creation, lifecycle orchestration, validation failure/no-write behavior, parent policies, progress, milestone transitions, overview assembly, ordering, summary reuse, integrity failures, reference safety, and error mapping. Existing domain and persistence suites remain unchanged and run together.

## Deliberately postponed

- Route, server-action, API, React, and static-UI integration
- Authentication, ownership, and authorization
- Production database/ORM and application composition root
- Real transaction support and multi-record writes
- Outcome/milestone creation use cases and general editing
- Daily tasks, check-ins, reflections, coaching, notifications, and analytics
- Progress history and milestone history
- Caching, jobs, events, and deployment configuration

No production persistence or user identity exists. Daily execution remains outside this milestone.
