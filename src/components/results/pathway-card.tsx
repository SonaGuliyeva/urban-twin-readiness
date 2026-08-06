export function PathwayCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "accent" | "muted" | "primary";
}) {
  const toneClasses =
    tone === "accent"
      ? "border-accent/30 bg-accent/5"
      : tone === "primary"
        ? "border-primary/30 bg-primary/5"
        : "border-border bg-surface";
  const dotClass =
    tone === "accent" ? "bg-accent" : tone === "primary" ? "bg-primary" : "bg-muted-foreground";
  return (
    <div className={`rounded-lg border p-6 shadow-card ${toneClasses}`}>
      <h3 className="font-serif text-lg text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
