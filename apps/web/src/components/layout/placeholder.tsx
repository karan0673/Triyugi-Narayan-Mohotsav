/** Temporary page body. Replace with the real screen (designed in Stitch) when building each feature. */
export function Placeholder({ title, note }: { title: string; note?: string }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-primary">{title}</h1>
      <p className="mt-3 text-muted">{note ?? 'This screen is not built yet.'}</p>
    </main>
  );
}
