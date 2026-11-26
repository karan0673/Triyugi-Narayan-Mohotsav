import { IMAGES, LIVE } from '@/content/landing';
import { Icon } from './icons';
import { SampleTag } from './sample-tag';

export function LiveGallery() {
  return (
    <section id="gallery-and-live" className="container-page scroll-mt-24 py-16">
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-6">
          <div className="pill self-start">
            <span className="pill-dot" aria-hidden="true" />
            <span className="eyebrow">{LIVE.eyebrow}</span>
          </div>
          <h2 className="heading-lg">{LIVE.title}</h2>
          <p className="lead">{LIVE.text}</p>
          <ul className="card flex flex-col gap-3 p-5">
            {LIVE.points.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-pearl">
                <Icon name={p.icon} className="h-5 w-5 text-gold" />
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="card p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.hero} alt={IMAGES.heroAlt} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-wine-950/90 to-transparent p-4">
                <div>
                  <span className="heading-sm block">{LIVE.caption.title}</span>
                  <span className="text-[0.8125rem] text-gold-soft">{LIVE.caption.meta}</span>
                </div>
                <SampleTag />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
