# Browser End-to-End Testing

Keep-up uses Playwright Test with Chromium for authenticated browser verification of the guided season setup workflow. The suite exercises the real Next.js server, Better Auth pages and sessions, session-derived ownership, PostgreSQL repositories, and transactional conversion. It complements rather than replaces the lower-level domain, application, PGlite, and real-PostgreSQL tests.

## Scope and structure

Focused scenarios live under `tests/e2e/`: authentication, guided setup, readiness, ownership isolation, and responsive behavior. `playwright.config.ts` uses one serial worker, a mobile Chromium project for stateful workflow coverage, and a desktop Chromium project for `responsive.spec.ts`. The mobile viewport is approximately 390 × 844 through the iPhone 13 device profile; desktop is 1440 × 900.

Playwright uses its HTML reporter plus the concise list reporter, a dedicated port 3101 web server, retries only in CI, traces retained on failure, screenshots on failure, and no routine video capture. CI uploads HTML reports, traces, and screenshots only after failure or cancellation for ten days. Traces can contain synthetic session information and must be treated as sensitive diagnostics.

## PostgreSQL and safety

Browser tests require PostgreSQL. They never fall back to PGlite and must never use the normal development database because global setup applies committed migrations and truncates known application and Better Auth tables. The URL guard requires a non-empty database name containing `test` and a local/CI-safe host; remote test databases require `ALLOW_REMOTE_TEST_DATABASE=true`. These checks reduce accidents but are not a complete security boundary.

Global setup applies migrations from `drizzle/`, preserves migration history, and truncates known tables in foreign-key-safe order. It never generates migrations or runs schema push. Each scenario uses unique synthetic accounts with `example.test` addresses and unique run suffixes. Stateful tests do not share mutable authentication state. No production test API, owner bypass, or fake session cookie is used.

For local execution, create a separate PostgreSQL database whose name contains `test` (or a separate Neon branch/database) and set only test values:

```powershell
$env:DATABASE_URL="postgresql://.../keep_up_e2e_test"
$env:BETTER_AUTH_SECRET="test-only-secret-at-least-32-characters"
$env:BETTER_AUTH_URL="http://127.0.0.1:3101"
$env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:3101"
$env:ALLOW_PUBLIC_SIGN_UP="true"
$env:E2E_TEST_MODE="true"
npx playwright install chromium
npm.cmd run db:migrate
npm.cmd run test:e2e
```

The normal development database is not a valid E2E target. If a safe PostgreSQL test database is unavailable locally, configuration/list discovery can be checked with `npx playwright test --list` using safe placeholder values, but browser execution is blocked and should be run in CI instead. Authentication state is not stored by these tests; if temporary state is added later, `playwright/.auth/` is ignored and must not be uploaded.

## Scenarios and assertions

The suite verifies unauthenticated redirects, sign-up/sign-in/sign-out, invalid-credential feedback, foundation persistence after reload, free-form priorities and goals, all four outcome types, readiness blockers and warnings, confirmation, locked editing, transactional draft conversion, conversion idempotency, and cross-owner not-found behavior. Database assertions verify one resulting graph and exact child counts while browser actions remain responsible for all mutations.

Responsive checks verify bottom navigation on mobile, the desktop sidebar at 1440px, form and date-input fit, action reachability, review/error wrapping, resulting draft content, and the document overflow invariant:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Native Playwright assertions cover one main landmark, one page heading, labels, named controls, navigation labels and `aria-current`, keyboard-capable forms, focusable primary actions, native disabled semantics, and `role="alert"`/`role="status"` feedback. This is an accessibility foundation, not a replacement for manual review or a full automated audit; no separate axe package is currently needed.

Unexpected page errors, console errors, hydration warnings, and unhandled React/browser failures fail the relevant test. There is no broad warning suppression.

## CI and limitations

The separate `e2e` GitHub Actions job uses Node 20, disposable PostgreSQL 16, synthetic environment values, committed migrations, Chromium with system dependencies, and one Playwright run. It has `contents: read` permission and performs no deployment. Chromium-only coverage does not prove Firefox, WebKit, or every hosting configuration. Lower-level tests remain necessary for deterministic domain rules, mapper validation, rollback/failure injection, and database concurrency details that are expensive or indirect to prove through a browser.

Confirmation and conversion failures are translated into safe inline alert/status content. Database and Drizzle details never appear in the UI or query parameters; a duplicate conversion links to the existing season and remains retry-safe where appropriate.
