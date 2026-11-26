import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/content/landing';
import { SectionHeading } from './section-heading';

export function Faq() {
  return (
    <section id="faq" className="container-page scroll-mt-24 py-16">
      <SectionHeading eyebrow={FAQ.eyebrow} title={FAQ.title} />
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {FAQ.items.map((item) => (
          <details key={item.q} className="card group p-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[1.0625rem] font-medium text-pearl [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-gold transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="mt-3 text-sm leading-6 text-pearl-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
