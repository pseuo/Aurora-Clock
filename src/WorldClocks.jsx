export function WorldClocks({ clocks, dayLabels, label }) {
  return (
    <section
      className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      aria-label={label}
    >
      {clocks.map((clock) => (
        <article
          className="grid min-h-28 gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_18px_48px_rgb(0_0_0_/_0.2)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan/40"
          key={clock.timeZone}
        >
          <strong className="text-sm font-semibold tracking-wide text-white/90">
            {clock.city}
          </strong>
          <time
            className="font-mono text-2xl font-semibold tracking-tight text-white"
            dateTime={clock.dateTime}
          >
            {clock.time}
          </time>
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-300">
            {clock.date}
            {clock.dayOffset !== 0 && (
              <em className="rounded-full bg-warning/15 px-2 py-0.5 text-[0.65rem] not-italic font-bold text-warning">
                {dayLabels[clock.dayOffset > 0 ? "tomorrow" : "yesterday"]}
              </em>
            )}
          </span>
          <span className="break-words text-xs font-medium text-dim">
            {clock.timeZone}
          </span>
        </article>
      ))}
    </section>
  );
}
