# Triyugi Narayan Mohotsav: Product Requirements Document (PRD)

**Version:** 1.0 (Draft for review) **Product type:** Web application **Status:** Awaiting owner review

## 1. Overview

### 1.1 Purpose

Triyugi Narayan Mohotsav is a web application for planning and running a multi-event wedding. A wedding has many functions (for example Haldi, Mehendi, Sangeet, Baraat, Pheras, Reception), and managing guests, tasks, expenses, and communication manually is difficult and error-prone. This product gives the family and organising team one place to see who is responsible for what, who is invited, how much has been spent, and what is happening on each day.

### 1.2 Problem Statement

Today, wedding planning is handled through phone calls, WhatsApp groups, paper lists, and spreadsheets. This leads to:

- Unclear ownership of tasks and missed deadlines
- No single view of the budget and actual spending
- Guest lists that are scattered, with no reliable record of who is invited to which function
- Manual, repetitive invitations and reminders
- Photos and videos spread across many people's phones

### 1.3 Product Vision

One dependable place where a family can plan every event of the wedding, track responsibilities and money, invite and remind guests, and share the memories afterwards.

## 2. Goals and Non-Goals

### 2.1 Goals

1. Let the admin create and manage multiple events under one wedding.
2. Make every task and responsibility visible, with a clear owner and deadline.
3. Give a live view of budget versus actual expense, per event and per category.
4. Manage the guest list with per-event invitations and RSVP status.
5. Send invitations and reminders through WhatsApp and other channels with minimal manual effort.
6. Provide live streaming access for remote attendees and a shared photo/video gallery.
7. Protect sensitive information (budget, guest contacts, media) through role-based access.

### 2.2 Non-Goals (Explicitly Out of Scope)

- Room allotment and guest accommodation (guests stay at the family house)
- A separate full guest portal or guest app experience
- Music and playlist requests for the Sangeet
- Post-wedding thank-you message campaigns
- Building a custom video streaming engine (an external service will be embedded)
- Native mobile apps (the web app must be mobile-friendly instead)

## 3. Users and Roles

| Role | Description | Typical person |
| --- | --- | --- |
| **Admin** | Full control over all data and settings | Family head or main organiser |
| **Member** | Logs in to view and update assigned work; access depends on permissions the admin grants | Relatives, friends, helpers on the team |
| **Vendor** (Phase 4) | Limited access to their own tasks and payment status | Caterer, decorator, photographer |
| **Guest / Viewer** | No login to the planning side. Receives links for the invitation, RSVP, live stream, and gallery | Invited guests |

> Assumption: Because a separate guest portal is out of scope, guests reach RSVP, the live stream, and the gallery through simple shareable links (optionally protected by a passcode), not through a full account area. See Open Questions.

## 4. Scope and Release Phases

| Phase | Theme | Modules |
| --- | --- | --- |
| **Phase 1 (MVP)** | Core planning | Authentication and roles, Events, Dashboard, Task Planner, Expense Tracker, Guest Management with per-event invitations, RSVP tracking |
| **Phase 2** | Communication | WhatsApp/SMS/email/link invitations, digital invitation card, automated reminders |
| **Phase 3** | Media | Live streaming, Gallery |
| **Phase 4** | Operations | Vendor management, payment tracking, event timeline, food preferences and headcount, shagun register, reports and export, Hindi/English support, activity log refinements |

## 5. Functional Requirements

Priority key: **P0** = must have for that phase, **P1** = should have, **P2** = nice to have.

### 5.1 Authentication and Access Control

| ID | Requirement | Priority |
| --- | --- | --- |
| AUTH-1 | Users can log in with email or mobile number and password. | P0 |
| AUTH-2 | Admin can create, invite, deactivate, and delete member accounts. | P0 |
| AUTH-3 | Roles (Admin, Member, Vendor) control what each user can see and do. | P0 |
| AUTH-4 | Admin can set per-member permissions (for example: can view budget, can edit guests, can upload to gallery). | P0 |
| AUTH-5 | Password reset through email or OTP. | P0 |
| AUTH-6 | Sessions expire after inactivity and users can log out from all devices. | P1 |
| AUTH-7 | Optional OTP-based login for members. | P2 |

### 5.2 Event Management

| ID | Requirement | Priority |
| --- | --- | --- |
| EVT-1 | Admin can create a wedding and add multiple events under it. | P0 |
| EVT-2 | Each event has a name, date, start and end time, venue name, address, map link, dress code, and description. | P0 |
| EVT-3 | Events can be edited, reordered, cancelled, or deleted by the admin. | P0 |
| EVT-4 | Each event has a status: Upcoming, Ongoing, Completed, Cancelled. | P1 |
| EVT-5 | Admin can duplicate an event or start from a ceremony template. | P2 |

### 5.3 Dashboard

| ID | Requirement | Priority |
| --- | --- | --- |
| DASH-1 | Show total number of events and a countdown to the next event. | P0 |
| DASH-2 | Show guest metrics: invited, confirmed, declined, pending, expected headcount. | P0 |
| DASH-3 | Show task metrics: total, completed, in progress, overdue. | P0 |
| DASH-4 | Show budget metrics: total budget, spent, remaining, percentage used. | P0 |
| DASH-5 | Show upcoming deadlines and the member's own assigned tasks. | P1 |
| DASH-6 | Dashboard content respects roles; members without budget permission do not see budget figures. | P0 |
| DASH-7 | Filter dashboard metrics by event. | P1 |

### 5.4 Task Planner

| ID | Requirement | Priority |
| --- | --- | --- |
| TASK-1 | Create tasks with title, description, event, owner, due date, and priority (Low, Medium, High). | P0 |
| TASK-2 | Task status: To Do, In Progress, Done. | P0 |
| TASK-3 | Assign a task to one or more members. | P0 |
| TASK-4 | Add comments and attachments to a task. | P1 |
| TASK-5 | View tasks as a list, by event, by owner, and as a board (Kanban). | P1 |
| TASK-6 | Filter and search by owner, event, status, priority, and due date. | P0 |
| TASK-7 | Overdue tasks are highlighted. | P0 |
| TASK-8 | Checklist templates per ceremony type that can be applied to an event. | P2 |
| TASK-9 | A responsibility view shows what each person is responsible for across all events. | P1 |

### 5.5 Expense Tracker

| ID | Requirement | Priority |
| --- | --- | --- |
| EXP-1 | Set an overall budget and a budget per event and per category (for example catering, decoration, clothing, photography, transport). | P0 |
| EXP-2 | Add an expense with amount, date, category, event, vendor or payee, payment mode, and notes. | P0 |
| EXP-3 | Attach a bill or receipt image or PDF to an expense. | P1 |
| EXP-4 | Show spent versus budget per event and per category with charts. | P0 |
| EXP-5 | Warn the admin when spending reaches a threshold (for example 80% of a budget). | P1 |
| EXP-6 | Edit and delete expenses with a record of the change. | P0 |
| EXP-7 | Export expenses to Excel or PDF. | P1 |
| EXP-8 | Expense data is visible only to users with budget permission. | P0 |

### 5.6 Guest Management

| ID | Requirement | Priority |
| --- | --- | --- |
| GST-1 | Add guests individually with name, phone, email, group (Family, Relatives, Friends, Others), and notes. | P0 |
| GST-2 | Import guests in bulk from an Excel/CSV file. | P1 |
| GST-3 | Assign each guest to one or more events (per-event invitation list). | P0 |
| GST-4 | Track the number of people per invitation (guest plus family members). | P0 |
| GST-5 | Search, filter, and sort guests by group, event, and RSVP status. | P0 |
| GST-6 | Detect likely duplicate guests (same phone number). | P1 |
| GST-7 | Record food preference (veg, non-veg, Jain, allergies) per guest. | P1 (Phase 4) |
| GST-8 | Export the guest list to Excel or PDF. | P1 |

### 5.7 RSVP Tracking

| ID | Requirement | Priority |
| --- | --- | --- |
| RSVP-1 | Each invitation has a status per event: Pending, Confirmed, Declined, Maybe. | P0 |
| RSVP-2 | A guest can respond through a personal link without creating an account, stating how many people are coming. | P0 |
| RSVP-3 | Admin and permitted members can also update RSVP manually (for example after a phone call). | P0 |
| RSVP-4 | RSVP changes update dashboard guest metrics immediately. | P0 |
| RSVP-5 | Show the confirmed headcount per event. | P0 |

### 5.8 Invitations

| ID | Requirement | Priority |
| --- | --- | --- |
| INV-1 | Generate a digital invitation for each event or for the full wedding, using a customisable template (names, date, venue, map link, photo). | P1 |
| INV-2 | Send invitations through WhatsApp using the WhatsApp Business API. | P0 (Phase 2) |
| INV-3 | Send invitations through SMS and email. | P1 |
| INV-4 | Provide a shareable link so the admin can send the invitation manually on any social platform. | P0 |
| INV-5 | Personalise each message with the guest's name and the events they are invited to. | P1 |
| INV-6 | Select guests (all, by group, by event, or by RSVP status) and send in bulk. | P0 |
| INV-7 | Track delivery status (Sent, Delivered, Failed) per guest and allow retry. | P1 |
| INV-8 | If a message channel fails, fall back to a shareable link. | P1 |

### 5.9 Reminders

| ID | Requirement | Priority |
| --- | --- | --- |
| REM-1 | Admin can schedule event reminders to guests (for example 2 days before, 1 day before, on the day). | P0 (Phase 2) |
| REM-2 | Reminders are sent automatically at the scheduled time through the configured channels. | P0 |
| REM-3 | Reminder text is editable and personalised with guest name, event, date, time, and venue. | P1 |
| REM-4 | Reminders can target a segment (for example only Confirmed or Pending guests). | P1 |
| REM-5 | Task deadline reminders are sent to members (in-app and by email or WhatsApp). | P1 |
| REM-6 | A log shows which reminders were sent, to whom, and the delivery result. | P1 |

### 5.10 Live Streaming

| ID | Requirement | Priority |
| --- | --- | --- |
| LIVE-1 | Admin can attach a live stream link (for example YouTube Live, Vimeo, or a streaming service) to each event. | P0 (Phase 3) |
| LIVE-2 | The stream is shown on an event live page inside the app. | P0 |
| LIVE-3 | Access to the live page is by shareable link, optionally protected by a passcode. | P1 |
| LIVE-4 | The live page shows event name, date, time, and status (Not started, Live, Ended). | P1 |
| LIVE-5 | Admin can send the live link to guests through the invitation and reminder channels. | P1 |
| LIVE-6 | If supported by the streaming provider, the recording is retained and linked on the event page afterwards. | P2 |

### 5.11 Gallery

| ID | Requirement | Priority |
| --- | --- | --- |
| GAL-1 | Create albums per event. | P0 (Phase 3) |
| GAL-2 | Upload photos and videos to an album (multiple files at once, with progress and resume on failure). | P0 |
| GAL-3 | Upload rights are controlled by permission; viewing is available to all intended users. | P0 |
| GAL-4 | Generate thumbnails and compress images for fast loading. | P0 |
| GAL-5 | View items in a grid with a full-screen viewer and download option (can be disabled by admin). | P1 |
| GAL-6 | Gallery is accessible through a shareable link, optionally protected by a passcode. | P1 |
| GAL-7 | Admin can delete or hide items and reorder albums. | P1 |
| GAL-8 | Enforce file size and type limits. | P0 |

### 5.12 Vendor Management and Payments (Phase 4)

| ID | Requirement | Priority |
| --- | --- | --- |
| VEN-1 | Maintain a vendor list with name, service type, contact details, and notes. | P1 |
| VEN-2 | Link vendors to events, tasks, and expenses. | P1 |
| VEN-3 | Record agreed amount, advance paid, balance due, and due dates. | P1 |
| VEN-4 | Send the admin payment due reminders. | P1 |
| VEN-5 | Vendor login with access limited to their own tasks and payment status. | P2 |

### 5.13 Other Phase 4 Modules

| ID | Requirement | Priority |
| --- | --- | --- |
| TIME-1 | Event timeline (run-of-show): ordered activities with time, owner, and notes, viewable by the team. | P1 |
| FOOD-1 | Catering summary: headcount and food preference counts per event, exportable for the caterer. | P1 |
| GIFT-1 | Shagun and gift register: giver, amount or gift, event, and notes, visible only to the admin or permitted users. | P1 |
| LOG-1 | Activity log: who changed what and when, for tasks, expenses, guests, and events. | P1 |
| LANG-1 | Interface available in Hindi and English with a language switcher. | P1 |
| REP-1 | Reports and exports (guest list, expenses, tasks) in Excel and PDF. | P1 |

## 6. Permissions Matrix (Default)

| Capability | Admin | Member (default) | Vendor |
| --- | --- | --- | --- |
| Manage users and permissions | Yes | No | No |
| Create and edit events | Yes | View only | View assigned |
| View dashboard | Full | Limited (no budget unless granted) | No |
| Create and assign tasks | Yes | Update own tasks; create if granted | Own tasks only |
| View and edit expenses and budget | Yes | Only if granted | Own payments only |
| View and edit guests | Yes | Only if granted | No |
| Send invitations and reminders | Yes | Only if granted | No |
| Manage live stream links | Yes | No | No |
| Upload to gallery | Yes | Only if granted | No |
| View gallery | Yes | Yes | No |
| View shagun register | Yes | Only if granted | No |

The admin can adjust any member's permissions individually.

## 7. Key User Flows

1. **Set up the wedding:** Admin logs in, creates the wedding, adds events with dates and venues, and invites team members with roles.
2. **Assign work:** Admin creates tasks per event, assigns owners and deadlines; members get notified and update status.
3. **Track money:** Admin sets budgets; members with permission add expenses with bills; the dashboard shows spending against budget.
4. **Invite guests:** Admin adds guests, assigns them to events, selects a group, and sends invitations through WhatsApp or a shared link.
5. **Collect RSVPs:** Guests open their personal link and confirm headcount; the dashboard updates.
6. **Remind:** The system sends scheduled reminders such as "2 days left" and "tomorrow is the function".
7. **On the event day:** Remote guests open the live link; the team follows the timeline.
8. **After the event:** Permitted users upload photos and videos; everyone with the link views the gallery.

## 8. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| **Usability** | Mobile-first responsive design; usable by non-technical family members; simple navigation with a clear dashboard |
| **Performance** | Main pages load in under 3 seconds on a typical mobile connection; gallery uses thumbnails and lazy loading |
| **Scalability** | Support at least 1,000 guests and 20 concurrent team members per wedding; live stream load handled by the external provider |
| **Security** | HTTPS everywhere; passwords hashed; role-based access enforced on the server; secure file storage with access control |
| **Privacy** | Guest phone numbers and media are accessible only to authorised users or valid links; admin can revoke links |
| **Reliability** | Daily automated backups; target uptime of 99.5% around event dates |
| **Auditability** | Activity log for key changes (events, guests, tasks, expenses) |
| **Compatibility** | Latest versions of Chrome, Safari, Edge, and Firefox on Android, iOS, and desktop |
| **Localisation** | English and Hindi; dates and currency in Indian formats (INR) |
| **Accessibility** | Readable font sizes and sufficient contrast |

## 9. Data Model (High Level)

| Entity | Key fields |
| --- | --- |
| **Wedding** | id, name, dates, admin |
| **User** | id, name, email/phone, role, permissions, status |
| **Event** | id, wedding, name, date, start/end time, venue, address, map link, dress code, status, stream link |
| **Task** | id, event, title, description, owner(s), due date, priority, status, comments |
| **Budget** | id, event, category, amount |
| **Expense** | id, event, category, vendor, amount, date, payment mode, bill file, created by |
| **Vendor** | id, name, service type, contact, agreed amount, advance, balance, due date |
| **Guest** | id, name, phone, email, group, food preference, notes |
| **Invitation** | id, guest, event, headcount invited, RSVP status, headcount confirmed, link token, channel, delivery status |
| **Reminder** | id, event, audience segment, channel, schedule, message, status |
| **Media** | id, event/album, type, file URL, thumbnail, uploaded by, visibility |
| **Gift/Shagun** | id, giver, event, amount/description, notes |
| **Activity Log** | id, user, action, entity, timestamp |

## 10. Technical Approach (Recommended)

- **Frontend:** React or Next.js, responsive and mobile-first
- **Backend:** Node.js (Express or NestJS) or Django
- **Database:** PostgreSQL
- **Authentication:** JWT-based sessions with role-based access control
- **Messaging:** WhatsApp Business API via a provider (for example Twilio, Gupshup, or Meta Cloud API) with approved message templates; SMS and email providers as fallback
- **Scheduling:** cron or a job queue (for example BullMQ) for reminders
- **Live streaming:** embed an external service (YouTube Live, Vimeo, Mux, or Agora)
- **File storage:** AWS S3 or Cloudinary with image compression and thumbnails
- **Hosting:** Vercel, Render, or AWS, with automated backups

## 11. Success Metrics

| Metric | Target |
| --- | --- |
| Share of planned tasks with an assigned owner | 95% or higher |
| Tasks completed before due date | 80% or higher |
| Expenses recorded in the app versus total spend | 90% or higher |
| Guests with a recorded RSVP before the event | 85% or higher |
| Invitation delivery success rate | 95% or higher |
| Reminders delivered on schedule | 99% or higher |
| Team members actively using the app each week | 80% or higher |
| Admin time spent on manual follow-ups | Reduced noticeably compared with the previous method |

## 12. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| WhatsApp automated messages require approved templates and have per-message costs | Prepare templates early, estimate costs, and keep the shareable-link and SMS fallbacks |
| Large video uploads slow the app and increase storage cost | Compress media, set size limits, use cloud storage and a CDN |
| Privacy of guest contacts and photos | Role-based access, passcode-protected links, ability to revoke links |
| Live stream demand overloads the app | Use an external streaming provider rather than self-hosting |
| Low adoption by less technical family members | Simple mobile-friendly UI, Hindi language support, short onboarding |
| Scope growth delays the MVP | Follow the phased plan and keep the non-goals list |
| Poor internet at the venue | Keep key pages light; consider offline viewing of the timeline later |

## 13. Assumptions

1. The product serves one wedding for one family initially (single wedding workspace).
2. Guests do not need accounts; they use personal or shared links.
3. Live streaming is provided by an external service, and the admin supplies the stream link.
4. Currency is INR and the primary languages are English and Hindi.
5. Accommodation, music requests, a guest portal, and thank-you campaigns are excluded.

## 14. Open Questions for the Owner

1. Will this app be used for **one wedding only**, or should it later support many families or planners (multiple weddings and subscriptions)?
2. Should the **gallery and live stream** be open to anyone with the link, or require a passcode or login?
3. Which **messaging channels** are mandatory at launch: WhatsApp only, or also SMS and email?
4. Do you already have a **WhatsApp Business account** and a streaming platform in mind?
5. What is the **target launch date**, and how many weeks before the first event must the MVP be ready?
6. Should members be able to **download** gallery photos and videos?
7. Who besides the admin should see the **budget and shagun register**?
8. Is there a **fixed budget** for development and recurring costs (messaging, storage, hosting)?

## 15. Sign-Off

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Product owner |  |  |  |
| Reviewer |  |  |  |
