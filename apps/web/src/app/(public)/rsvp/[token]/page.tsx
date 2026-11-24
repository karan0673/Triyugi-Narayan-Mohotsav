import { Placeholder } from '@/components/layout/placeholder';

// Public page opened with a guest or share link token. No login.
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <Placeholder title="rsvp" note={`Link token: ${token}`} />;
}
