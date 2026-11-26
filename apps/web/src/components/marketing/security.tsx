import { SECURITY } from '@/content/landing';
import { Icon } from './icons';

export function Security() {
  return (
    <section
      id="security"
      className="scroll-mt-20 border-y border-line py-16"
      style={{ background: 'linear-gradient(180deg, #17060a 0%, #220b12 50%, #150508 100%)' }}
    >
      <div className="container-page">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex max-w-xl flex-col gap-2">
            <span className="eyebrow">{SECURITY.eyebrow}</span>
            <h2 className="heading-lg">{SECURITY.title}</h2>
            <p className="lead">{SECURITY.text}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold-soft">
            <Icon name="shield" className="h-[18px] w-[18px]" />
            {SECURITY.badge}
          </div>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY.items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl border border-line p-6"
              style={{ background: 'linear-gradient(145deg, rgb(62 27 37 / 0.7) 0%, rgb(35 12 18 / 0.85) 100%)' }}
            >
              <span className="icon-tile"><Icon name={item.icon} className="h-[22px] w-[22px]" /></span>
              <h3 className="text-[1.0625rem] font-medium text-pearl">{item.title}</h3>
              <p className="text-[0.8125rem] leading-5 text-pearl-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
