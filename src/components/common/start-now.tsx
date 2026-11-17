/**
 * The strategy behind the tool (thesis Chapter 1): use the open satellite archive now,
 * expect better spatial detail later, and gain the frequent observation that repeated
 * airborne surveys cannot give.
 */
const POINTS = [
  {
    t: "Start with the archive you can use today",
    d: "Open satellite archives are long, consistent and free to use. Put them into your digital twin now and build the habit of regular, city-wide observation.",
  },
  {
    t: "The detail will get better",
    d: "Spatial detail keeps improving, for example with new thermal missions such as Copernicus LSTM and TRISHNA (about 60 m). A twin built on satellite data today can take in better data later.",
  },
  {
    t: "Satellites give you frequency",
    d: "Airborne surveys show the finest detail but are costly and done only every few years. Satellites look again and again, so you can see how conditions change.",
  },
];

export function StartNow({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <h2 className="font-serif text-2xl text-foreground sm:text-3xl">Start now, improve later</h2>
      <ol className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-3">
        {POINTS.map((p) => (
          <li key={p.t} className="border-t-2 border-primary pt-4">
            <h3 className="font-serif text-xl text-foreground">{p.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
