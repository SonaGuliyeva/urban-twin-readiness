export function SectionHeading({
  eyebrow,
  title,
  inline = false,
}: {
  eyebrow: string;
  title: string;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "" : "flex items-end justify-between gap-6"}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">{title}</h2>
      </div>
      {!inline && <div className="hidden h-px flex-1 bg-border sm:block" />}
    </div>
  );
}
