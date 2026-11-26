import { FEATURES, FEATURES_INTRO } from '@/content/landing';
import { Icon } from './icons';
import { SectionHeading } from './section-heading';

export function Features() {
  return (
    <section id="features" className="container-page scroll-mt-24 py-16">
      <SectionHeading {...FEATURES_INTRO} />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="card card-hover flex flex-col p-6">
            <span className="icon-tile mb-4"><Icon name={f.icon} className="h-[22px] w-[22px]" /></span>
            <h3 className="mb-2 text-[1.0625rem] font-medium text-pearl">{f.title}</h3>
            <p className="text-[0.8125rem] leading-5 text-pearl-muted">{f.text}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {f.points.map((p) => (
                <li key={p} className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-gold-soft">{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
