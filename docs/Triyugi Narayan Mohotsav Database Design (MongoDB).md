# Triyugi Narayan Mohotsav: Database Design (MongoDB)

**Version:** 1.1 (updated with owner decisions) **Database:** MongoDB Atlas (AWS Mumbai) with Mongoose **Scope:** Single wedding, REST API (NestJS), background worker

## 1. Design Principles

1. **Single wedding.** One `wedding` document holds global settings. There is no tenant or `weddingId` on every record.
2. **Money in paise.** All amounts are stored as integers in paise (₹1 = 100), never as decimals.
3. **Dates in UTC.** Dates are stored as UTC `Date` values and shown in IST in the app. Day-based logic (reminder offsets, daily email quota) uses the IST date.
4. **References for many-to-many and growing data, embedding for small bounded data.** For example, `invitations` is its own collection (guest × event), while a task's checklist is embedded.
5. **Soft delete where history matters.** `guests`, `expenses`, `tasks`, and `events` carry `deletedAt`. All normal queries filter `deletedAt: null`.
6. **Every document has** `createdAt`, `updatedAt`, and where relevant `createdBy`.
7. **Phone numbers** are stored in E.164 format (for example `+919876543210`). The `wa.me` link uses the digits only.
8. **Validation in two layers:** shared zod schemas at the API boundary and Mongoose schemas at the database.
9. **Authorisation is enforced by the API,** never by the database or the frontend.

## 2. Collections Overview

| # | Collection | Purpose | Phase |
| --- | --- | --- | --- |
| 1 | `wedding` | Singleton: global wedding settings | 1 |
| 2 | `users` | Admin, members, vendors with permissions | 1 |
| 3 | `sessions` | Refresh-token sessions (TTL) | 1 |
| 4 | `events` | Wedding functions | 1 |
| 5 | `tasks` | Task planner | 1 |
| 6 | `taskComments` | Comments on tasks | 1 |
| 7 | `budgets` | Budget lines per event and category | 1 |
| 8 | `expenses` | Money spent | 1 |
| 9 | `guests` | Guest directory with RSVP and sent status | 1 |
| 10 | `invitations` | Guest × event: which events each guest is invited to | 1 |
| 11 | `templates` | Editable invitation and reminder message text | 2 |
| 12 | `reminders` | Reminder schedule definitions | 2 |
| 13 | `messages` | Outbox: every email and WhatsApp message to send or track | 2 |
| 14 | `emailQuota` | Daily email counter for the Resend free-tier cap | 2 |
| 15 | `notifications` | In-app notifications for members | 2 |
| 16 | `albums` | Gallery albums per event | 3 |
| 17 | `media` | Photos and videos | 3 |
| 18 | `shareLinks` | Revocable links for gallery and live stream | 3 |
| 19 | `vendors` | Vendor directory and agreed amounts | 4 |
| 20 | `timelineItems` | Event run-of-show | 4 |
| 21 | `shagun` | Gift and shagun register | 4 |
| 22 | `checklistTemplates` | Ready-made task lists per ceremony | 4 |
| 23 | `activityLogs` | Audit trail | 1 (basic) |

## 3. Relationship Overview

```
wedding (1)

users ──< sessions
  │
  ├──< tasks >── events ──< budgets
  │      └──< taskComments       │
  │                              ├──< expenses >── vendors
  │                              ├──< timelineItems
  │                              ├──< albums ──< media
  │                              └──< invitations >── guests
  │                                        │              └──< shagun
  │                                        └──< messages >── templates
  │                                                  ▲
  └──< notifications              reminders ──────────┘

shareLinks ── (event | album)       emailQuota (per IST day)
activityLogs ── (any entity, any user)
```

`invitations` is the join between `guests` and `events`. `messages` is the single outbox for both email and WhatsApp, so the send queue, the reminder queue, and the daily quota all read from one place.

## 4. Collection Details

Notation: **R** = required, **O** = optional, `ref` = ObjectId reference.

### 4.1 `wedding` (singleton)

| Field | Type | Notes |
| --- | --- | --- |
| name | string R | For example "Triyugi Narayan Mohotsav" |
| familyNames | string O | Display names for invitation cards |
| startDate / endDate | Date R | Overall wedding span, used for the countdown |
| currency | string R | Default `INR` |
| defaultLanguage | `en` \| `hi` | Default `en` |
| totalBudgetPaise | int O | Overall budget |
| settings.dailyEmailLimit | int | Default 90 (buffer under Resend's 100/day) |
| settings.senderName / senderEmail | string | From-address for emails |
| settings.timezone | string | `Asia/Kolkata` |

### 4.2 `users`

| Field | Type | Notes |
| --- | --- | --- |
| name | string R |  |
| email | string R | Unique, lowercased |
| phone | string O | E.164 |
| passwordHash | string R | argon2 or bcrypt |
| role | `admin` \| `member` \| `vendor` |  |
| permissions | object | Flags below; admin implicitly has all |
| status | `invited` \| `active` \| `disabled` |  |
| vendorId | ref vendors O | For vendor users |
| language | `en` \| `hi` |  |
| lastLoginAt | Date O |  |

**Permission flags (member):** `viewBudget`, `editBudget`, `viewGuests`, `editGuests`, `sendInvites`, `manageTasks` (create and assign), `manageEvents`, `uploadMedia`, `manageMedia`, `viewShagun`, `manageVendors`.

**Indexes:** unique `email`; `role`; `status`.

### 4.3 `sessions`

| Field | Type | Notes |
| --- | --- | --- |
| userId | ref users R |  |
| refreshTokenHash | string R | Hashed, never stored raw |
| userAgent / ip | string O |  |
| expiresAt | Date R | **TTL index** removes expired sessions |
| revokedAt | Date O | Supports "log out from all devices" |

**Indexes:** `userId`; TTL on `expiresAt`.

### 4.4 `events`

| Field | Type | Notes |
| --- | --- | --- |
| name | string R |  |
| type | enum | `haldi`, `mehendi`, `sangeet`, `baraat`, `pheras`, `reception`, `other` |
| description | string O |  |
| startAt / endAt | Date R / O |  |
| venue.name / address / city / mapUrl | string |  |
| dressCode | string O |  |
| status | `upcoming` \| `ongoing` \| `completed` \| `cancelled` |  |
| order | int | Display order |
| stream.provider | `youtube` \| `vimeo` \| `other` O |  |
| stream.url | string O | Embed link (Phase 3) |
| stream.status | `not_started` \| `live` \| `ended` |  |
| deletedAt | Date O | Soft delete |

**Indexes:** `startAt`; `status`; `order`.

### 4.5 `tasks`

| Field | Type | Notes |
| --- | --- | --- |
| eventId | ref events O | Null for general wedding tasks |
| title | string R |  |
| description | string O |  |
| assigneeIds | ref users\[\] | One or more owners |
| priority | `low` \| `medium` \| `high` |  |
| status | `todo` \| `in_progress` \| `done` |  |
| dueAt | Date O |  |
| completedAt | Date O | Set when status becomes `done` |
| checklist | `{ text, done }[]` | Embedded, small |
| attachments | `{ key, name, size }[]` | S3 keys, embedded, capped |
| commentCount | int | Denormalised counter |
| createdBy | ref users R |  |
| deletedAt | Date O |  |

**Indexes:** `{ eventId, status }`; `{ assigneeIds, status, dueAt }`; `{ dueAt }`; text index on `title` for search.

### 4.6 `taskComments`

| Field | Type | Notes |
| --- | --- | --- |
| taskId | ref tasks R |  |
| authorId | ref users R |  |
| text | string R |  |

**Indexes:** `{ taskId, createdAt }`. Comments are separate because they grow without a fixed limit.

### 4.7 `budgets`

| Field | Type | Notes |
| --- | --- | --- |
| eventId | ref events O | Null for a wedding-wide line |
| category | string R | Typed by the user, any name (for example "Catering"); trimmed |
| categoryKey | string R | Lowercased, trimmed copy of `category`, set by the API; used for grouping and uniqueness |
| amountPaise | int R |  |

**Indexes:** unique `{ eventId, categoryKey }`. There is no fixed category list: a category exists because someone typed it, and the app suggests existing names while typing so "Catering" and "catering" do not split into two.

### 4.8 `expenses`

| Field | Type | Notes |
| --- | --- | --- |
| eventId | ref events O |  |
| category | string R | Typed by the user, any name; trimmed |
| categoryKey | string R | Lowercased copy of `category`, set by the API; used for grouping |
| title | string R | What was paid for |
| amountPaise | int R | Must be > 0 |
| date | Date R |  |
| vendorId | ref vendors O | Links payments to a vendor |
| payee | string O | Free text when there is no vendor |
| paymentMode | `cash` \| `upi` \| `bank` \| `card` \| `cheque` |  |
| paymentType | `advance` \| `balance` \| `full` \| `other` | Used for vendor payments |
| billKeys | string\[\] | S3 keys for receipts |
| notes | string O |  |
| createdBy | ref users R |  |
| deletedAt | Date O |  |

**Indexes:** `{ eventId, categoryKey, date }`; `{ vendorId }`; `{ date }`.

**Spent versus budget** is computed with an aggregation over `expenses` grouped by event and category and compared with `budgets`. There is no stored "spent" total, so it cannot drift out of sync.

### 4.9 `guests`

| Field | Type | Notes |
| --- | --- | --- |
| name | string R |  |
| phone | string O | E.164. Not unique: saving a number already used by another guest returns a duplicate warning (see below) |
| email | string O | Lowercased |
| group | `family` \| `relatives` \| `friends` \| `others` |  |
| invitedCount | int R | People covered by this invitation, minimum 1 |
| rsvp.status | `pending` \| `confirmed` \| `declined` \| `maybe` | One answer for all events this guest is invited to. Default `pending` |
| rsvp.confirmedCount | int O | People actually coming, applies to every invited event |
| rsvp.respondedAt | Date O |  |
| rsvp.source | `guest_link` \| `admin` |  |
| whatsapp.status | `not_sent` \| `sent` | Marked by the admin after tapping the `wa.me` link |
| whatsapp.sentAt / sentBy | Date / ref users |  |
| email.status | `not_sent` \| `queued` \| `sent` \| `failed` | Mirrors the latest invitation email |
| email.sentAt | Date O |  |
| foodPreference | `veg` \| `nonveg` \| `jain` O | Phase 4 use |
| allergies | string O |  |
| notes | string O |  |
| language | `en` \| `hi` | For message templates |
| linkToken | string R | Random 128-bit token, unique. Identifies the guest on their personal RSVP link |
| linkRevokedAt | Date O | Revokes the link |
| createdBy | ref users |  |
| deletedAt | Date O |  |

**Indexes:** unique `linkToken`; `phone`; `email`; `group`; `rsvp.status`; text index on `name`.

**Token note:** the token is stored as is (not hashed) because the app must rebuild the `wa.me` message with the personal link later. It is a random, unguessable value, and revoking or rotating it invalidates the old link.

**Duplicate phone warning:** when a guest is created or edited with a phone number already used by another guest, the API answers with a `DUPLICATE_PHONE` warning that names the existing guest. The app shows a popup ("This number already exists for \<name>"), and the admin can cancel or choose Save anyway, which sends the request again with `confirmDuplicate: true`. Bulk import runs the same check per row and reports duplicates in the import summary.

**RSVP model:** each guest gives one answer and one headcount for all the events they are invited to. The `invitations` collection only records which events a guest is invited to.

### 4.10 `invitations` (guest × event)

| Field | Type | Notes |
| --- | --- | --- |
| guestId | ref guests R |  |
| eventId | ref events R |  |
| createdBy | ref users O |  |
| deletedAt | Date O |  |

**Indexes:** unique `{ guestId, eventId }`; `{ eventId }`.

RSVP, headcount, and sent status live on `guests`, so a guest answers once for all their events. A dashboard filter by event takes the guest ids from `invitations` and then reads their RSVP. Per-event headcount (for example for the caterer) uses each invited guest's confirmed count.

### 4.11 `templates`

| Field | Type | Notes |
| --- | --- | --- |
| kind | `invitation` \| `reminder` |  |
| channel | `email` \| `whatsapp` |  |
| language | `en` \| `hi` |  |
| name | string R |  |
| subject | string O | Email only |
| body | string R | With placeholders such as `{{guestName}}`, `{{events}}`, `{{eventDate}}`, `{{venue}}`, `{{rsvpLink}}`, `{{liveLink}}` |
| isDefault | boolean |  |

**Indexes:** `{ kind, channel, language }`.

### 4.12 `reminders`

| Field | Type | Notes |
| --- | --- | --- |
| eventId | ref events R |  |
| name | string R | For example "2 days left" |
| offsetDays | int R | Days before the event, 0 means the day itself |
| sendTime | string | For example `09:00` IST |
| channels | (`email` \| `whatsapp`)\[\] |  |
| audience.rsvpStatuses | string\[\] | For example `confirmed`, `pending` |
| audience.groups | string\[\] O |  |
| templateIds | `{ email?, whatsapp? }` |  |
| status | `scheduled` \| `paused` \| `completed` |  |
| lastRunAt | Date O |  |

**Indexes:** `{ eventId }`; `{ status }`.

A daily scheduled job reads active reminders, resolves the audience, merges guests who share a message day into one combined message, and writes rows into `messages`.

### 4.13 `messages` (outbox)

| Field | Type | Notes |
| --- | --- | --- |
| kind | `invitation` \| `reminder` |  |
| channel | `email` \| `whatsapp` |  |
| guestId | ref guests R |  |
| eventIds | ref events\[\] | A combined message can cover several events |
| reminderId | ref reminders O |  |
| templateId | ref templates O |  |
| subject / body | string | Rendered text, stored so the exact message is auditable |
| scheduledFor | Date R |  |
| priority | int | Lower number sends first (event day and next day highest) |
| status | `queued` \| `sending` \| `sent` \| `failed` \| `skipped` \| `cancelled` \| `ready` | `ready` = WhatsApp message waiting for the admin to send |
| sentAt | Date O |  |
| sentBy | ref users O | For manual WhatsApp marking |
| attempts | int |  |
| lastError | string O |  |
| providerMessageId | string O | Resend ID for email |
| dedupeKey | string R | Unique, for example `reminder:<id>:guest:<id>:email`, prevents double sends |

**Indexes:** unique `dedupeKey`; `{ channel, status, scheduledFor, priority }` (worker pick-up and the WhatsApp "Send today" list); `{ guestId }`.

### 4.14 `emailQuota`

| Field | Type | Notes |
| --- | --- | --- |
| dateKey | string R | IST date, for example `2026-11-14` |
| sentCount | int R |  |
| limit | int R | Copied from `wedding.settings.dailyEmailLimit` |

**Indexes:** unique `dateKey`.

The worker claims capacity with an atomic update (`$inc` only while `sentCount < limit`). Messages that do not fit stay `queued` and roll to the next day, and the dashboard shows the remaining quota.

### 4.15 `notifications`

| Field | Type | Notes |
| --- | --- | --- |
| userId | ref users R |  |
| type | string | For example `task_assigned`, `task_due` |
| title / body | string |  |
| link | string O | In-app route |
| readAt | Date O |  |

**Indexes:** `{ userId, readAt, createdAt }`; TTL on `createdAt` (90 days).

### 4.16 `albums`

| Field | Type | Notes |
| --- | --- | --- |
| eventId | ref events O |  |
| title | string R |  |
| coverMediaId | ref media O |  |
| order | int |  |
| hidden | boolean |  |

**Indexes:** `{ eventId, order }`.

### 4.17 `media`

| Field | Type | Notes |
| --- | --- | --- |
| albumId | ref albums R |  |
| eventId | ref events O |  |
| type | `photo` \| `video` |  |
| s3Key / thumbKey | string |  |
| mimeType | string |  |
| sizeBytes | int | Limits enforced at upload |
| width / height / durationSec | number O |  |
| status | `uploading` \| `processing` \| `ready` \| `failed` |  |
| caption | string O |  |
| hidden | boolean |  |
| uploadedBy | ref users R |  |

**Indexes:** `{ albumId, createdAt }`; `{ status }`.

### 4.18 `shareLinks`

| Field | Type | Notes |
| --- | --- | --- |
| scope | `gallery` \| `live` |  |
| eventId / albumId | ref | Target of the link |
| token | string R | Random, unique |
| passcodeHash | string O | Optional passcode |
| allowDownload | boolean | Gallery only |
| expiresAt | Date O |  |
| revokedAt | Date O |  |
| createdBy | ref users |  |

**Indexes:** unique `token`; `{ scope, eventId }`.

### 4.19 `vendors` (Phase 4)

| Field | Type | Notes |
| --- | --- | --- |
| name | string R |  |
| serviceType | string R | Caterer, decorator, photographer, pandit, band, tent house |
| contactPerson / phone / email | string |  |
| eventIds | ref events\[\] |  |
| agreedAmountPaise | int O |  |
| balanceDueDate | Date O |  |
| notes | string O |  |

Paid amount is computed from `expenses` where `vendorId` matches, so **balance = agreed − sum of expenses**. There is one source of truth for money.

**Indexes:** `serviceType`; text index on `name`.

### 4.20 `timelineItems` (Phase 4)

| Field | Type |
| --- | --- |
| eventId | ref events R |
| startAt / endAt | Date R / O |
| title | string R |
| ownerIds | ref users\[\] |
| notes | string O |
| order | int |

**Indexes:** `{ eventId, startAt }`.

### 4.21 `shagun` (Phase 4)

| Field | Type | Notes |
| --- | --- | --- |
| guestId | ref guests O |  |
| giverName | string R |  |
| eventId | ref events O |  |
| kind | `cash` \| `gift` |  |
| amountPaise | int O | For cash |
| description | string O | For gifts |
| notes | string O |  |
| recordedBy | ref users R |  |

**Indexes:** `{ eventId }`; `{ guestId }`. Visible only with the `viewShagun` permission.

### 4.22 `checklistTemplates` (Phase 4)

| Field | Type |
| --- | --- |
| name | string R |
| eventType | enum |
| items | `{ title, offsetDays, priority }[]` |

Applying a template creates ordinary `tasks`, with due dates computed from the event date.

### 4.23 `activityLogs`

| Field | Type | Notes |
| --- | --- | --- |
| actorId | ref users R |  |
| action | string R | `create`, `update`, `delete`, `login`, `rsvp`, `send_marked` |
| entityType | string R |  |
| entityId | ObjectId R |  |
| summary | string | Readable line, for example "Changed due date of Book band" |
| changes | object O | Small before and after of changed fields only |

**Indexes:** `{ entityType, entityId, createdAt }`; `{ actorId, createdAt }`.

## 5. Key Queries and Their Indexes

| Need | Query | Index used |
| --- | --- | --- |
| Dashboard guest metrics | Group `guests` by `rsvp.status` and sum `invitedCount` and `rsvp.confirmedCount`; for one event, first take the guest ids from `invitations` | `rsvp.status`; `{ eventId }` on `invitations` |
| Dashboard task metrics | Group `tasks` by `status`; count overdue where `dueAt < now` | `{ eventId, status }`, `{ dueAt }` |
| My tasks | `tasks` where `assigneeIds` contains me, not done, sorted by `dueAt` | `{ assigneeIds, status, dueAt }` |
| Spent versus budget | Group `expenses` by event and `categoryKey`, join `budgets` | `{ eventId, categoryKey, date }`, unique budgets index |
| Guest list for an event | `invitations` by `eventId`, joined to `guests` | `{ eventId }` |
| WhatsApp "Send today" list | `messages` where `channel = whatsapp`, `status = ready`, `scheduledFor <= today` | `{ channel, status, scheduledFor, priority }` |
| Worker email batch | `messages` where `channel = email`, `status = queued`, due, sorted by `priority`, limited to remaining quota | same index plus `emailQuota` |
| RSVP page | Find guest by `linkToken`, then list their events through `invitations` | unique `linkToken`, `{ guestId }` |
| Gallery grid | `media` by `albumId`, `status = ready`, newest first | `{ albumId, createdAt }` |

At about 200 guests and a few thousand tasks, expenses, and messages, all of these run comfortably on a small Atlas cluster.

## 6. Consistency and Transactions

MongoDB Atlas supports multi-document transactions. We use them only where several records must change together:

- **Deleting a guest:** soft-delete the guest, its invitations, and cancel its queued messages.
- **Deleting or cancelling an event:** cascade to invitations, reminders, queued messages, and timeline items.
- **Bulk guest import:** insert guests and their invitations together, with a summary of rows that failed validation.
- **Combined invitation send:** create `messages` rows and set `email.status = queued` on the guest.

Everything else uses single-document atomic updates, which are fast and safe.

## 7. Data Lifecycle and Privacy

- **Backups:** Atlas daily backups with point-in-time restore.
- **Retention:** `sessions` and `notifications` expire by TTL; `activityLogs` and `messages` are kept for the life of the wedding.
- **Personal data:** guest phone numbers and emails are readable only by users with `viewGuests` or `editGuests`. Guest links can be revoked at any time.
- **After the wedding:** an admin export (Excel or PDF) of guests, expenses, and shagun is available before any data is archived or deleted.
- **Files** are never stored in MongoDB, only S3 keys.

## 8. PRD Coverage Check

| PRD module | Collections |
| --- | --- |
| Authentication and roles | `users`, `sessions` |
| Event management | `events` |
| Dashboard | Aggregations over `guests`, `invitations`, `tasks`, `expenses`, `budgets` |
| Task planner | `tasks`, `taskComments`, `notifications`, `checklistTemplates` |
| Expense tracker | `budgets`, `expenses` (categories typed freely, no category list) |
| Guest management and RSVP | `guests` (with RSVP and sent status), `invitations` (guest × event) |
| Invitations (wa.me send queue, email) | `templates`, `messages` |
| Reminders | `reminders`, `messages`, `emailQuota` |
| Live streaming | `events.stream`, `shareLinks` |
| Gallery | `albums`, `media`, `shareLinks` |
| Vendor and payments | `vendors`, `expenses` |
| Timeline, food, shagun, activity log | `timelineItems`, `guests.foodPreference`, `shagun`, `activityLogs` |

## 9. Confirmed Decisions

| Decision | Your answer | Effect on the design |
| --- | --- | --- |
| Duplicate phone numbers | Allowed, with a warning popup | Phone is not unique; the API returns `DUPLICATE_PHONE` and the admin can save anyway |
| RSVP | One answer for all events | RSVP and headcount live on `guests`; `invitations` only lists the events |
| Expense categories | No fixed list; typed freely | `category` is free text plus a normalised `categoryKey`; the app suggests existing names |
| Event types | No additions needed | Kept as listed, plus `other` |
| Soft delete | Yes for tasks and guests, and for other records where needed | `deletedAt` on `tasks`, `guests`, `events`, `expenses`, `invitations` |
| Member permissions | No changes | The eleven flags in section 4.2 stay |

## 10. Next Step

Once you approve this design, we move to the **API design**: endpoints per module, request and response shapes, and the permission rule for each endpoint.
