# Domain Glossary

This glossary establishes shared product language without deciding storage, UI, or implementation details. Statuses are **Initial**, **Later**, or **Undecided**.

## Planning and execution

| Term | Definition and purpose | What it is not | Relationships | Status |
| --- | --- | --- | --- | --- |
| **Season** | A named, bounded planning period in which the owner chooses priorities, executes work, and reviews results. Its lifecycle is draft, active, completed, then optionally archived; archived is initially terminal. | A project, calendar year, or permanent container. | Owns season intent and goals; frames scorecards, reflections, and reviews. Length rules are undecided. | Initial |
| **Season Intent** | A concise statement of what the season should emphasize and why. It guides scope and tradeoffs. | A measurable result or task list. | Belongs to a season and informs goal selection. | Initial |
| **Goal** | A meaningful change or achievement pursued within one season. Its lifecycle is draft, active, paused, completed, or abandoned, with completed and abandoned terminal. | A daily task, activity log, or result inferred complete from progress. | Belongs to a season; may have outcomes, milestones, habits, recurring actions, projects, and tasks. Completion is explicit. | Initial |
| **Outcome** | A measurable result used to report progress toward a goal. Initial types are boolean, numeric target, percentage, and count. | A task, habit, milestone, lifecycle controller, or weighted score. | Belongs to a goal; normalized progress never changes goal status automatically. | Initial |
| **Milestone** | A significant intermediate checkpoint that supports one goal, with not-started, in-progress, completed, or skipped status. | A recurring behavior or proof that the final outcome or goal was achieved. | Supports one goal; skipped milestones are excluded from aggregate milestone progress. | Initial, limited |
| **Habit** | A behavior the user intends to repeat consistently, usually to build or maintain a pattern. | Automatically identical to a recurring action; that shared-model question is unresolved. | May support a goal and may surface work in daily execution. | Initial, limited |
| **Project** | A coordinated body of finite work that may support a goal. | Necessarily a goal; whether projects remain a distinct first-class concept is undecided. | May belong to a goal and produce daily tasks. | Initial, limited/undecided model |
| **Recurring Action** | A repeated commitment that should appear according to some future recurrence definition. | Necessarily a habit; it may be operational without behavior-building intent. | May support a goal and may supply daily work. Scheduling representation is undecided. | Initial, limited |
| **Daily Task** | A discrete unit of work presented for a calendar date. It helps the user act today. | A goal or outcome; completing it does not by itself prove goal success. | May originate from a goal, outcome, milestone, habit, recurring action, project, or manual entry. Stored-versus-generated modeling is undecided. | Initial |
| **Daily Plan** | The selected and ordered set of priorities and work relevant to a date. It focuses daily execution. | The broader season plan or necessarily a persisted entity. | Composes daily tasks and due recurring work for the Today View. | Initial capability; entity status undecided |
| **Completion Record** | Historical evidence that an action occurred on a specific calendar date, optionally at a precise time. It preserves execution history independently of current presentation. | A mutation that deletes the source habit or a current task status alone. | May reference a daily task and/or its domain source; feeds reflection and insights. | Initial |

## Reflection, health, and product surfaces

| Term | Definition and purpose | What it is not | Relationships | Status |
| --- | --- | --- | --- | --- |
| **Daily Check-In** | A lightweight record associated with one calendar date, initially allowing a brief note. It captures context that completion data cannot. | A weekly reflection, long required journal, or full wellness assessment. | Created during execution and consumed by reflection; structured fields remain undecided. | Initial, deliberately limited |
| **Health Metric** | A health-related measurement observed over time, such as resting heart rate or sleep duration. | A diagnosis, clinical record, or necessarily an outcome. | May support health goals/outcomes using shared primitives; specialized handling is undecided. | Later/undecided |
| **Weekly Scorecard** | A season-linked summary for one calendar or season week. It helps the user inspect execution and progress. | A daily check-in or a final season judgment. | Draws from outcomes, completions, and other structured records; calculation rules are undecided. | Initial, limited |
| **Weekly Reflection** | A narrative interpretation of a week: progress, friction, lessons, and possible adjustments. | A daily check-in or an overwrite of daily history. | Belongs to a season/week and may use its scorecard, tasks, completions, and check-ins. | Initial |
| **Season Review** | The end-of-period assessment of results, experience, and lessons. | A new season plan or deletion of unfinished work. | Reviews the completed season and can produce carry-forward insights. | Initial |
| **Carry-Forward Insight** | A selected lesson from a weekly reflection or season review made available to future planning. | An automatically copied goal or silent change to the next season. | Has a historical source and informs a later season. Selection rules are undecided. | Initial |
| **Goal Template** | A reusable starting structure for a goal and possibly related planning prompts. | A live goal or marketplace listing. | Can seed future goal setup without owning execution history. | Later |
| **Dashboard** | A broader product surface for planning, progress, and review across a season. | Necessarily the fast daily execution surface or a domain entity. | Presents data owned by planning, execution, and reflection. | Initial, limited |
| **Today View** | The mobile-first product surface that prioritizes immediate execution for a selected current date. | A source of truth, domain owner, final route name, or necessarily the app landing page. | Composes daily plan/task data, due habits/actions, and check-in access. | Initial capability; name/route undecided |
| **Coach** | A future assistive capability that interprets structured records to offer prompts, summaries, or recommendations. | An owner of user data or an authority allowed to silently edit records. | Consumes explicit interfaces from other domains. | Later |

## Identity and collaboration

| Term | Definition and purpose | What it is not | Relationships | Status |
| --- | --- | --- | --- | --- |
| **Account Owner** | The future identity that owns a private keep-up workspace and its records. | Implemented authentication in the initial product. | Will define ownership boundaries for seasons and related records. | Later |
| **Member** | A future separately authenticated person permitted to use or participate in a workspace under defined permissions. | A role currently represented in the domain contracts. | May relate to an account owner, shared goal, or accountability relationship. | Later |
| **Shared Goal** | A future goal whose participation or visibility extends to more than one account. | A personal goal merely discussed with another person. | Requires identity, permissions, ownership, and privacy rules. | Later |
| **Accountability Relationship** | A future permissioned connection allowing one person to support or observe agreed information about another person's progress. | General account access, coaching, or implicit data sharing. | Relates accounts/members and may govern selected goal visibility or interaction. | Later |

## Boundary notes

- A task records work to do; an outcome describes a result to achieve.
- A daily task can have no strategic parent when manually entered.
- A habit and recurring action remain separate vocabulary until evidence supports one underlying model.
- Product surfaces such as Dashboard and Today View compose data but do not own it.
- No identity concept is encoded in the initial contracts; future ownership is documented as a boundary.
