# Domain Invariants

## Guided season workflows

- Setup drafts are separate from authoritative seasons and never activate planning records.
- Confirmed setup drafts and finalized reviews are immutable.
- Readiness warnings do not block confirmation; structural blockers do.
- Goals are user-owned, open-ended statements without required categorization.
- Assistant proposals require explicit user selection or approval.
- Reviews exist only for completed seasons and never mutate their source season.
- Carry-forward insights retain traceability and never create commitments automatically.

Labels mean:

- **Accepted:** established for this product direction and suitable to guide later implementation.
- **Proposed:** likely useful but needs validation before becoming a hard rule.
- **Undecided:** explicitly unresolved; implementations must not assume an answer.

## Accepted

- **Accepted:** A goal belongs to one season.
- **Accepted:** An outcome belongs to one goal.
- **Accepted:** A milestone supports one goal when used.
- **Accepted:** A daily task may link to a domain source or be manually created; a goal link is not mandatory.
- **Accepted:** A completion record represents an action completed on a specific calendar date, optionally at a precise time.
- **Accepted:** Completing a generated/presented task must not erase its originating habit, milestone, recurring action, or other source.
- **Accepted:** Deferring or rescheduling must not silently erase prior scheduling history.
- **Accepted:** A daily check-in belongs to one calendar date.
- **Accepted:** A weekly scorecard belongs to one season and one calendar or season week.
- **Accepted:** A completed season retains the goals, outcomes, daily records, results, and reflections that existed during it.
- **Accepted:** Carry-forward insights originate from a historical weekly reflection or season review.
- **Accepted:** Coaching may interpret data but must not silently change user-owned records.
- **Accepted:** Archived or completed records do not disappear merely because a new season begins.
- **Accepted:** Daily execution records remain available to weekly and seasonal reflection.
- **Accepted:** A product view such as Today View does not own domain data.
- **Accepted:** Completed seasons cannot return to active.
- **Accepted:** Completed and abandoned goals are terminal and remain in season history.
- **Accepted:** Goal completion is an explicit lifecycle transition and is never inferred from progress.
- **Accepted:** Outcome and milestone progress do not silently alter goal lifecycle status.
- **Accepted:** Domain transition functions return new values and do not mutate their inputs.
- **Accepted:** Invalid lifecycle transitions and invalid progress values produce structured domain errors.
- **Accepted:** Abandoned goals remain in historical counts but are excluded from progress averages.
- **Accepted:** Archival retains existing lifecycle timestamps and historical data.

## Proposed

- **Proposed:** Weekly reflections must not silently overwrite prior historical content; the exact edit/version mechanism is undecided.
- **Proposed:** Progress updates preserve enough history to support later reflection and analytics; the required granularity is undecided.
- **Accepted:** An active season has a start date no later than its end date.
- **Accepted:** Persistence must not silently change lifecycle status or calculate domain progress.
- **Accepted:** Stored and reconstructed goals, outcomes, and milestones preserve their parent identifiers.
- **Accepted:** A normal repository miss is distinct from a storage failure.
- **Accepted:** Repository implementations do not expose mutable internal references.
- **Accepted:** Domain contracts and behavior remain independent from persistence implementations.
- **Accepted:** Application services call domain behavior for lifecycle and progress decisions rather than reproducing those rules.
- **Accepted:** Routes and UI adapters do not coordinate repositories directly.
- **Accepted:** Implemented application commands perform at most one repository write unless future transaction semantics are explicitly introduced.
- **Proposed:** Completion records should retain a link to the originating source when one exists, even if the source is later archived.
- **Proposed:** Season Review becomes the authoritative user-authored closing interpretation while remaining editable only under an explicit future policy.

## Undecided

- **Undecided:** Whether a season must have a standard length.
- **Undecided:** Whether a daily task is stored, generated, or represented through a hybrid.
- **Undecided:** Whether each generated occurrence has a stable identifier.
- **Undecided:** Whether unfinished tasks roll forward automatically.
- **Undecided:** Whether habits and recurring actions use one underlying model.
- **Undecided:** Whether projects are distinct from goals.
- **Undecided:** Whether there may be more than one daily check-in per calendar date.
- **Undecided:** How edits to historical check-ins, reflections, schedules, and outcome progress are versioned.
- **Undecided:** How outcome and weekly scorecard values are calculated or aggregated.
