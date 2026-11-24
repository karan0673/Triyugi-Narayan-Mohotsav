'use client';

import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';

/** Wraps the whole app: data fetching cache and toast messages. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-center" />
    </QueryProvider>
  );
}
