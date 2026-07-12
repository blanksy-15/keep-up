# Season and Goal Domain Behavior

This document defines the framework-independent business behavior implemented in `src/domain/behavior`. All functions are pure, return new values, and use structured results rather than generic exceptions. No behavior is connected to the static application shell yet.

## Season lifecycle

```text
draft ──> active ──> completed ──> archived
  └───────────────> archived <──────┘
              active ──> archived
```

- **Draft** may become active after activation validation or may be archived when intentionally discarded. Draft cannot become completed directly.
- **Active** may become completed or archived. Archiving an active season explicitly abandons the active lifecycle; it is not treated as completion.
- **Completed** is historically terminal with respect to execution and cannot return to active. It may become archived for organization while retaining `completedAt`.
- **Archived** is a terminal lifecycle state in the initial model. Restoration is postponed.

Archival is modeled as a lifecycle state rather than a separate visibility flag to keep the first behavior model small. `archivedAt` records the transition, and any existing activation/completion timestamps remain intact.

## Goal lifecycle

```text
draft ──> active ──> paused ──> active
  │          ├────> completed
  └──────────┴────> abandoned
paused ───────────> abandoned
```

- Draft goals may become active when activation-ready or may be abandoned.
- Active goals may be paused, completed, or abandoned.
- Paused goals may return to active after readiness validation or may be abandoned. They cannot move directly to completed in the conservative initial model.
- Completed and abandoned goals are terminal and remain in season history.
- Goal completion is always an explicit user-owned lifecycle transition. It is never inferred from outcome or milestone progress.

## Milestone lifecycle

- `not_started` may become `in_progress`, `completed`, or `skipped`.
- `in_progress` may become `completed` or `skipped`.
- `completed` and `skipped` are terminal.
- Completion and skipping receive their own timestamps.
- Milestone status never changes goal lifecycle status.

## Activation requirements

A season can become active only when it has:

- a non-empty title;
- non-empty start and end dates with start no later than end;
- a non-empty season intent;
- at least one non-abandoned goal; and
- activation-ready non-abandoned goals.

A goal is activation-ready when it has a non-empty title, a non-empty description/intent, and at least one measurable outcome. Milestones, habits, recurring actions, and projects are not required.

Draft goals may remain draft inside an active season, but they must be activation-ready. Season activation validates them without changing their statuses. This preserves explicit user-owned goal activation.

## Supported outcome types and progress

| Type | Raw representation | Normalized progress |
| --- | --- | --- |
| Boolean | `0` for incomplete, `1` for complete | `0%` or `100%` |
| Numeric | Non-negative current value and target greater than zero | `current / target × 100` |
| Percentage | Non-negative percentage value | Raw percentage clamped to `0–100%` |
| Count | Non-negative whole-number current value and whole-number target greater than zero | `current / target × 100` |

Raw over-target values are preserved while normalized display progress is clamped to `0–100%`. Zero or negative targets are invalid for numeric/count outcomes. Negative, non-finite, or type-inappropriate progress values return structured errors. Reverse metrics, ranges, weighting, deadlines, forecasting, and external metrics are postponed.

Outcome progress does not automatically change goal lifecycle status.

## Milestone progress

Completed milestones count as complete. Skipped milestones are reported separately and excluded from the denominator because skipping means the milestone is no longer relevant rather than unsuccessfully completed. Not-started and in-progress milestones remain included but incomplete. When there are no included milestones, normalized milestone progress is `null` rather than a misleading `0%` or `100%`.

## Summary rules

A goal summary reports lifecycle status, outcome counts, completed outcomes, average normalized outcome progress, and optional milestone progress. Outcome progress is averaged equally; there is no weighting. A goal with no outcomes reports `null` average progress.

A season summary reports all historical status counts plus total/completed outcomes. Average goal progress:

- excludes draft goals because they are not active execution commitments;
- includes active and paused goals;
- includes completed goals without forcing them to `100%`;
- excludes abandoned goals from the average while retaining them in historical counts; and
- is `null` when no eligible goal has outcome progress.

Summary functions never mutate or rewrite source records and do not create a motivational score.

## Historical preservation

- Transition functions return new objects and never mutate inputs.
- Existing activation and completion timestamps are preserved.
- Completed seasons and completed/abandoned goals cannot reactivate.
- Archival retains prior lifecycle timestamps and data.
- Abandoned goals remain in historical counts.
- Progress changes never silently alter lifecycle status.
- Summaries interpret current values without modifying them.

This is not event sourcing or version history. Detailed audit/version behavior remains postponed.

## Error and result strategy

Expected domain failures return `DomainResult<T>` with one or more `DomainError` values. Initial codes are:

- `invalid_transition`
- `validation_failed`
- `invalid_progress_value`

Errors may include a field path and user-neutral explanation. Generic exceptions are not the primary validation mechanism.

## Testing strategy

Pure behavior is compiled with a focused `tsconfig.test.json` and tested with Node's built-in `node:test` runner. This adds no test dependency and keeps the suite independent from React and browser tooling. Run it with `npm test`.

## Deliberately postponed and open

- Persistence, repositories, schemas, and user ownership
- UI integration and interactive forms
- Daily tasks, task generation, scheduling, rollover, and check-ins
- Reopening archived seasons or terminal goals
- Whether paused goals should ever complete directly
- Weighted scoring and richer outcome formulas
- Historical versioning and audit records
- Deletion/retention policies beyond lifecycle preservation
- Automatic inference of any lifecycle state

## Application policy note

The application-service layer currently freezes all child mutations after a season is completed or archived and permits outcome/milestone progress only for active goals in active seasons. Draft and active seasons may accept draft goals and valid goal lifecycle transitions. These are orchestration policies around the domain lifecycle, not additional domain statuses or automatic transitions.
