import Link from 'next/link';

const NAV = [
  ['Dashboard', '/dashboard'],
  ['Events', '/events'],
  ['Tasks', '/tasks'],
  ['Expenses', '/expenses'],
  ['Guests', '/guests'],
  ['Invitations', '/messages'],
  ['Reminders', '/reminders'],
  ['Gallery', '/gallery'],
  ['Vendors', '/vendors'],
  ['Timeline', '/timeline'],
  ['Shagun', '/shagun'],
  ['Team', '/settings/users'],
  ['Activity', '/activity'],
] as const;

// TODO: server-side session check, redirect to /login when signed out, hide items by permission.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-surface p-4 md:block">
        <div className="mb-6 font-serif text-xl text-primary">Triyugi Narayan</div>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-control px-3 py-2 text-muted hover:bg-bg hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
