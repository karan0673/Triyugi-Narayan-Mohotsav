/** Marks demo content so nobody mistakes it for real data. */
export function SampleTag({ children = 'Sample' }: { children?: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-wine-900/70 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-gold">
      {children}
    </span>
  );
}
