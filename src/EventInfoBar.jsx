import { CalendarClock } from "lucide-react";

export function EventInfoBar({ event, labels, language, locale, now }) {
  if (!event)
    return (
      <div className="flex items-center justify-center gap-2 py-1 text-xs text-subtle/75">
        <CalendarClock size={15} aria-hidden="true" />{" "}
        <span>{labels.noEvent}</span>
      </div>
    );
  const remaining = Math.max(0, event.start - now);
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-cyan/20 bg-cyan/5 px-3 py-2 text-sm text-slate-300">
      <CalendarClock size={16} className="text-cyan" />
      <strong className="text-white">{event.title}</strong>
      <span>
        {labels.eventIn} {hours}h {minutes}m
      </span>
      <time className="text-xs text-slate-400">
        {new Intl.DateTimeFormat(
          locale ?? (language === "zh" ? "zh-CN" : "en-US"),
          {
            dateStyle: "short",
            timeStyle: "short",
          },
        ).format(event.start)}
      </time>
      <span className="text-xs text-slate-500">{timeZone}</span>
    </div>
  );
}
