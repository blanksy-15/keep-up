# Season Setup and Review Workflows

Setup, review, and conversion are owner-scoped. Conversion locks `(ownerId, setupDraftId)` and stamps the same owner on the season, goals, outcomes, and milestones; another owner cannot observe the draft's target season.

Confirmed setup drafts can now be converted in one database transaction. Conversion allocates authoritative IDs distinct from proposal IDs, creates only draft seasons/goals plus outcomes and supported milestones, returns proposal-ID mappings, reports unsupported structures, and marks the draft converted with its target season only after every write succeeds. It never activates records or calls an assistant. Repeated conversion is rejected; row locking protects the confirmed-to-converted transition.

Real PostgreSQL tests require two competing conversion connections. The winner commits the sole authoritative graph; after the row lock releases, the loser re-reads `converted` and returns a conflict. Injected failures verify rollback leaves the draft confirmed and retryable.

Season setup is a guided draft, not an authoritative `Season`. It may collect free-form priorities, proposed goals and outcomes, structures, constraints, questions, and approved earlier insights. Goals are user-owned and deliberately have no required category or taxonomy.

The setup lifecycle is `draft -> ready_for_review -> confirmed`. Editing returns review-ready work to `draft`; confirmed drafts are immutable. Readiness separates structural blockers from conservative, non-blocking warnings. Confirmation permits a deterministic conversion plan but does not create or activate a season.

A review belongs to a completed season. Its lifecycle is `draft -> ready_for_summary -> summary_proposed -> finalized`; assistant input is optional. User-authored content and assistant proposals remain separate. Only explicitly selected candidates become approved carry-forward insights. Finalization requires explicit confirmation, does not alter the source season, and does not create the next season.

Approved insights retain source season and review identifiers. A later setup may copy them as context, never as an automatic commitment.
