import Link from 'next/link';
import { FOOTER_LINKS, SITE } from '@/content/landing';
import { LogoMark } from './logo-mark';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-14" style={{ background: '#120407' }}>
      <div className="container-page flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <LogoMark />
              <span className="font-serif text-2xl text-pearl">{SITE.name}</span>
            </div>
            <p className="max-w-md text-sm text-pearl-muted">{SITE.tagline}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((l) =>
              l.href.startsWith('#') ? (
                <a key={l.label} href={l.href} className="text-sm text-pearl-muted transition-colors hover:text-gold">{l.label}</a>
              ) : (
                <Link key={l.label} href={l.href} className="text-sm text-pearl-muted transition-colors hover:text-gold">{l.label}</Link>
              ),
            )}
          </nav>
        </div>
        <div className="h-px w-full bg-line" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-pearl-muted sm:flex-row">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center text-xs uppercase tracking-wider" role="group" aria-label="Language">
            <span className="font-semibold text-gold" aria-current="true">EN</span>
            <span className="mx-2 text-line-strong" aria-hidden="true">|</span>
            <span title="Hindi is coming in a later release" className="cursor-not-allowed opacity-70">हिं</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
