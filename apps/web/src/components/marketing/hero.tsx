import Link from 'next/link';
import { HERO, IMAGES } from '@/content/landing';
import { SampleTag } from './sample-tag';

export function Hero() {
  return (
    <section className="container-page pb-12 pt-6 lg:pt-10">
      <div className="grid items-center gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-6 lg:pr-8">
          <div className="pill self-start">
            <span className="pill-dot" aria-hidden="true" />
            <span className="eyebrow">{HERO.eyebrow}</span>
          </div>
          <h1 className="heading-xl">{HERO.title}</h1>
          <p className="lead max-w-xl">{HERO.text}</p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link href={HERO.primaryCta.href} className="btn btn-gold">{HERO.primaryCta.label}</Link>
            <a href={HERO.secondaryCta.href} className="btn btn-outline">{HERO.secondaryCta.label}</a>
          </div>
          <dl className="mt-4 grid max-w-xl grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-3">
            {HERO.stats.map((s) => (
              <div key={s.value}>
                <dt className="font-serif text-[1.375rem] font-medium leading-tight text-pearl">{s.value}</dt>
                <dd className="mt-1 text-[0.8125rem] leading-5 text-pearl-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] max-h-[520px] w-full overflow-hidden rounded-2xl border border-line shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.hero} alt={IMAGES.heroAlt} className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-wine-950/60 via-transparent to-transparent" />
          </div>

          <div className="card mt-4 p-4 lg:absolute lg:-bottom-6 lg:left-6 lg:mt-0 lg:w-[340px]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-pearl">{HERO.sampleCard.title}</span>
              <SampleTag />
            </div>
            <dl className="grid grid-cols-2 gap-3">
              {HERO.sampleCard.metrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-line bg-wine-950/40 px-3 py-2">
                  <dd className="font-serif text-lg text-gold-soft">{m.value}</dd>
                  <dt className="text-[0.6875rem] text-pearl-muted">{m.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
