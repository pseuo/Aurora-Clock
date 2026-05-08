export function WorldClocks({ clocks, label }) {
  return (
    <div className="world-clock-row" aria-label={label}>
      {clocks.map((clock) => (
        <article className="world-card" key={clock.city}>
          <strong>{clock.city}</strong>
          <time>{clock.time}</time>
          <span>{clock.timeZone}</span>
        </article>
      ))}
    </div>
  );
}
