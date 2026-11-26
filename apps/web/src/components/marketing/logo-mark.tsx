/** Diya flame mark, drawn in the gold of the theme. */
export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      className={`${className} shrink-0 text-gold`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-5-5-11-5-11z" fill="rgb(232 185 130 / 0.15)" />
      <path d="M12 9c0 0-2 2.5-2 4.5a2 2 0 0 0 4 0c0-2-2-4.5-2-4.5z" fill="currentColor" />
      <path d="M5 21h14" />
    </svg>
  );
}
