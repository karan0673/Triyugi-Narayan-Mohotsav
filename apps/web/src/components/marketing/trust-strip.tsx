import { TRUST } from '@/content/landing';
import { Icon } from './icons';

export function TrustStrip() {
  return (
    <section className="container-page pb-4 pt-10" aria-label="Why families trust it">
      <ul className="card grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <span className="icon-tile"><Icon name={item.icon} /></span>
            <div>
              <h3 className="text-[1.0625rem] font-medium text-pearl">{item.title}</h3>
              <p className="mt-1 text-[0.8125rem] leading-5 text-pearl-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
