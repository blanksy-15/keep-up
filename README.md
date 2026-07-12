# keep-up

Keep-up is a long-term personal operating system for goals, habits, health, projects, and personal growth. It is intended to support intentional growth, consistent execution, reflection, and durable progress without becoming burdensome.

## Status

The project is in **Project Initialization**. This repository currently contains the application framework and architectural documentation only; product features have not been implemented.

## Technology stack

- Next.js 16 with the App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- ESLint 9 with the Next.js configuration
- npm and Git
- Vercel-compatible, mobile-first application structure

## Prerequisites

- Node.js 20.9 or newer
- npm (included with Node.js)
- Git

## Installation

```bash
npm install
```

## Local development

```bash
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000). Other useful checks are:

```bash
npm run lint
npm run typecheck
```

## Production build

```bash
npm run build
npm start
```

## Development philosophy

Favor clarity, maintainability, and sustainable progress. Keep framework conventions unless a documented requirement justifies departing from them. Introduce abstractions and dependencies only when real product needs support them, keep business rules outside presentation components, and leave the application buildable after every milestone.

## Documentation expectations

Documentation is part of the implementation. Update relevant documentation alongside code whenever behavior, setup, conventions, or architecture changes. Commands in this README should remain executable and accurate.

[`PROJECT_PLAN.md`](./PROJECT_PLAN.md) is the living source for the product vision, architecture principles, roadmap, current milestone, and major decisions. Any future change to architecture, scope, roadmap, conventions, or a major decision must update it in the same change.
