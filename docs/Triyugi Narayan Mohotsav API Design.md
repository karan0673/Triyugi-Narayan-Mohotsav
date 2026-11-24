# Triyugi Narayan Mohotsav: API Design

**Version:** 1.0 (Draft for review) **Style:** REST over HTTPS, JSON, NestJS **Base path:** `/api/v1` **Depends on:** PRD, System Design and Architecture, Database Design (MongoDB)

## 1. Summary

The API is a single versioned REST service with one module per feature. Logged-in users (admin, members, vendors) use cookie-based sessions. Guests use no accounts: they use signed, revocable link tokens on a small set of public endpoints. Slow work (bulk messages, reminders) returns immediately and is finished by the background worker.

## 2. Conventions

| Topic | Rule |
| --- | --- |
| Format | JSON request and response bodies, UTF-8, `Content-Type: application/json` |
| IDs | MongoDB ObjectId as a 24-character string |
| Dates | ISO 8601 in UTC (for example `2026-12-05T04:30:00.000Z`); the app shows IST |
| Money | Integers in paise (`amountPaise`), never decimals |
| Phone | Stored in E.164. A 10-digit Indian number is normalised to `+91...` |
| Success shape | Single item: the object itself. Lists: `{ "data": [...], "meta": { "page", "limit", "total" } }` |
| Pagination | `page` (default 1) and `limit` (default 20, maximum 100) on every list; `sort` such as `-createdAt` |
| Filtering | Query parameters named after fields (`status`, `eventId`, `group`), plus `q` for text search |
| Soft delete | `DELETE` sets `deletedAt`; deleted records are hidden from every normal list |
| Updates | `PATCH` with only the changed fields; unknown fields are rejected |
| Validation | zod schemas shared with the frontend; failures return `VALIDATION_ERROR` |
| Idempotency | `Idempotency-Key` header on bulk sends and import commits; the same key returns the first result |
| Versioning | Breaking changes go to `/api/v2`; `/api/v1` stays stable |
| Documentation | OpenAPI (Swagger) generated from the schemas; served at `/api/docs` in dev only |

## 3. Authentication and Sessions

- **Login** sets two httpOnly, secure, `SameSite=Lax` cookies: a short-lived access token (about 15 minutes) and a refresh token (about 30 days, stored hashed in `sessions`).
- **Refresh** rotates the refresh token on every use; reuse of an old token revokes the session.
- **CSRF:** state-changing requests from the browser must send an `X-CSRF-Token` header (double-submit cookie).
- **Invites:** the admin creates a member, who receives an email link with a one-time token to set a password.
- **Guest links:** public endpoints take a token in the path. Tokens are random 128-bit values, can be revoked, and are never accepted on private endpoints.
- **Rate limits:** see section 8.

## 4. Access Model

| Code | Meaning |
| --- | --- |
| **A** | Admin only |
| **M** | Any active logged-in member (or admin) |
| **P:flag** | Member with that permission flag; admin always passes |
| **V** | Vendor, limited to records linked to their vendor account |
| **Own** | Only the user's own record or assignments |
| **Token** | A valid, unrevoked guest or share-link token |

**Permission flags:** `viewBudget`, `editBudget`, `viewGuests`, `editGuests`, `sendInvites`, `manageTasks`, `manageEvents`, `uploadMedia`, `manageMedia`, `viewShagun`, `manageVendors`.

Access is enforced by NestJS guards on every endpoint. The frontend only hides what a user cannot use.

## 5. Endpoints by Module

### 5.1 Auth (Phase 1)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| POST | `/auth/login` | Email or phone and password; sets cookies | Public |
| POST | `/auth/refresh` | Rotate refresh token, issue new access token | Cookie |
| POST | `/auth/logout` | End the current session | M |
| POST | `/auth/logout-all` | Revoke every session of the user | M |
| GET | `/auth/me` | Current user, role, and permissions | M |
| PATCH | `/auth/me` | Update own name, phone, language | M |
| POST | `/auth/change-password` | Change own password | M |
| POST | `/auth/forgot-password` | Send reset email (same response whether or not the email exists) | Public |
| POST | `/auth/reset-password` | Set a new password with the emailed token | Token |
| POST | `/auth/accept-invite` | Set a password from an invite token | Token |

### 5.2 Users and Wedding Settings (Phase 1)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/users` | List users (filter by role, status) | A |
| POST | `/users` | Create and invite a member or vendor | A |
| GET | `/users/:id` | User detail | A |
| PATCH | `/users/:id` | Change role, permissions, or status | A |
| POST | `/users/:id/resend-invite` | Send the invite email again | A |
| DELETE | `/users/:id` | Disable the user and revoke sessions | A |
| GET | `/wedding` | Wedding name, dates, currency, language | M |
| PATCH | `/wedding` | Update wedding settings (including email daily limit, sender) | A |

The last admin cannot be disabled or demoted.

### 5.3 Events (Phase 1)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/events` | List events (filter by status, date range) | M |
| POST | `/events` | Create an event | P:manageEvents |
| GET | `/events/:id` | Event detail | M |
| PATCH | `/events/:id` | Update event | P:manageEvents |
| DELETE | `/events/:id` | Soft delete; cascades to invitations, reminders, queued messages | P:manageEvents |
| POST | `/events/reorder` | Set display order from a list of ids | P:manageEvents |
| PATCH | `/events/:id/stream` | Set stream provider, URL, and status | A |
| GET | `/events/:id/guests` | Guests invited to this event with RSVP status | P:viewGuests |
| PUT | `/events/:id/guests` | Replace the guest list of the event with a list of guest ids | P:editGuests |
| POST | `/events/:id/guests` | Add guests to the event (by ids or by group) | P:editGuests |
| DELETE | `/events/:id/guests/:guestId` | Remove one guest from the event | P:editGuests |

### 5.4 Tasks (Phase 1)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/tasks` | List tasks (filter by event, assignee, status, priority, due range, overdue, `q`) | M (vendors: V) |
| POST | `/tasks` | Create a task | P:manageTasks |
| GET | `/tasks/:id` | Task detail with checklist | M |
| PATCH | `/tasks/:id` | Edit title, assignees, due date, priority, checklist | P:manageTasks |
| PATCH | `/tasks/:id/status` | Change status (assignees can update their own tasks) | Own or P:manageTasks |
| DELETE | `/tasks/:id` | Soft delete | P:manageTasks |
| GET | `/tasks/:id/comments` | List comments | M |
| POST | `/tasks/:id/comments` | Add a comment | M |
| DELETE | `/tasks/:id/comments/:commentId` | Delete own comment (admin can delete any) | Own or A |
| POST | `/tasks/:id/attachments/presign` | Get an upload URL for an attachment | Own or P:manageTasks |
| POST | `/tasks/:id/attachments` | Register an uploaded attachment | Own or P:manageTasks |
| GET | `/tasks/mine` | My open tasks sorted by due date | M |
| GET | `/checklist-templates` | List ready-made ceremony checklists (Phase 4) | M |
| POST | `/events/:id/apply-checklist` | Create tasks from a template (Phase 4) | P:manageTasks |

### 5.5 Budgets and Expenses (Phase 1)

Categories are free text. The API trims them and stores a lowercase `categoryKey` so "Catering" and "catering" group together.

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/budgets` | List budget lines (filter by event) | P:viewBudget |
| PUT | `/budgets` | Create or update a line by `eventId` and category | P:editBudget |
| DELETE | `/budgets/:id` | Remove a budget line | P:editBudget |
| GET | `/budgets/summary` | Spent versus budget per event and category, totals, threshold warnings | P:viewBudget |
| GET | `/expenses` | List expenses (filter by event, category, vendor, date range, payment mode, `q`) | P:viewBudget |
| POST | `/expenses` | Add an expense | P:editBudget |
| GET | `/expenses/:id` | Expense detail with bill links | P:viewBudget |
| PATCH | `/expenses/:id` | Edit an expense | P:editBudget |
| DELETE | `/expenses/:id` | Soft delete | P:editBudget |
| GET | `/expenses/categories` | Category names already used, for autocomplete | P:viewBudget |
| POST | `/expenses/:id/bills/presign` | Get an upload URL for a bill | P:editBudget |
| POST | `/expenses/:id/bills` | Register an uploaded bill | P:editBudget |
| GET | `/expenses/export` | Excel or PDF export (\`format=xlsx | pdf\`) |

### 5.6 Guests and RSVP (Phase 1)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/guests` | List guests (filter by `q`, group, event, RSVP status, has email, WhatsApp sent) | P:viewGuests |
| POST | `/guests` | Create a guest; returns the duplicate-phone warning when needed | P:editGuests |
| GET | `/guests/:id` | Guest detail with their events | P:viewGuests |
| PATCH | `/guests/:id` | Edit a guest; same duplicate-phone check | P:editGuests |
| DELETE | `/guests/:id` | Soft delete; cancels the guest's queued messages | P:editGuests |
| PUT | `/guests/:id/events` | Set which events this guest is invited to | P:editGuests |
| PATCH | `/guests/:id/rsvp` | Admin records an RSVP by hand (status, `confirmedCount`) | P:editGuests |
| POST | `/guests/:id/link/rotate` | Create a new personal link and invalidate the old one | P:editGuests |
| POST | `/guests/:id/link/revoke` | Disable the personal link | P:editGuests |
| POST | `/guests/import?dryRun=true` | Validate a CSV or Excel file and return a row-by-row report, with no writes | P:editGuests |
| POST | `/guests/import` | Commit the import (same file, `Idempotency-Key`) | P:editGuests |
| GET | `/guests/export` | Excel or PDF export | P:viewGuests |
| GET | `/guests/stats` | Counts by RSVP status, group, and headcount (total or per event) | P:viewGuests |

**Public RSVP (no login):**

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/public/rsvp/:token` | Guest name, invited events (name, date, venue, map link), current answer, live and gallery links when available | Token |
| POST | `/public/rsvp/:token` | Submit one answer for all events: `status` and `confirmedCount` | Token |

The public response never includes other guests, budgets, or phone numbers.

### 5.7 Templates, Invitations, and Messages (Phase 2)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/templates` | List message templates (filter by kind, channel, language) | P:sendInvites |
| POST | `/templates` | Create a template with placeholders | P:sendInvites |
| PATCH | `/templates/:id` | Edit a template | P:sendInvites |
| DELETE | `/templates/:id` | Delete a template | P:sendInvites |
| POST | `/templates/:id/preview` | Render the template for a sample or chosen guest | P:sendInvites |
| POST | `/messages/invitations` | Queue invitations for an audience (all, groups, event, RSVP status, or guest ids) on `whatsapp`, `email`, or both | P:sendInvites |
| GET | `/messages` | List messages (filter by channel, status, kind, guest, date) | P:sendInvites |
| GET | `/messages/whatsapp/queue` | The "Send today" list, each item with a ready-made `waLink` | P:sendInvites |
| PATCH | `/messages/:id/mark-sent` | Admin ticks Sent after sending on WhatsApp | P:sendInvites |
| POST | `/messages/:id/retry` | Retry a failed email | P:sendInvites |
| POST | `/messages/:id/cancel` | Cancel a queued or ready message | P:sendInvites |
| GET | `/messages/email/quota` | Today's sent count, limit, queued count, and projected finish date | P:sendInvites |
| GET | `/invitations/card/:eventId` | Personalised invitation card image (or `?guestId=`) | P:sendInvites |

The server builds the WhatsApp link as `https://wa.me/<digits>?text=<url-encoded message>`, with the guest's personal RSVP link inside the message.

### 5.8 Reminders (Phase 2)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/reminders` | List reminders (filter by event, status) | P:sendInvites |
| POST | `/reminders` | Create a reminder: event, days before, send time, channels, audience, templates | P:sendInvites |
| PATCH | `/reminders/:id` | Edit, pause, or resume | P:sendInvites |
| DELETE | `/reminders/:id` | Delete a reminder and cancel its queued messages | P:sendInvites |
| GET | `/reminders/:id/audience` | Preview how many guests would receive it, split by channel | P:sendInvites |
| POST | `/reminders/:id/run-now` | Generate today's messages immediately (for testing or catch-up) | P:sendInvites |

The daily scheduled run is not an HTTP endpoint. EventBridge Scheduler places a message on SQS and the worker handles it.

### 5.9 Gallery, Live Stream, and Share Links (Phase 3)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/albums` | List albums (filter by event) | M |
| POST | `/albums` | Create an album | P:manageMedia |
| PATCH | `/albums/:id` | Rename, reorder, hide, set cover | P:manageMedia |
| DELETE | `/albums/:id` | Delete an album | P:manageMedia |
| GET | `/albums/:id/media` | List media, newest first | M |
| POST | `/albums/:id/media/presign` | Get presigned upload URLs for a batch of files (checks type and size) | P:uploadMedia |
| POST | `/albums/:id/media/complete` | Confirm uploaded files so processing can start | P:uploadMedia |
| PATCH | `/media/:id` | Edit caption or hide | P:manageMedia |
| DELETE | `/media/:id` | Remove an item | P:manageMedia |
| GET | `/share-links` | List gallery and live links | A |
| POST | `/share-links` | Create a link with optional passcode, expiry, and download setting | A |
| PATCH | `/share-links/:id` | Change passcode, expiry, or download setting | A |
| DELETE | `/share-links/:id` | Revoke a link | A |

**Public (guests):**

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| POST | `/public/share/:token/unlock` | Submit the passcode; sets a short-lived cookie | Token |
| GET | `/public/gallery/:token` | Albums the link covers | Token |
| GET | `/public/gallery/:token/albums/:albumId/media` | Paged thumbnails and signed media URLs | Token |
| GET | `/public/live/:token` | Event name, time, stream status, and embed URL | Token |

### 5.10 Vendors (Phase 4)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/vendors` | List vendors (filter by service type, event) | P:manageVendors |
| POST | `/vendors` | Add a vendor | P:manageVendors |
| GET | `/vendors/:id` | Vendor detail | P:manageVendors or V |
| PATCH | `/vendors/:id` | Edit a vendor | P:manageVendors |
| DELETE | `/vendors/:id` | Soft delete | P:manageVendors |
| GET | `/vendors/:id/payments` | Agreed amount, paid so far (from expenses), balance, due date | P:manageVendors or V |

### 5.11 Timeline, Shagun, and Food (Phase 4)

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/events/:id/timeline` | Ordered run-of-show items | M |
| POST | `/events/:id/timeline` | Add an item | P:manageEvents |
| PATCH | `/timeline/:id` | Edit an item | P:manageEvents |
| DELETE | `/timeline/:id` | Remove an item | P:manageEvents |
| POST | `/events/:id/timeline/reorder` | Reorder items | P:manageEvents |
| GET | `/shagun` | List entries (filter by event, kind) | P:viewShagun |
| POST | `/shagun` | Add an entry | P:viewShagun |
| PATCH | `/shagun/:id` | Edit an entry | P:viewShagun |
| DELETE | `/shagun/:id` | Remove an entry | P:viewShagun |
| GET | `/shagun/summary` | Totals per event | P:viewShagun |
| GET | `/events/:id/catering` | Confirmed headcount and food preference counts for the caterer | P:viewGuests |

### 5.12 Dashboard, Notifications, Activity, and System

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/dashboard` | Metrics for all events or one (`eventId`); sections the user cannot see are left out | M |
| GET | `/notifications` | My notifications (filter unread) | M |
| PATCH | `/notifications/:id/read` | Mark one read | Own |
| POST | `/notifications/read-all` | Mark all read | Own |
| GET | `/activity-logs` | Audit trail (filter by entity, user, date) | A |
| GET | `/health` | Liveness check for the load balancer | Public |
| GET | `/ready` | Readiness check (database reachable) | Public |

## 6. Key Request and Response Examples

### 6.1 Login

```json
POST /api/v1/auth/login
{ "email": "admin@example.com", "password": "********" }

200 OK  (sets access and refresh cookies)
{ "user": { "id": "66f1...", "name": "Admin", "role": "admin", "permissions": {} } }
```

### 6.2 Creating a guest with a duplicate phone

```json
POST /api/v1/guests
{ "name": "Sunita Sharma", "phone": "9876543210", "group": "family", "invitedCount": 4, "eventIds": ["66f2..."] }

409 Conflict
{ "error": { "code": "DUPLICATE_PHONE",
             "message": "This number already exists for Ramesh Sharma.",
             "details": { "existing": [ { "id": "66f3...", "name": "Ramesh Sharma" } ] } } }
```

The app shows the popup. If the admin chooses Save anyway, the same request is sent again with `"confirmDuplicate": true` and returns `201 Created`.

### 6.3 Public RSVP (one answer for all events)

```json
POST /api/v1/public/rsvp/Xk3...token
{ "status": "confirmed", "confirmedCount": 3 }

200 OK
{ "status": "confirmed", "confirmedCount": 3, "respondedAt": "2026-11-20T09:12:00.000Z" }
```

`confirmedCount` cannot exceed the guest's `invitedCount`, and is required when `status` is `confirmed`.

### 6.4 Queue invitations

```json
POST /api/v1/messages/invitations      Idempotency-Key: 5d1c...
{ "audience": { "eventId": "66f2...", "groups": ["family"], "rsvpStatuses": ["pending"] },
  "channels": ["whatsapp", "email"],
  "templateIds": { "whatsapp": "66f4...", "email": "66f5..." } }

202 Accepted
{ "created": { "whatsapp": 120, "email": 85 }, "skippedNoContact": 4,
  "emailPlan": { "dailyLimit": 90, "estimatedFinish": "2026-11-23" } }
```

WhatsApp messages are created as `ready` for the send queue. Email messages are created as `queued` and sent by the worker within the daily quota.

### 6.5 Dashboard

```json
GET /api/v1/dashboard?eventId=66f2...

200 OK
{ "countdown": { "nextEvent": "Sangeet", "daysLeft": 12 },
  "guests": { "invited": 200, "confirmed": 128, "declined": 14, "pending": 58, "expectedHeadcount": 311 },
  "tasks": { "total": 64, "done": 31, "inProgress": 18, "overdue": 5 },
  "budget": { "totalPaise": 250000000, "spentPaise": 98250000, "remainingPaise": 151750000 },
  "email": { "sentToday": 40, "dailyLimit": 90 } }
```

The `budget` and `email` sections appear only for users with `viewBudget` and `sendInvites`.

## 7. Errors

Every error uses one shape, with a request id that also appears in the logs:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Amount must be greater than 0",
             "details": [ { "field": "amountPaise", "issue": "min" } ], "requestId": "b7f0..." } }
```

| HTTP | Code | When |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Body or query fails the schema |
| 401 | `UNAUTHENTICATED` | Missing, expired, or revoked session |
| 403 | `FORBIDDEN` | Logged in but missing the role or permission flag |
| 404 | `NOT_FOUND` | Record does not exist, is deleted, or the token is invalid or revoked |
| 409 | `DUPLICATE_PHONE` | Phone already used by another guest (confirm to proceed) |
| 409 | `CONFLICT` | Unique rule broken (email, `{guest, event}` pair, budget line) |
| 413 | `FILE_TOO_LARGE` | Upload over the limit |
| 415 | `UNSUPPORTED_MEDIA` | File type not allowed |
| 422 | `BUSINESS_RULE` | For example confirmed count above invited count |
| 429 | `RATE_LIMITED` | Too many requests; `Retry-After` header included |
| 500 | `INTERNAL_ERROR` | Unexpected failure; logged and sent to Sentry |

Public endpoints answer an unknown, revoked, or expired token with a plain `404`, so tokens cannot be probed.

## 8. Rate Limits (Starting Values)

| Area | Limit |
| --- | --- |
| `POST /auth/login` | 5 attempts per 15 minutes per IP and account, then a cool-down |
| `POST /auth/forgot-password` | 3 per hour per email |
| Public RSVP, gallery, live | 60 per minute per IP |
| Passcode unlock | 5 wrong attempts per 15 minutes per link |
| Authenticated API | 300 per minute per user |
| Upload presign | 60 per minute per user |

## 9. Uploads

Files never pass through the API. The flow is: presign, direct upload to S3, then complete.

1. The client calls a `presign` endpoint with file names, types, and sizes.
2. The API checks permission, type, and size and returns short-lived S3 upload URLs (about 10 minutes).
3. The browser uploads straight to S3.
4. The client calls `complete`. The API creates the records and, for gallery files, a Lambda makes thumbnails and marks each `media` record `ready`.

| File kind | Allowed types | Proposed size limit |
| --- | --- | --- |
| Photos | JPEG, PNG, WebP, HEIC | 15 MB each |
| Videos | MP4, MOV | 300 MB each |
| Bills and attachments | JPEG, PNG, PDF | 10 MB each |
| Guest import | CSV, XLSX | 2 MB |

## 10. Asynchronous Work

| Action | Response | Who finishes it |
| --- | --- | --- |
| Queue invitations | `202` with counts | Worker sends email within the daily quota; WhatsApp items wait in the send queue |
| Daily reminders | Scheduled, no HTTP call | EventBridge to SQS to worker writes `messages` |
| Guest import commit | `200` with a summary for up to a few hundred rows | Handled in the request, with a transaction |
| Media processing | `complete` returns immediately | Lambda creates thumbnails; status moves to `ready` |

Clients poll `GET /messages` or the dashboard for progress. Real-time push is not needed for this scale.

## 11. Code Structure and Quality

- **NestJS modules:** `auth`, `users`, `wedding`, `events`, `tasks`, `budgets`, `expenses`, `guests`, `invitations`, `messages`, `templates`, `reminders`, `media`, `share-links`, `vendors`, `timeline`, `shagun`, `dashboard`, `notifications`, `activity`, `health`.
- **Layers per module:** controller (routing and guards), service (business rules), repository (Mongoose), and shared zod schemas from `packages/shared`.
- **Cross-cutting:** auth guard, permission guard, validation pipe, error filter, request-id middleware, and an interceptor that writes `activityLogs` for every create, update, and delete.
- **Testing:** unit tests for services (RSVP rules, quota claim, budget summary), integration tests against a test database for every endpoint's access rules, and end-to-end tests for login, RSVP, and the send queue.
- **Contract:** the OpenAPI document is generated in CI, and the frontend client types come from it.

## 12. Phase Mapping

| Phase | Endpoint groups |
| --- | --- |
| Foundation | Auth, users, wedding, health |
| Phase 1 (MVP) | Events, tasks, budgets and expenses, guests and RSVP (including public RSVP), dashboard, notifications, activity logs |
| Phase 2 | Templates, messages and send queue, email quota, reminders, invitation cards |
| Phase 3 | Albums, media, share links, public gallery and live |
| Phase 4 | Vendors, timeline, shagun, catering summary, checklist templates, exports |

## 13. Decisions for Your Review

1. **Vendor access:** should vendors log in at all in the first release, or do you only want a vendor list kept by the team? Skipping vendor login removes the `V` rules for now.
2. **Task status by assignees:** assignees can change the status of their own tasks even without `manageTasks`. Is that right?
3. **Admin-only live stream and share links:** only the admin can set stream links and create share links. Should a member permission cover this too?
4. **Upload limits:** 15 MB photos and 300 MB videos are proposed. Do you expect longer or larger videos?
5. **Gallery download:** guests can download only if the admin enables it per link. Is a per-link setting the right level?
6. **Import size:** the guest import is designed for up to a few hundred rows per file. Is that enough?

## 14. Next Step

After you approve this design, the next step is the **screen and UX plan** (main screens, mobile layout, and flows), and then the project setup and the foundation sprint.
