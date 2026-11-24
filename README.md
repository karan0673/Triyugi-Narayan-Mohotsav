# Triyugi Narayan Mohotsav

Wedding management web app: events, tasks, expenses, guests and RSVP, invitations (WhatsApp links and email),
reminders, live stream, and gallery. Single wedding, invite-only team access.

## Structure

```
apps/web        Next.js frontend (route groups: marketing, auth, app, public)
apps/api        NestJS REST API (/api/v1)
apps/worker     Background worker (email queue with daily quota)
packages/shared zod schemas, enums, permissions, money/phone/date helpers
packages/db     Mongoose schemas for all collections
packages/messaging  Email provider (Resend), wa.me link builder, template renderer
docs/           PRD, architecture, database and API design (Markdown)
infra/          AWS infrastructure code (later)
```

## First-time setup

Prerequisites: Node.js LTS (includes npm), Git, and Docker Desktop.

1. `cp .env.example .env` (on Windows: `copy .env.example .env`) and set the two JWT secrets.
2. `npm install` to link the workspace.
3. `npm run deps` to install every dependency at its latest stable version.
4. `npm run build` to build the shared packages, then the API, worker, and web app.
5. `npm run db:up` to start MongoDB (single-node replica set, needed for transactions).
6. `npm run dev` to run web, API, and worker together.

Check it works:
- Web: http://localhost:3000
- API health: http://localhost:4000/api/v1/health
- API readiness (database): http://localhost:4000/api/v1/ready

Commit `package-lock.json` so everyone (and CI) installs the same versions.

Later-phase packages (AWS SDK, Excel/PDF export, Sentry, Swagger, tests, ESLint, Playwright, next-intl):
`npm run deps:extras`

## What is in the scaffold

- Typed monorepo with shared zod schemas and enums used by frontend and backend
- Mongoose schemas for all collections in the database design
- API foundation: env validation, standard error format, request IDs, rate limiting, global login and
  permission guards (11 permission flags), `/health` and `/ready`
- Empty NestJS modules for every feature, ready to fill in
- Worker with the atomic daily email quota claim (Resend free tier)
- Next.js shell with stone and slate design tokens, fonts, and placeholder pages for every route
- Docker Compose for MongoDB, CI workflow, VS Code recommendations

## Not included yet

Auth endpoints, feature logic, finished UI (design in Stitch), next-intl wiring, shadcn/ui components
(run `npx shadcn@latest init` inside `apps/web` when you start building UI), ESLint, tests, AWS infra.

## Suggested build order

1. Auth (login, refresh, logout, invite, password reset) and users
2. Events, then tasks, then budgets and expenses
3. Guests, invitations, RSVP (including the public RSVP page and duplicate phone warning)
4. Dashboard
5. Messaging (wa.me send queue, email, reminders), then gallery and live, then Phase 4 modules
