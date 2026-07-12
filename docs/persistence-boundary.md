# Initial Persistence Boundary

Product repository contracts are owner-scoped. PostgreSQL filters reads by owner, rejects cross-owner replacement and parent linkage, and stores non-null owner foreign keys on all authoritative tables. Better Auth tables remain authentication infrastructure and never leak credentials into product repositories.

PostgreSQL with Drizzle is the first durable adapter; in-memory repositories remain supported. Migration files own schema change. Application services see repository and transaction-runner contracts, never Drizzle. Database constraints protect structural relationships while domain behavior owns lifecycle rules. PostgreSQL errors map to stable persistence errors, routes do not access the database, and deletion remains omitted.

Real PostgreSQL CI is required for locking claims. PGlite remains the fast compatibility layer, while PostgreSQL 16 tests migration behavior, driver translation, transaction rollback, and separate-connection contention.

Setup drafts and reviews have dedicated repository contracts and in-memory adapters. Nested values contain serializable domain primitives. In-memory adapters deep-clone reads and writes and sort lists deterministically.

This boundary stores and reconstructs planning-domain state without choosing a database, ORM, hosting provider, transport, or deployment model. The in-memory implementation validates the contracts and is not production persistence.

## Dependency direction

```text
Future application/server orchestration
                 ↓
Persistence contracts and implementations
                 ↓
Domain contracts

Domain behavior ── no dependency on persistence
```

Persistence may import domain contracts because repositories return domain objects. Domain contracts and behavior must not import persistence. UI, routes, React, and Next.js are outside the persistence module.

## Responsibilities

The domain owns lifecycle meaning, activation, progress, summaries, and historical rules. Persistence owns serialization, storage/retrieval boundaries, normal not-found behavior, record reconstruction safety, deterministic query ordering, and storage failures. Repositories never transition statuses, calculate progress, infer completion, or authorize users.

Application services coordinate domain transitions and repository saves. Identity and authorization will be applied above or around this boundary later rather than embedded in records or repositories. Routes and UI must not call repositories directly.

## Repository contracts

Four explicit interfaces cover only current needs:

- `SeasonRepository`: find by ID, list, and save.
- `GoalRepository`: find by ID, list by season ID, and save.
- `OutcomeRepository`: find by ID, list by goal ID, and save.
- `MilestoneRepository`: find by ID, list by goal ID, and save.

There is no generic repository or base class. Interfaces expose domain objects, never records or implementation-specific query syntax.

## Records and mappers

Separate season, goal, outcome, and milestone records contain serializable primitives only. Optional domain fields become explicit nullable record fields, date-only strings remain separate from timestamps, and parent IDs remain on child records. Relationships are not flattened into a season blob.

Pure mappers convert domain objects to records and validate records during reconstruction. They preserve lifecycle timestamps, parent identifiers, raw progress, and supported optional fields. They do not mutate inputs, provide hidden defaults, repair malformed data, calculate progress, or change lifecycle state. Malformed records return `invalid_record` results.

No domain-contract changes were required for this milestone.

## Save, lookup, and error semantics

`save` is create-or-replace by externally supplied ID. Saving the same ID replaces the entire prior record; patch semantics and automatic IDs are not supported. This makes behavior deterministic and keeps conflict policy outside the first implementation.

`findById` returns `ok: true` with `null` when no record exists. A normal miss is distinct from `storage_failure`. Expected failures use `PersistenceResult<T>` with vendor-neutral codes:

- `conflict`
- `invalid_record`
- `storage_failure`

No database-vendor error is exposed.

## In-memory implementation

Every repository instance owns an isolated `Map`; there is no singleton or global mutable store. Domain objects are mapped to flattened records on write and reconstructed on every read. This prevents callers from mutating stored state through either input objects or returned references.

List ordering is explicit and insertion-independent:

- seasons: start date, then ID;
- goals: creation timestamp, then ID;
- outcomes: ID;
- milestones: ID.

The implementation has no artificial latency, events, cache, or production durability.

## Relationships and referential integrity

Goal records preserve `seasonId`; outcome and milestone records preserve `goalId`. Individual repositories do not verify parent existence because they intentionally have no access to other repositories. Referential integrity will be coordinated by future application services and, later, by transaction-capable implementations and database constraints. The in-memory layer does not fake guarantees it cannot enforce.

## Deletion decision

Delete operations are omitted. Physical deletion may eventually be useful for draft cleanup, testing administration, or legal/retention requirements, but end-user deletion policy conflicts with the current emphasis on historical preservation and is not defined. Lifecycle transitions—not repository deletion—remain the normal way to complete, abandon, or archive records.

## Unit-of-work decision

`PlanningUnitOfWork` is implemented as a small repository grouping for dependency injection. `InMemoryPlanningUnitOfWork` creates one isolated instance of each repository. It has no `commit`, `rollback`, or transaction methods because the in-memory implementation cannot establish a meaningful future database transaction contract yet.

## Aggregate-loading decision

Repository-level season aggregate loading remains postponed. The application layer now assembles a `SeasonOverview` read model through existing repository contracts because that use case is immediately useful; it does not persist the overview or introduce a broad persistence query. A future production implementation may optimize the reads behind compatible contracts after real performance evidence.

## Testing strategy

Node's existing built-in test setup covers record round trips, malformed reconstruction, lifecycle and parent-field preservation, create-or-replace semantics, deterministic ordering, normal misses, reference isolation, repository-instance isolation, relationship filters, raw progress, and unit-of-work grouping. Tests target public contracts rather than internal map structure.

## Explicitly postponed

- Production database and ORM selection
- SQL/vendor schemas, migrations, and environment variables
- Transactions and database constraints
- Aggregate queries and application services
- UI, route, API, or server-action integration
- Authentication, ownership, and authorization
- Daily tasks, check-ins, reflection, and season-review persistence
- Caching, background jobs, subscriptions, and analytics storage
- Deletion and conflict policies beyond create-or-replace

## Criteria for selecting production storage

A later decision should be based on proven application queries and atomic operations; deployment and operational constraints; transaction and referential-integrity needs; backup, migration, and recovery requirements; privacy and ownership requirements; expected scale; local-development ergonomics; and the ability to implement these repository contracts without leaking vendor behavior into domain logic.
