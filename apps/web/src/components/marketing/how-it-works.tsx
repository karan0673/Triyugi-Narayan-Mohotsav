import { HOW } from '@/content/landing';
import { Icon } from './icons';
import { SectionHeading } from './section-heading';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-24 py-16">
      <SectionHeading eyebrow={HOW.eyebrow} title={HOW.title} text={HOW.text} />
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HOW.steps.map((step, i) => (
          <li key={step.title} className="card card-hover flex flex-col p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-serif text-[2.25rem] leading-none text-gold/60" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="icon-tile"><Icon name={step.icon} /></span>
            </div>
            <h3 className="mb-2 text-[1.0625rem] font-medium text-pearl">
              <span className="sr-only">Step {i + 1}: </span>{step.title}
            </h3>
            <p className="text-[0.8125rem] leading-5 text-pearl-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
