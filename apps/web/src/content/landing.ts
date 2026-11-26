/**
 * All words on the Home page live here, so wording can be edited without touching layouts.
 * Rule: describe only what the product actually does. No invented statistics or reviews.
 */

export type IconKey =
  | 'calendar' | 'dashboard' | 'tasks' | 'wallet' | 'users' | 'send' | 'bell' | 'video'
  | 'images' | 'shield' | 'key' | 'link' | 'history' | 'archive' | 'languages' | 'lock'
  | 'check' | 'mapPin' | 'userCheck';

export const SITE = {
  name: 'Triyugi Narayan Mohotsav',
  shortName: 'Triyugi Narayan',
  tagline: 'Plan every ceremony, calmly.',
} as const;

export const IMAGES = {
  // Replace with your own photo: save it as apps/web/public/images/hero.jpg and change this path.
  hero: '/images/hero-placeholder.svg',
  heroAlt: 'Wedding ceremony moment',
} as const;

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Gallery & Live', href: '#gallery-and-live' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' },
] as const;

export const HERO = {
  eyebrow: 'Private wedding planner',
  title: 'Every ceremony, every guest, every detail, calmly in order.',
  text: 'One private place to plan events, invite guests, track expenses, and share the celebration live.',
  primaryCta: { label: 'Log in', href: '/login' },
  secondaryCta: { label: 'Explore features', href: '#features' },
  stats: [
    { value: '9 tools', label: 'From planning to celebration' },
    { value: 'WhatsApp & email', label: 'Invitations and reminders' },
    { value: 'Private links', label: 'No guest accounts needed' },
  ],
  sampleCard: {
    title: 'Dashboard',
    metrics: [
      { label: 'Days to next event', value: '12' },
      { label: 'Guests confirmed', value: '128 / 200' },
      { label: 'Tasks done', value: '31 / 64' },
      { label: 'Budget used', value: '39%' },
    ],
  },
} as const;

export const TRUST = [
  { icon: 'shield', title: 'Role-based access', text: 'Choose what each family member can see and do.' },
  { icon: 'link', title: 'Private guest links', text: 'Guests respond from a personal link, with no account to create.' },
  { icon: 'archive', title: 'Daily backups', text: 'Your schedules, guest list, and expenses are backed up every day.' },
  { icon: 'languages', title: 'English & Hindi', text: 'Made for elders and youth alike. Hindi arrives in a later release.' },
] as const;

export const FEATURES_INTRO = {
  eyebrow: 'Everything in one place',
  title: 'Designed for quiet execution and graceful memories',
  text: 'Nine tools that work together, so nothing depends on a phone call or a paper list.',
} as const;

export const FEATURES = [
  { icon: 'calendar', title: 'Events & timings', text: 'Every ceremony with its date, venue, map link, and run-of-show.', points: ['Venue and map', 'Hour-by-hour timeline'] },
  { icon: 'dashboard', title: 'Dashboard', text: 'Guests, tasks, and budget at a glance, with a countdown to the next event.', points: ['Live counts', 'Per-event view'] },
  { icon: 'tasks', title: 'Task planner', text: 'Owners, deadlines, and a clear board, so every responsibility has a name.', points: ['Assign owners', 'Overdue alerts'] },
  { icon: 'wallet', title: 'Expense tracker', text: 'Budget versus spent for each event and category, with bills attached.', points: ['Vendor payments', 'Excel and PDF export'] },
  { icon: 'users', title: 'Guests & RSVP', text: 'Guest groups, one RSVP per family, food preferences, and headcount.', points: ['Per-event invitations', 'Catering headcount'] },
  { icon: 'send', title: 'Invitations', text: 'Personal WhatsApp and email invitations with a ready-made card.', points: ['One-tap WhatsApp', 'Sent tracking'] },
  { icon: 'bell', title: 'Reminders', text: '“2 days left” and “tomorrow” reminders, by email and a daily WhatsApp list.', points: ['Email on schedule', 'Daily send list'] },
  { icon: 'video', title: 'Live stream', text: 'Share the ceremony with relatives who cannot travel, on a private link.', points: ['Private link', 'Optional passcode'] },
  { icon: 'images', title: 'Gallery', text: 'Albums for every ceremony, with photos and videos shared with family.', points: ['Albums by event', 'Download if you allow'] },
] as const;

export const WALKTHROUGH = {
  eyebrow: 'The digital mandap',
  title: 'One flow across three chapters',
  sampleNote: 'Sample data shown',
  tabs: [
    {
      id: 'plan', label: 'Plan', phase: 'Phase 01', kicker: 'Planning',
      title: 'Precise schedules, zero anxiety',
      text: 'Coordinate rituals, vendors, and tasks in a single calm timeline that the whole team can see.',
      points: ['Task owners and deadlines', 'Run-of-show for every ceremony'],
    },
    {
      id: 'invite', label: 'Invite', phase: 'Phase 02', kicker: 'Guests',
      title: 'Warm, simple coordination',
      text: 'Send personal invitations on WhatsApp and email, then see each family’s answer in one place.',
      points: ['One RSVP per family', 'Food preferences and headcount'],
    },
    {
      id: 'celebrate', label: 'Celebrate', phase: 'Phase 03', kicker: 'Live and memories',
      title: 'Bring relatives together, near or far',
      text: 'Share the ceremony live and keep every photo and video in albums for the family.',
      points: ['Private live stream link', 'Albums for every event'],
    },
  ],
  schedule: {
    title: 'Ceremony schedule',
    badge: 'Sample',
    items: [
      { time: '07:30 AM', name: 'Haldi', meta: 'Family courtyard • Owner: Meera' },
      { time: '11:15 AM', name: 'Varmala and Pheras', meta: 'Main mandap • Owner: Rohan' },
      { time: '06:00 PM', name: 'Sangeet and dinner', meta: 'Garden lawn • 200 guests expected' },
    ],
  },
  rsvp: {
    title: 'Family RSVP',
    badge: 'Sample • Confirmed',
    family: 'The Sharma family',
    meta: '4 people coming • All events',
    events: ['Haldi', 'Sangeet', 'Pheras'],
    food: 'Pure vegetarian',
    whatsapp: 'WhatsApp sent',
  },
  live: { badge: 'Live', title: 'Pheras', meta: 'Watch from anywhere, on a private link' },
} as const;

export const HOW = {
  eyebrow: 'How it works',
  title: 'Four simple steps to a calm celebration',
  text: 'Every responsibility has an owner, so nobody carries the whole wedding alone.',
  steps: [
    { icon: 'calendar', title: 'Set up your events', text: 'Add each ceremony with its date, time, and venue.' },
    { icon: 'tasks', title: 'Assign tasks and budget', text: 'Give every task an owner and set a budget for each event.' },
    { icon: 'send', title: 'Invite and track RSVPs', text: 'Send personal invitations and watch the answers come in.' },
    { icon: 'video', title: 'Celebrate and share', text: 'Stream the ceremony and keep the memories in shared albums.' },
  ],
} as const;

export const ROLES = {
  eyebrow: 'Who sees what',
  title: 'The right information for the right people',
  text: 'Budgets and vendor details stay discreet, while guests enjoy a simple page of their own.',
  items: [
    {
      tier: 'Tier 01', badge: 'Host • Family head', title: 'Admin',
      text: 'Complete control over events, money, and privacy settings.',
      points: ['Events and schedule control', 'Budgets and vendor payments', 'Team members and permissions', 'Exports of guests and expenses'],
      locked: [],
    },
    {
      tier: 'Tier 02', badge: 'Core committee', title: 'Team member',
      text: 'Cousins and coordinators looking after specific tasks and guests.',
      points: ['Assigned tasks and checklists', 'Guest list, if you allow it', 'Gallery uploads, if you allow it'],
      locked: ['No budget access unless you grant it'],
    },
    {
      tier: 'Tier 03', badge: 'Family • Attendees', title: 'Guest',
      text: 'A simple personal page, with no account or password.',
      points: ['Personal link from WhatsApp or email', 'Their events and venue details', 'One RSVP for all events', 'Live stream and gallery links'],
      locked: [],
    },
  ],
} as const;

export const LIVE = {
  eyebrow: 'Live & gallery',
  title: 'Everyone is there, wherever they are',
  text: 'Not every relative can travel. Share the ceremony on a private live link, and keep every photo and video in albums sorted by event.',
  points: [
    { icon: 'video', text: 'Private live link with an optional passcode' },
    { icon: 'images', text: 'Albums for each ceremony' },
    { icon: 'lock', text: 'Downloads only if you allow them' },
  ],
  caption: { title: 'Pheras', meta: 'Sample gallery album' },
} as const;

export const SECURITY = {
  eyebrow: 'Private by design',
  title: 'Protected with discretion',
  text: 'Your guest list, budget, and photos stay with your family. They are not sold, listed in search engines, or shared with third parties.',
  badge: 'Family privacy',
  items: [
    { icon: 'key', title: 'Granular permissions', text: 'Budgets and vendor bills are visible only to the people you choose.' },
    { icon: 'link', title: 'Revocable guest links', text: 'Cancel or replace a guest’s link at any time.' },
    { icon: 'archive', title: 'Daily backups', text: 'Your wedding data is backed up every day.' },
    { icon: 'history', title: 'Activity log', text: 'A record of who changed what, and when.' },
  ],
} as const;

export const FAQ = {
  eyebrow: 'Questions',
  title: 'Good to know',
  items: [
    { q: 'Who can use the app?', a: 'Access for the family team is by invitation from the admin, who decides what each person can see and do.' },
    { q: 'Do guests need to create an account?', a: 'No. Each guest receives a personal link on WhatsApp or email and can respond, view their events, and watch the live stream from it.' },
    { q: 'How do invitations work?', a: 'The app prepares a personalised message for each guest. For WhatsApp you tap a link, WhatsApp opens with the message ready, and you press send. Email is sent for you.' },
    { q: 'Are reminders automatic?', a: 'Email reminders go out on the schedule you set. WhatsApp reminders appear in a daily list, one tap per guest, because WhatsApp messages are sent by you.' },
    { q: 'Can relatives watch the ceremony live?', a: 'Yes. You add the link of your live stream to an event, and guests watch it on a private page, with an optional passcode.' },
    { q: 'Who can see the budget?', a: 'Only the admin and team members you give budget access. Everyone else never sees it.' },
    { q: 'Is Hindi supported?', a: 'English comes first. Hindi is planned for a later release.' },
  ],
} as const;

export const CTA = {
  eyebrow: 'Ready when you are',
  title: 'Ready to bring it all together?',
  text: 'Plan your celebration with calm, dignified precision, from the first ceremony to the last photo.',
  note: 'Hindi support is planned for a later release.',
} as const;

export const FOOTER_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
] as const;
