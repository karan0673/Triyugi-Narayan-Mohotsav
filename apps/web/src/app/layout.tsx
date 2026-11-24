import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Triyugi Narayan Mohotsav',
  description: 'A private place to plan events, invite guests, track expenses, and share the celebration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
