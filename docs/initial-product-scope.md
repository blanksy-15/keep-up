# Initial Product Scope

Separate authenticated accounts and isolated user-owned planning/workflow records are now supported. Product-data forms remain postponed beyond authentication surfaces. Family sharing, invitations, account recovery, social login, and email delivery remain future work.

The framework-independent core includes guided setup, completed-season review, carry-forward context, readiness evaluation, and provider-neutral assistant ports. It excludes provider SDKs, model configuration, API routes, workflow UI, authentication, database adapters, automatic conversion, activation, and automatic next-season creation.

Durable planning adapters and transactional confirmed-setup conversion now exist. Interactive setup UI, authentication, multi-user ownership, hosted database provisioning, assistant/chatbot integration, daily execution persistence, and automatic activation remain postponed.

## Initial Product

The first coherent release supports one person through one complete season lifecycle and regular daily use. It does not require every included concept to be equally sophisticated.

### Required capabilities

- Create a season with dates, a name, and season intent.
- Define a limited, user-selected set of goals and measurable outcomes.
- Add enough execution structure—milestones, habits, recurring actions, or projects—to connect plans to action without requiring every structure.
- Review a personal dashboard for season plan and progress.
- Use a fast, responsive, mobile-first daily execution surface.
- See today's priorities, tasks, habits, and recurring actions due today.
- Complete work and preserve dated completion history.
- Defer or reschedule supported work without silently erasing prior scheduling context.
- Record a lightweight, skippable daily check-in and preserve it historically.
- Complete a weekly scorecard and reflection informed by daily records.
- Complete a season review and capture sourced carry-forward insights.
- Begin another season with prior context available while retaining the old season.

### Deliberately limited initially

- Milestones, projects, habits, and recurring actions may use modest fields and manual setup.
- Deferral and rescheduling may support only basic explicit choices; no scheduling engine or automatic rollover is implied.
- Outcome progress may support a small set of types without a universal scoring formula.
- Weekly scorecards may summarize a few transparent measures without advanced analytics or a single overall score.
- Daily check-ins may contain only a short optional note until structured fields are validated.
- Dashboard and Today View may present focused essentials rather than comprehensive customization.
- Carry-forward insights may be manually selected from reflections/reviews.

## Explicitly Postponed

- Authentication and multiple accounts
- Family or team support, shared goals, and accountability relationships
- AI coaching, chatbot-based goal setup, and automated recommendations
- Notifications
- Advanced analytics and historical comparisons
- Goal template marketplace
- Native mobile applications
- External health integrations
- Calendar integration
- Gamification and social features
- Production domain selection and custom domain configuration
- Public API access

## Undecided

### Seasons and goals

- Standard season length versus user-selected dates
- Maximum number of active goals
- Whether projects are distinct from goals
- How normalized outcome progress may contribute to broader scoring beyond the initial unweighted primitives
- Whether health metrics require specialized handling
- How weekly scorecards calculate an overall score

### Execution model

- Whether habits are first-class entities or specialized recurring actions
- Whether daily tasks are first-class stored records, generated views, or a hybrid
- Whether generated daily tasks receive stable identities
- Whether unfinished tasks roll forward automatically
- Whether deferred tasks retain and expose their original-date history
- How daily tasks relate to habits, milestones, outcomes, projects, and goals
- Whether users can create standalone daily tasks
- Whether standalone tasks must belong to a season or goal

### Check-ins and history

- Which fields belong in a daily check-in
- Whether mood, energy, sleep, focus, or blockers are included initially
- Whether check-ins support free text, structured values, or both
- How much editing of past check-ins is allowed
- Whether daily check-ins require version history
- Whether users may edit historical reflections and what history is retained
- How carry-forward insights are selected

### Product surface and deployment

- Whether the initial `/today` landing behavior remains the long-term default
- What the Today View should be named
- The future route for the daily view
- Final production domain and URL structure

These questions are intentionally not resolved by the current TypeScript contracts or documentation.
