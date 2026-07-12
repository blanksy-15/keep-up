# Application Shell and Design Foundation

This document records the static application shell introduced for the Application Shell and Design Foundation milestone. It describes presentation structure only; it does not define domain behavior.

## Route structure

```text
/
├── today
├── dashboard
├── season
├── reflection
└── settings
```

The root route redirects to `/today`. **Today** is the initial working name for the primary daily execution surface, not a permanent product-language decision. Its name and route may change as the daily workflow is validated.

## Navigation and responsive layout

- Below the desktop breakpoint, all five destinations appear in a fixed bottom navigation with text labels, local inline SVG icons, touch-sized links, and safe-area padding.
- At 1024 px and wider, a persistent left sidebar replaces the bottom navigation. It provides the keep-up wordmark, primary routes, active-route state, and reserved visual space for a future personal-workspace control.
- Main content uses a shared maximum width, responsive page spacing, and extra bottom space on mobile so fixed navigation never obscures content.
- Pages use CSS/Tailwind media queries rather than JavaScript viewport detection. Dense grids collapse to a single column on small screens and expand at 768 px where appropriate.

## Design-token strategy

`src/app/globals.css` defines a modest semantic token set for background and surface colors, borders, text hierarchy, accent states, success/warning/danger, focus rings, page spacing, content and navigation dimensions, radii, and two shadow levels. Components consume semantic tokens rather than fixed component themes, allowing later visual adjustment without an elaborate design system.

The visual direction uses a restrained warm-neutral foundation and one green accent. A system font stack avoids external downloads. Dark mode is postponed until product needs and a complete accessible palette justify it.

## Shared component responsibilities

- `AppShell` supplies landmarks, skip navigation, responsive content spacing, and both navigation modes.
- `DesktopSidebar` and `MobileNavigation` render the same route set and active-route state.
- `PageHeader` establishes page title, description, optional eyebrow, and optional action placement.
- `Card`, `Button`, `EmptyState`, and `SectionHeading` provide only the repeated visual and semantic structures used by the current pages.
- Static page content remains inside route files rather than domain contracts or shared components.

## Server and client component decisions

The root layout, product route-group layout, AppShell, shared UI primitives, and all pages remain Server Components. `DesktopSidebar` and `MobileNavigation` are the only Client Components because `usePathname` is required to expose accurate active-route styling and `aria-current`. The client boundary is isolated to those navigation renderers; no global client state is introduced.

## Accessibility foundation

- A keyboard-visible skip link targets the main content landmark.
- Pages use semantic headings, sections, articles, asides, navigation landmarks, and buttons/links according to purpose.
- Active navigation exposes `aria-current="page"` and does not rely on color alone.
- Inline navigation icons are decorative because visible labels remain present.
- Focus states use a high-visibility semantic token.
- Disabled preview buttons use native disabled behavior and explanatory labels.
- Touch targets, text contrast, safe-area spacing, and reduced-motion preferences are supported.

## Placeholder-data policy

All tasks, dates, scores, goal progress, check-in values, reflections, and insights shown in the shell are illustrative static data. They are intentionally local to presentation files and do not represent stored records, computed analytics, or accepted domain rules. Non-functional controls are disabled or explicitly labeled as previews.

No persistence, task generation, scheduling, completion behavior, check-in submission, authentication, API, analytics, notifications, or domain service exists.

## Deliberately postponed

- Real data and interaction behavior
- Persistence and API boundaries
- Authentication and future account controls
- Task generation, rollover, scheduling, and deferral rules
- Check-in submission and field decisions
- Charts and analytics calculations
- Notifications
- Dark mode
- Production domain selection and custom domain configuration

## Known temporary choices

- `/today` is the initial default application route.
- Today remains a working name and both its route and landing-page status may change.
- Five mobile navigation destinations fit the current shell; an overflow strategy may be reconsidered if navigation expands.
- The 1024 px sidebar breakpoint and current visual values are initial shell decisions, not a permanent design system.
- Settings and the future workspace/account area are structural placeholders only.
# Planning destination

The existing Season navigation destination now leads to an authenticated owner-scoped season index with links into guided setup. Setup routes stay out of primary bottom navigation and provide their own step context.
