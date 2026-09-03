export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-black text-[var(--color-text)] sm:text-4xl">
        {title}
        <span className="text-[var(--color-accent)]">.</span>
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm text-[var(--color-muted)] sm:text-base ${
            center ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
