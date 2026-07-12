# Domain Invariants

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

## Proposed

- **Proposed:** Weekly reflections must not silently overwrite prior historical content; the exact edit/version mechanism is undecided.
- **Proposed:** Progress updates preserve enough history to support later reflection and analytics; the required granularity is undecided.
- **Proposed:** A season's date range has a start no later than its end.
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
