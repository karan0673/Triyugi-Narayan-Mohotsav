# Triyugi Narayan Mohotsav: System Design and Architecture

**Version:** 1.0 **Stack:** Next.js, Node.js (NestJS), MongoDB Atlas, AWS **Scope:** Single wedding, web app (mobile-first), background worker

## 1. Summary

The system is a **modular monolith**: one Next.js web app, one NestJS API, and one background worker built from the same codebase, backed by MongoDB Atlas and a small set of AWS services. It is sized for one family's wedding (about 200 guests, a few dozen team members), so it favours simplicity, low cost, and reliability on event days over scale.

## 2. Decisions Locked In

| Topic | Decision |
| --- | --- |
| Architecture style | Modular monolith (not microservices) |
| Tenancy | Single wedding, no multi-tenant logic |
| Frontend | Next.js (App Router) with TypeScript |
| Backend | Node.js with NestJS, REST API |
| Database | MongoDB Atlas on AWS Mumbai (`ap-south-1`) with Mongoose |
| Hosting | AWS |
| WhatsApp | `wa.me` links with a send queue and manual "Sent" marking (no WhatsApp API) |
| Email | Resend free tier, throttled by a daily quota counter |
| Reminders | Automatic email, plus a daily "Send today" WhatsApp list for the admin |
| SMS | Not in the first release (Indian SMS needs DLT registration) |
| Scheduling | EventBridge Scheduler to SQS to worker (no Redis) |
| Live streaming | Embedded external service (YouTube Live, unlisted) |
| Guest access | Signed, revocable links, no guest accounts |
| Guest scale | About 200 guests |

## 3. Architecture Diagram

```
Browser (Next.js, mobile-first PWA)
   |
Route 53 + CloudFront (CDN, HTTPS via ACM)
   |-- Next.js app (SSR)              AWS Amplify Hosting or ECS Fargate
   |-- /api --> ALB --> NestJS API    ECS Fargate
                          |--> MongoDB Atlas (AWS Mumbai)
                          |--> S3 (media, bills) via presigned uploads
                          |--> SQS (enqueue work)

EventBridge Scheduler --> SQS --> Worker (ECS Fargate)
                                    |--> Resend (email, daily quota)
                                    |--> MongoDB (messages, reminders)

S3 upload event --> Lambda (sharp) --> thumbnails
Secrets Manager | CloudWatch logs and alarms | Sentry
Live stream: YouTube Live (unlisted) embedded in the app
```

**How to read it:** the browser talks only to CloudFront. Page requests go to the Next.js app and `/api` requests go to the NestJS API. Anything slow or scheduled (reminders, bulk email) is queued and handled by the worker, so the API stays fast. Large files never pass through the API: browsers upload directly to S3.

## 4. Components and How We Use Them

### 4.1 Frontend

| Component | What we use | How we use it |
| --- | --- | --- |
| Web framework | Next.js (App Router) + TypeScript | Mobile-first pages for dashboard, events, tasks, expenses, guests, gallery, live page. Public pages (RSVP, live, gallery) use server rendering for fast loading |
| Styling and UI | Tailwind CSS + shadcn/ui | Consistent, responsive tables, dialogs, and forms |
| Data fetching | TanStack Query | Caches API data and refreshes after changes |
| Forms and validation | react-hook-form + zod | Same zod schemas shared with the backend |
| Charts | Recharts | Budget versus spent and dashboard metrics |
| Languages | next-intl | English and Hindi switcher |
| Mobile experience | PWA | Members can add the app to their phone home screen |
| Invitation card | Satori / `@vercel/og` | Generates a personalised invitation image from a template |

### 4.2 Backend

| Component | What we use | How we use it |
| --- | --- | --- |
| API | Node.js + NestJS (TypeScript), REST | One module per feature: auth, users, events, tasks, expenses, budgets, guests, invitations, messages, reminders, media, vendors |
| Validation | zod / class-validator | Every request is validated before it reaches the database |
| Authentication | JWT access token plus refresh token in httpOnly cookies | Admin and member login; password reset by email |
| Permissions | Role guards + per-member permission flags | Server-side checks protect budget, guests, shagun, and uploads |
| Guest access | Signed, unguessable, revocable tokens | Personal RSVP links; shared links for live stream and gallery |
| Security basics | Helmet, rate limiting, CORS rules | Protects against abuse and brute-force login |
| Activity log | Interceptor writing to `activityLogs` | Records who changed which task, expense, guest, or event |
| Import and export | papaparse, ExcelJS, a PDF library | Bulk guest import; Excel and PDF export of guests and expenses |

### 4.3 Data

| Component | What we use | How we use it |
| --- | --- | --- |
| Database | MongoDB Atlas on AWS Mumbai + Mongoose | Collections listed in the Database Design document |
| Guest and RSVP model | RSVP on `guests`; `invitations` links guest to events | One RSVP answer and headcount per guest for all events |
| Money | Integers in paise | Avoids decimal errors in budgets and expenses |
| Consistency | MongoDB transactions where needed | Delete cascades and bulk guest import |
| Performance | Indexes on event, guest, status, and date fields | Fast filters and dashboard counts |
| Backups | Atlas automated backups | Daily backups with point-in-time restore |

### 4.4 Messaging and Reminders

| Component | What we use | How we use it |
| --- | --- | --- |
| WhatsApp invitations | `wa.me` links | App builds a personalised message and link per guest; admin taps, WhatsApp opens, admin sends |
| Send tracking | Send queue screen | Each guest has a Send button and a Sent checkbox, stored on the guest |
| Email | Resend + React Email templates | Invitations, reminders, and task alerts for members |
| Free-tier limit handling | Daily quota counter (`emailQuota`) in the worker | Sends about 90 emails a day and rolls the rest to the next day |
| Reminder scheduling | EventBridge Scheduler to SQS to worker | Triggers reminders such as "2 days left" and "tomorrow is the function" |
| WhatsApp reminders | Daily "Send today" list | Admin sees who needs a reminder and taps each `wa.me` link |
| Provider abstraction | Messaging interface in the backend | SMS or the official WhatsApp API can be added later without rewrites |

### 4.5 Media and Live Streaming

| Component | What we use | How we use it |
| --- | --- | --- |
| File storage | Amazon S3 (private bucket) | Gallery photos and videos, expense bills |
| Uploads | Presigned S3 URLs | Browsers upload directly to S3, keeping files off the API |
| Thumbnails | S3 event to Lambda (sharp) | Creates thumbnails and compressed images automatically |
| Delivery | CloudFront CDN | Fast gallery loading; lazy loading in the UI |
| Limits | File type and size rules | Prevents oversized videos |
| Live streaming | YouTube Live (unlisted) or Vimeo, embedded | Admin pastes the stream link per event; the app shows it on the live page |

### 4.6 Infrastructure on AWS

| Component | What we use | How we use it |
| --- | --- | --- |
| Next.js hosting | AWS Amplify Hosting (or ECS Fargate) | Serves the web app |
| API and worker | ECS Fargate (two services) behind an ALB | One service for the API, one for the worker, same codebase |
| Containers | Amazon ECR | Stores Docker images |
| DNS and HTTPS | Route 53 + ACM + CloudFront | Custom domain with SSL |
| Secrets | AWS Secrets Manager | Database URL, JWT secrets, Resend key |
| Infrastructure as code | AWS CDK or Terraform | Repeatable dev and prod environments |
| CI/CD | GitHub Actions | Tests, builds, pushes images, deploys on merge |

### 4.7 Quality and Operations

| Component | What we use | How we use it |
| --- | --- | --- |
| Repository | pnpm + Turborepo monorepo | `web`, `api`, `worker`, and shared packages |
| Testing | Vitest/Jest + Playwright | Unit tests for logic; end-to-end tests for login, RSVP, send queue |
| Error tracking | Sentry | Alerts for crashes in web, API, and worker |
| Monitoring | CloudWatch logs and alarms, uptime checks | Alerts if the API or worker fails, especially around event dates |
| Environments | Dev and prod | Production deploys only after tests pass |

## 5. Key Flows

### 5.1 Guest RSVP

1. Admin adds guests and assigns them to events.
2. Admin sends the personal link (`wa.me` or email).
3. The guest opens the link (a signed token, no login), sees their events, and answers once for all events with a headcount.
4. The API stores the answer on the guest, and the dashboard updates.

### 5.2 WhatsApp invitation (manual send queue)

1. Admin selects guests (all, by group, by event, or by RSVP status).
2. The API renders each personalised message from a template and writes `messages` rows with status `ready`.
3. The send queue screen lists them. The admin taps Send, WhatsApp opens with the message filled in, and the admin sends it.
4. The admin ticks Sent, and the app records who sent it and when.

### 5.3 Email reminder (automatic, quota-aware)

1. EventBridge Scheduler triggers a daily job.
2. The job reads active reminders, resolves the audience (for example only Confirmed or Pending guests), and merges events that fall on the same day into one message per guest.
3. It writes `messages` rows with a unique `dedupeKey` so nothing sends twice.
4. The worker claims capacity from `emailQuota` (about 90 per day) and sends by priority: event day first, then next day, then older reminders.
5. Messages that do not fit stay queued and roll to the next day. The dashboard shows the sent count, the remaining quota, and a warning if the queue cannot finish before the event.
6. Guests without an email address are skipped and appear in the WhatsApp "Send today" list instead.

**Capacity check for 200 guests:** one combined invitation email plus two reminders per major event is well inside 3,000 emails a month, and spreading each round over 3 days keeps it near 70 a day, under the 100-a-day cap. These are Resend's free-tier limits as published in 2026 reviews; confirm them on Resend's pricing page before launch. If the schedule ever gets tight, one month of the Pro plan removes the daily cap.

### 5.4 Gallery upload

1. A member with upload permission selects files; the API checks type, size, and permission and returns presigned S3 URLs.
2. The browser uploads directly to S3 and shows progress.
3. An S3 event triggers a Lambda that creates thumbnails and marks the `media` record `ready`.
4. Viewers load thumbnails through CloudFront. Gallery links can carry a passcode and be revoked.

### 5.5 Live stream

1. The admin starts the stream on YouTube Live (unlisted) and pastes the link on the event.
2. The app shows it on the event's live page, reachable through a shared link (optionally passcode-protected).
3. The admin sends the live link through the same invitation and reminder channels.

## 6. Security and Privacy

- **Transport:** HTTPS everywhere through CloudFront and ACM.
- **Passwords:** hashed with argon2 or bcrypt; reset by email.
- **Sessions:** httpOnly, secure cookies; refresh tokens are hashed in the database and can be revoked ("log out from all devices").
- **Authorisation:** enforced in the API on every endpoint; the frontend only hides what the user cannot use. Budget, guest contacts, and shagun data need explicit permission flags.
- **Guest links:** random 128-bit tokens, revocable, with optional passcode for the gallery and live stream.
- **Files:** private S3 bucket; access only through presigned URLs or CloudFront.
- **Secrets:** AWS Secrets Manager, never in the repository.
- **Network:** Atlas access limited to the AWS environment (IP allowlist or private connection); least-privilege IAM roles for each service.
- **Abuse protection:** rate limiting on login, RSVP, and upload endpoints; Helmet and strict CORS.
- **Personal data:** guest phone numbers and emails are visible only to users with guest permissions; an admin export is available before any data is archived or deleted.

## 7. Environments and Deployment

| Environment | Purpose | Setup |
| --- | --- | --- |
| Local | Development | Docker Compose or a local MongoDB, a dev Atlas cluster, local S3 stand-in |
| Dev | Shared testing | Small AWS stack, separate Atlas cluster, test Resend domain |
| Prod | The wedding | Full AWS stack, production Atlas cluster with backups, real domain |

**Pipeline (GitHub Actions):**

1. Pull request: lint, type check, unit tests, build.
2. Merge to main: run end-to-end tests, build Docker images, push to ECR.
3. Deploy to dev automatically; deploy to prod by manual approval.
4. After deploy: smoke test of login, dashboard, and RSVP.

Infrastructure is described in AWS CDK or Terraform so dev and prod match and can be rebuilt quickly.

## 8. Repository Structure

```
triyugi-narayan/
  apps/
    web/        Next.js frontend
    api/        NestJS API
    worker/     Background worker (messages, reminders)
  packages/
    shared/     zod schemas, TypeScript types, enums
    config/     ESLint, tsconfig, shared settings
  infra/        CDK or Terraform
  .github/
    workflows/  CI/CD pipelines
```

Shared zod schemas in `packages/shared` keep frontend and backend validation identical.

## 9. Monitoring and Event-Day Readiness

- **Logs and errors:** CloudWatch logs and Sentry for web, API, and worker.
- **Alarms:** API 5xx rate, worker failures, queue age (messages waiting too long), and Atlas connection errors.
- **Uptime checks** on the public RSVP page and the API health endpoint.
- **Event-day plan:** freeze deployments 48 hours before the first event, confirm backups, run a rehearsal with the stream link and the gallery, and keep the admin export handy as an offline fallback.

## 10. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Resend free-tier daily cap blocks a reminder round | Quota-aware queue, 3-day send windows, combined emails, WhatsApp queue as backup, optional one-month Pro plan |
| WhatsApp is manual, so delivery is not tracked | Manual Sent marking and a clear send queue; provider abstraction allows the official API later |
| Large video uploads slow the app and raise storage cost | Direct S3 uploads, size limits, thumbnails, CDN delivery |
| Privacy of guest contacts and photos | Permission flags, revocable and passcode-protected links, private bucket |
| Live stream demand | Use an external streaming service so the app is not the bottleneck |
| Low adoption by less technical family members | Mobile-first UI, Hindi support, simple navigation, short onboarding |
| AWS setup complexity for a small project | Infrastructure as code, managed services (Fargate, Atlas), keep the footprint small |

## 11. Build Order

| Phase | Scope |
| --- | --- |
| Foundation | Repository, CI/CD, AWS environments, database connection, login and roles |
| Phase 1 (MVP) | Events, task planner, expense tracker, guest management with invitations, RSVP, dashboard |
| Phase 2 | `wa.me` send queue, email invitations, invitation cards, quota-aware reminders |
| Phase 3 | Gallery and live streaming |
| Phase 4 | Vendors and payments, timeline, food headcount, shagun register, reports and export, Hindi support |

## 12. Inputs Needed Before Setup

1. A **domain name** (needed for Resend email verification and the public site).
2. An **AWS account** and the region confirmed as Mumbai.
3. The **date of the first event**, to set the build and freeze schedule.
4. A **YouTube channel** (or Vimeo account) for live streaming.
5. The **sender email address** to use for invitations and reminders.

## 13. Related Documents

- Product Requirements Document (PRD)
- Database Design (MongoDB)
- Next: API Design (endpoints, request and response shapes, permission per endpoint)
