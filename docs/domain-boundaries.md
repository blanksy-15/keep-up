# Domain Boundaries

These boundaries divide responsibility and vocabulary, not necessarily code packages or services. The initial implementation may remain simple while preserving these seams.

## Planning

- **Responsibilities:** define seasons, intent, priorities, scope, goals, outcomes, milestones, and reusable goal templates.
- **Owns:** Season, Season Intent, Goal, Outcome, Milestone, and Goal Template definitions.
- **May reference:** execution summaries and prior carry-forward insights when planning.
- **Must not own:** task completion history, reflections, authentication, analytics, or coaching output.
- **Status:** core lifecycle, activation, progress, and summary behavior is implemented as pure TypeScript; templates are later.
- **Integration boundary:** publishes stable planning identifiers, explicit immutable transitions, validation results, and unweighted summaries without knowing presentation or persistence.

## Execution

- **Responsibilities:** daily plans and tasks, Today View composition, habits, recurring actions, projects, progress updates, completion records, basic deferral/rescheduling, and daily check-ins.
- **Owns:** execution records and the current state of execution concepts. The Today View is a consumer/presentation surface, not an owner.
- **May reference:** planning sources and their identifiers, including Goal, Outcome, and Milestone.
- **Must not own:** goal meaning, weekly interpretation, season reviews, account permissions, or analytical aggregates.
- **Status:** required for the initial product, with deliberately limited scheduling behavior.
- **Integration boundary:** exposes dated activity and progress history to Reflection and future Insights.

A daily task may originate from a goal, outcome, milestone, habit, recurring action, project, or manual standalone entry. It is explicitly undecided whether tasks are stored as independent records, generated from source entities, or use a hybrid model. Stable identities for generated occurrences and rollover behavior are also later architectural questions.

Daily check-ins are created through the Execution experience because they are part of the daily loop. Execution owns the record and its date; Reflection consumes it as historical evidence. Reflection must not create a competing check-in record.

## Reflection

- **Responsibilities:** weekly scorecards, weekly reflections, season reviews, lessons learned, carry-forward insights, and historical interpretation.
- **Owns:** reflective records and selected insights, not the underlying execution facts.
- **May reference:** seasons, goals, outcomes, daily check-ins, progress updates, and completion records.
- **Must not own:** task status, task scheduling, source entities, or analytical infrastructure.
- **Status:** weekly and seasonal reflection are initial capabilities; richer interpretation is later.
- **Integration boundary:** consumes immutable-enough dated records and publishes selected insights back to future Planning.

## Health

- **Responsibilities:** health-related goals, metrics, check-ins, and trends when needed.
- **Owns:** only specialized health meaning or behavior that shared primitives cannot express.
- **May reference:** shared goals, outcomes, metrics, daily check-ins, and execution records.
- **Must not own:** duplicate general-purpose goal, outcome, check-in, or trend models.
- **Status:** specialized Health is postponed and need not be a separate implementation domain initially.
- **Integration boundary:** begin with shared goal, outcome, metric, and check-in primitives where sufficient; preserve an explicit seam for future health-specific privacy, units, validation, or integrations.

## Coaching

- **Responsibilities:** future AI-assisted setup, prompts, commentary, pattern recognition, recommendations, summaries, and reflection assistance.
- **Owns:** coaching interactions and provider-neutral interpretation policies, not core user records.
- **May reference:** structured, permission-appropriate information from Planning, Execution, Reflection, Health, and Insights through explicit interfaces.
- **Must not own:** goals, tasks, check-ins, reflections, or business rules; must never silently change user-owned data or hide rules in prompts/provider code.
- **Status:** postponed.
- **Integration boundary:** provider adapters remain outside domain rules; any proposed mutation requires an explicit user-visible application action.

## Identity and Access

- **Responsibilities:** future accounts, authentication, ownership, privacy, household/family relationships, permissions, shared goals, and accountability relationships.
- **Owns:** identities, grants, roles, and relationship/permission records.
- **May reference:** domain record identifiers when expressing ownership or access.
- **Must not own:** planning, execution, or reflection content.
- **Status:** postponed; the initial product has one primary user and no pretend account model.
- **Integration boundary:** future domains must accept ownership/access decisions without coupling core types to an authentication provider.

## Insights

- **Responsibilities:** future analytics, trends, comparisons, aggregated summaries, and daily/weekly/seasonal reporting.
- **Owns:** derived projections and aggregate definitions.
- **May reference:** historical records across Planning, Execution, Reflection, and Health.
- **Must not own:** the source records or mutate them to fit a report.
- **Status:** postponed beyond the limited summaries needed for initial scorecards/dashboard.
- **Integration boundary:** derivations must be reproducible from authoritative records and clearly distinguish computed data from user-authored interpretation.

## Overlap and sources of truth

- Planning defines goals and outcomes; Execution references them but does not duplicate their definitions.
- Execution records what happened; Reflection interprets that history without replacing it.
- Daily Check-In has one owner (Execution) even though Reflection consumes it.
- Health extends shared primitives only when specialized behavior is justified.
- Dashboard and Today View are read/composition surfaces, never record owners.
- Insights stores or computes derived views without becoming an alternative history.
- Coaching suggests and explains through explicit interfaces; accepted changes flow through the owning domain.
- Identity and Access governs who may act on a record, while the record remains owned by its business domain.

## Persistence infrastructure boundary

Persistence is infrastructure, not a user-facing product domain. It stores and reconstructs domain state through explicit repository interfaces and must not define lifecycle rules, calculate progress, or silently change user-owned records. Future application services will coordinate domain behavior with repository operations; future identity and authorization checks will sit above or around persistence. Vendor-specific database code, migrations, and error translation must remain behind repository implementations. See [Initial Persistence Boundary](./persistence-boundary.md).
