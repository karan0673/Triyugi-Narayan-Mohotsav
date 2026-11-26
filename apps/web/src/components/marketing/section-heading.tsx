export function SectionHeading({
  eyebrow, title, text, center = false,
}: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`mb-8 flex max-w-2xl flex-col gap-2 ${center ? 'mx-auto text-center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="heading-lg">{title}</h2>
      {text ? <p className="lead">{text}</p> : null}
    </div>
  );
}
