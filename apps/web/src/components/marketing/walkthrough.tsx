'use client';

import { useRef, useState } from 'react';
import { IMAGES, WALKTHROUGH } from '@/content/landing';
import { Icon } from './icons';
import { SampleTag } from './sample-tag';

type TabId = (typeof WALKTHROUGH.tabs)[number]['id'];

function SchedulePanel() {
  const s = WALKTHROUGH.schedule;
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
        <span className="text-[1.0625rem] font-medium text-pearl">{s.title}</span>
        <SampleTag>{s.badge}</SampleTag>
      </div>
      <ol className="flex flex-col">
        {s.items.map((item) => (
          <li key={item.time} className="flex items-start gap-4 border-b border-line py-3 last:border-b-0">
            <span className="w-20 shrink-0 text-xs font-medium tracking-wide text-gold">{item.time}</span>
            <div>
              <span className="block text-sm font-medium text-pearl">{item.name}</span>
              <span className="text-[0.8125rem] text-pearl-muted">{item.meta}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RsvpPanel() {
  const r = WALKTHROUGH.rsvp;
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
        <span className="text-[1.0625rem] font-medium text-pearl">{r.title}</span>
        <SampleTag>{r.badge}</SampleTag>
      </div>
      <div className="card-inset flex items-center justify-between gap-3 p-4">
        <div>
          <span className="block text-sm font-medium text-pearl">{r.family}</span>
          <span className="text-[0.8125rem] text-pearl-muted">{r.meta}</span>
        </div>
        <span className="rounded-md border border-line px-2 py-1 text-[0.6875rem] font-semibold text-gold-soft">{r.whatsapp}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-[0.8125rem]">
        <div className="card-inset p-3">
          <span className="block text-[0.6875rem] uppercase tracking-wider text-pearl-muted">Invited to</span>
          <span className="font-medium text-pearl">{r.events.join(', ')}</span>
        </div>
        <div className="card-inset p-3">
          <span className="block text-[0.6875rem] uppercase tracking-wider text-pearl-muted">Food</span>
          <span className="font-medium text-pearl">{r.food}</span>
        </div>
      </div>
    </div>
  );
}

function LivePanel() {
  const l = WALKTHROUGH.live;
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMAGES.hero} alt="" className="h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-linear-to-t from-wine-950/90 via-wine-950/30 to-transparent" />
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-wine-900/90 px-2.5 py-1">
        <span className="h-2 w-2 animate-ping rounded-full bg-gold" aria-hidden="true" />
        <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-gold-pale">{l.badge}</span>
      </div>
      <div className="absolute inset-x-3 bottom-3">
        <span className="block text-lg font-medium text-pearl">{l.title}</span>
        <span className="text-[0.75rem] text-gold-soft">{l.meta}</span>
      </div>
      <div className="absolute right-3 top-3"><SampleTag /></div>
    </div>
  );
}

export function Walkthrough() {
  const { tabs } = WALKTHROUGH;
  const [active, setActive] = useState<TabId>('plan');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(e: React.KeyboardEvent) {
    const index = tabs.findIndex((t) => t.id === active);
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else return;
    e.preventDefault();
    const id = tabs[next].id;
    setActive(id);
    refs.current[id]?.focus();
  }

  return (
    <section className="container-page py-12" aria-labelledby="walkthrough-title">
      <div className="card p-5 md:p-10">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">{WALKTHROUGH.eyebrow}</span>
            <h2 id="walkthrough-title" className="heading-lg mt-2">{WALKTHROUGH.title}</h2>
          </div>
          <div
            role="tablist"
            aria-label="Walkthrough chapters"
            onKeyDown={onKeyDown}
            className="flex items-center self-start rounded-xl border border-line bg-wine-950/40 p-1 md:self-auto"
          >
            {tabs.map((t) => {
              const selected = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => { refs.current[t.id] = el; }}
                  role="tab"
                  type="button"
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  className={`min-h-11 rounded-lg px-5 text-sm transition-all ${
                    selected
                      ? 'bg-linear-to-br from-gold to-gold-deep font-semibold text-wine-900'
                      : 'text-pearl-muted hover:bg-white/10 hover:text-gold-pale'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {tabs.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            hidden={t.id !== active}
            className="grid items-center gap-8 pt-8 lg:grid-cols-12"
          >
            <div className="flex flex-col gap-3 lg:col-span-5">
              <div className="eyebrow">{t.phase} • {t.kicker}</div>
              <h3 className="heading-md">{t.title}</h3>
              <p className="lead">{t.text}</p>
              <ul className="mt-1 flex flex-col gap-2">
                {t.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-pearl">
                    <Icon name="check" className="h-[18px] w-[18px] text-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-inset p-4 lg:col-span-7">
              {t.id === 'plan' ? <SchedulePanel /> : t.id === 'invite' ? <RsvpPanel /> : <LivePanel />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
