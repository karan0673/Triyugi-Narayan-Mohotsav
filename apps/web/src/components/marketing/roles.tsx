import { ROLES } from '@/content/landing';
import { Icon } from './icons';
import { SectionHeading } from './section-heading';

export function Roles() {
  return (
    <section className="container-page py-16" aria-label="Roles and access">
      <SectionHeading eyebrow={ROLES.eyebrow} title={ROLES.title} text={ROLES.text} center />
      <div className="grid gap-6 md:grid-cols-3">
        {ROLES.items.map((role) => (
          <article key={role.title} className="card flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="eyebrow">{role.tier}</span>
              <span className="rounded border border-line px-2 py-0.5 text-[0.6875rem] font-medium uppercase text-gold-soft">{role.badge}</span>
            </div>
            <h3 className="heading-sm">{role.title}</h3>
            <p className="text-[0.8125rem] leading-5 text-pearl-muted">{role.text}</p>
            <ul className="flex flex-col gap-2 border-t border-line pt-4">
              {role.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-pearl">
                  <Icon name="check" className="h-[18px] w-[18px] shrink-0 text-gold" />
                  {p}
                </li>
              ))}
              {role.locked.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-pearl-muted">
                  <Icon name="lock" className="h-[18px] w-[18px] shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
