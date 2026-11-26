'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/content/landing';
import { LogoMark } from './logo-mark';

function LangSwitch({ className = '' }: { className?: string }) {
  return (
    <div className={`items-center text-xs uppercase tracking-wider text-pearl-muted ${className}`} role="group" aria-label="Language">
      <span className="font-semibold text-gold" aria-current="true">EN</span>
      <span className="mx-2 text-line-strong" aria-hidden="true">|</span>
      <span title="Hindi is coming in a later release" className="cursor-not-allowed opacity-70">हिं</span>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  // Highlight the link of the section currently in view.
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-wine-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
          <LogoMark />
          <span className="font-serif text-lg text-pearl sm:text-[1.35rem]">
            <span className="sm:hidden">{SITE.shortName}</span>
            <span className="hidden sm:inline">{SITE.name}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`border-b pb-1 text-sm transition-colors hover:text-gold ${
                  isActive ? 'border-gold text-pearl' : 'border-transparent text-pearl-muted'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <LangSwitch className="hidden sm:flex" />
          <Link href="/login" className="btn btn-gold btn-sm">Log in</Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-pearl lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-line bg-wine-900 lg:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line text-base text-pearl-muted hover:text-gold"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center justify-between py-4">
              <LangSwitch className="flex" />
              <Link href="/login" className="btn btn-gold">Log in</Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
