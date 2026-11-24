# AGENTS.md

Guidance for AI coding assistants (and new developers) working in this repository.

## Project
**Triyugi Narayan Mohotsav**: a web app for one family to plan and run a multi-event wedding.
Modules: events, dashboard, task planner, expenses and budgets, guests and RSVP, invitations
(WhatsApp links and email), reminders, live stream, gallery. Later: vendors, timeline, shagun register,
food headcount, reports, Hindi and English.

Full documents are in `docs/` (PRD, system architecture, database design, API design). Read the relevant
one before building a feature. If code and docs disagree, ask before changing either.

## Stack
- Monorepo with **npm workspaces** and **Turborepo** (do not use pnpm or yarn)
- `apps/web`: Next.js (App Router), TypeScript, Tailwind CSS v4
- `apps/api`: NestJS REST API under `/api/v1`
- `apps/worker`: background worker (email queue, reminders)
- `packages/shared`: zod schemas, enums, permission flags, money/phone/date helpers
- `packages/db`: Mongoose schemas for every collection
- `packages/messaging`: email provider (Resend), `wa.me` link builder, template renderer
- Database: MongoDB (local Docker replica set; MongoDB Atlas in production)
- **TypeScript is pinned to version 5.** Do not upgrade it without asking.

## Commands (run from the repo root)
- `npm install` then `npm run deps`: install dependencies
- `npm run db:up`: start local MongoDB (Docker Desktop must be running)
- `npm run dev`: run web (3000), API (4000), worker
- `npm run build`, `npm run typecheck`, `npm test`
- Internal packages must build before apps use them (Turborepo handles the order)

## Rules that must not be broken
1. **Single wedding.** No multi-tenant logic and no `weddingId` on records.
2. **Money is integer paise** (`amountPaise`). Never floats. Use `formatINR` from `@triyugi/shared`.
3. **Phone numbers are E.164** (`normalizePhone`). Duplicate phone numbers are allowed but the API must
   return a `DUPLICATE_PHONE` warning (409) unless the request has `confirmDuplicate: true`.
4. **Dates are UTC in the database**, shown in IST. Day-based logic (reminders, daily email quota)
   uses `istDateKey()`.
5. **One RSVP per guest for all events.** RSVP, headcount, and send status live on `guests`
   (`rsvp`, `whatsapp`, `emailDelivery`). `invitations` only links a guest to an event.
6. **Expense categories are free text.** Always store `category` plus `categoryKey` from `toCategoryKey()`.
7. **WhatsApp is manual** through `wa.me` links and a send queue. Do not add the WhatsApp Business API.
8. **Email uses Resend free tier:** at most about 90 emails per day via `claimEmailSlot()`. Combine events
   into one email per guest. Never bypass the quota.
9. **Permissions are enforced on the server** with the guards in `apps/api/src/common`. The frontend only
   hides things. The 11 permission flags are in `packages/shared/src/permissions.ts`.
10. **Guests have no accounts.** They use signed, revocable link tokens on `/public/...` endpoints, which
    never expose other guests, budgets, or phone numbers.
11. **Soft delete** (`deletedAt`) for events, tasks, guests, expenses, invitations. Filter it out in queries.
12. **No SMS, room allotment, guest portal, music requests, or thank-you campaigns.** They are out of scope.

## API conventions
- Success: the object itself; lists: `{ data, meta: { page, limit, total } }`
- Errors always: `{ error: { code, message, details?, requestId } }` (see `AllExceptionsFilter`)
- Validate every request body with the shared zod schemas through `ZodValidationPipe`
- Mark public routes with `@Public()`; protect others with `@RequirePermissions(...)` or `@Roles(...)`
- Login errors must be generic ("incorrect email or password"). Rate-limit login.
- Write an `activityLogs` entry for every create, update, and delete

## Frontend conventions
- Mobile-first. Minimum 16px text and 44px touch targets.
- Design tokens are in `apps/web/src/app/globals.css`. Style: stone and slate, matte, premium.
  **Never use pink, green, yellow, orange, purple, or bright blue.** Errors use the muted brick tone.
- Fonts: Cormorant Garamond (headlines), Inter (body). Thin line icons (Lucide).
- Next.js 16: route `params` are a Promise (`await params`). The browser calls `/api/v1/...` on the same
  origin (rewritten to the API).
- Screens are designed in Google Stitch first; match the design rather than inventing new layouts.
- Use shared zod schemas with react-hook-form; format dates with `formatDateIST`.

## Code style
- TypeScript strict. No `any` unless unavoidable and commented.
- Small focused modules: controller (routing and guards), service (rules), repository (Mongoose).
- Prettier defaults from `.prettierrc`. Use clear names; comment only the "why".
- Do not add dependencies without saying why. Do not commit `.env`.

## Working agreement
- Build one feature at a time, in this order: auth and users, events, tasks, budgets and expenses,
  guests and RSVP, dashboard, messaging and reminders, gallery and live, Phase 4 modules.
- Before coding a feature, state a short plan and wait for approval. After coding, run
  `npm run typecheck` and `npm run build` and fix errors.
- Never invent data, testimonials, or statistics. Ask when requirements are unclear.
