import Link from 'next/link';
import { CTA } from '@/content/landing';

export function Cta() {
  return (
    <section className="container-page py-16">
      <div className="card flex flex-col items-center gap-4 p-8 text-center md:p-14">
        <div className="pill">
          <span className="pill-dot" aria-hidden="true" />
          <span className="eyebrow">{CTA.eyebrow}</span>
        </div>
        <h2 className="heading-xl max-w-2xl">{CTA.title}</h2>
        <p className="lead max-w-xl">{CTA.text}</p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Link href="/login" className="btn btn-gold">Log in</Link>
          <a href="#features" className="btn btn-outline">Explore features</a>
        </div>
        <span className="pt-1 text-xs text-pearl-muted">{CTA.note}</span>
      </div>
    </section>
  );
}
