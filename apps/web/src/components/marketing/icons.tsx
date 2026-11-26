import {
  Archive, BellRing, CalendarDays, Check, History, Images, KeyRound, Languages, LayoutDashboard,
  Link2, ListChecks, Lock, MapPin, Send, ShieldCheck, UserCheck, Users, Video, Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { IconKey } from '@/content/landing';

const MAP: Record<IconKey, LucideIcon> = {
  calendar: CalendarDays,
  dashboard: LayoutDashboard,
  tasks: ListChecks,
  wallet: Wallet,
  users: Users,
  send: Send,
  bell: BellRing,
  video: Video,
  images: Images,
  shield: ShieldCheck,
  key: KeyRound,
  link: Link2,
  history: History,
  archive: Archive,
  languages: Languages,
  lock: Lock,
  check: Check,
  mapPin: MapPin,
  userCheck: UserCheck,
};

export function Icon({ name, className = 'h-5 w-5' }: { name: IconKey; className?: string }) {
  const Component = MAP[name];
  return <Component className={className} aria-hidden="true" strokeWidth={1.6} />;
}
