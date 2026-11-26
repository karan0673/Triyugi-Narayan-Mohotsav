import { Footer } from '@/components/marketing/footer';
import { Navbar } from '@/components/marketing/navbar';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <div id="main" className="pt-20">{children}</div>
      <Footer />
    </>
  );
}
