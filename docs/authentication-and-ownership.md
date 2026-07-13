# Authentication and Data Ownership

Better Auth 1.6 provides email/password authentication, password hashing, and database-backed sessions through its official Drizzle adapter. Better Auth users authenticate; the product uses their user ID as a neutral `AccountOwnerId`. Domain and application code never imports Better Auth types, session tokens, credentials, or provider records.

Registration is controlled: `ALLOW_PUBLIC_SIGN_UP=false` by default. Development or a deliberately configured environment may enable it. Email verification is not required until email delivery exists. Passwords use Better Auth's 8–128 character bounds with no custom composition rules. Password recovery, social providers, MFA, passkeys, invitations, organizations, and sharing remain postponed.

The auth schema contains users, sessions, accounts, and verifications. Product tables store a non-null owner foreign key and owner/parent indexes. Controlled owner redundancy on child records makes direct lookup safely scopeable. Repositories require owner scope, return not found for another owner's record, reject owner-mismatched saves, and validate parent ownership in PostgreSQL. Composite parent/owner foreign keys were omitted to keep this migration legible; application and repository checks enforce consistency, with future composite constraints still available.

Application dependencies bind repositories to one owner derived from a validated server session. Form-supplied owner IDs are never trusted. Authentication does not authorize product access by itself, routes and UI never call product repositories directly, and future sharing must add explicit relationships and permissions rather than weakening owner scope.

The Better Auth catch-all route owns authentication transport. The protected App Router layout validates the server session for `/today`, `/dashboard`, `/season`, `/reflection`, and `/settings`; cookie presence alone is insufficient. `/` redirects based on the validated session. Minimal sign-in/sign-up forms use safe errors, and sign-out returns to sign-in.

Migration `0001` creates auth tables, clears only pre-launch disposable product records, and then makes ownership non-null. This is acceptable solely because no production data or launch exists. A production system with records would require a staged nullable-column migration and an explicit audited claim/backfill operation—never an arbitrary default user.

Tests use synthetic users and credentials only. PGlite covers auth and owner boundaries; PostgreSQL CI covers owner-scoped SQL, conversion, locking, and migration behavior. No public production deployment or production secrets are configured.

Browser tests register unique synthetic `example.test` accounts through the real sign-up page, use independent browser contexts for separate owners, and do not inject session cookies or owner IDs. Cross-owner setup, review, completion, and season routes return not-found behavior without disclosing private text. Authentication state is not persisted or uploaded by the initial Playwright suite.
# Authenticated product workflow

Guided setup routes and actions derive ownership from the validated Better Auth session. Client forms never submit an owner ID, and private reads use dynamic request-scoped rendering.
