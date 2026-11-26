import { Cta } from '@/components/marketing/cta';
import { Faq } from '@/components/marketing/faq';
import { Features } from '@/components/marketing/features';
import { Hero } from '@/components/marketing/hero';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { LiveGallery } from '@/components/marketing/live-gallery';
import { Roles } from '@/components/marketing/roles';
import { Security } from '@/components/marketing/security';
import { TrustStrip } from '@/components/marketing/trust-strip';
import { Walkthrough } from '@/components/marketing/walkthrough';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Features />
      <Walkthrough />
      <HowItWorks />
      <Roles />
      <LiveGallery />
      <Security />
      <Faq />
      <Cta />
    </main>
  );
}
