export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "essential" | "eo";
}) {
  const accentClass =
    accent === "essential" ? "text-essential" : accent === "eo" ? "text-eo" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className={`font-serif text-3xl ${accentClass}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
