import { useEffect, useMemo, useRef, useState } from "react";
import { worldClocks } from "./clockConfig.js";
import { formatWorldTime } from "./clockTime.js";
import { defaultWorkSchedule, overlapSlotsFor } from "./meetingOverlap.js";

const durationOptions = [15, 30, 45, 60, 90, 120];

function formatIcsDate(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function exportMeetingIcs(title, slot) {
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aurora Clock//Meeting Planner//EN",
    "BEGIN:VEVENT",
    `UID:${slot.start.getTime()}@aurora-clock`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(slot.start)}`,
    `DTEND:${formatIcsDate(slot.end)}`,
    `SUMMARY:${title.replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/calendar" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "meeting.ics";
  link.click();
  URL.revokeObjectURL(url);
}

function WorkScheduleFields({ city, language, labels, schedule, onChange }) {
  const update = (change) => onChange({ ...schedule, ...change });
  const toggleWorkday = (day) =>
    update({
      workdays: schedule.workdays.includes(day)
        ? schedule.workdays.filter((value) => value !== day)
        : [...schedule.workdays, day].sort(),
    });

  return (
    <fieldset className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <legend className="px-1 text-sm font-semibold text-slate-300">
        {labels.workSchedule}: {city.city[language]}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1 text-xs text-slate-400">
          {labels.workdayStart}
          <input
            className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"
            type="time"
            value={schedule.start}
            onChange={(event) => update({ start: event.target.value })}
          />
        </label>
        <label className="grid gap-1 text-xs text-slate-400">
          {labels.workdayEnd}
          <input
            className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"
            type="time"
            value={schedule.end}
            onChange={(event) => update({ end: event.target.value })}
          />
        </label>
      </div>
      <div
        className="flex flex-wrap gap-1"
        role="group"
        aria-label={`${labels.workdays}: ${city.city[language]}`}
      >
        {labels.weekdayLabels.map((label, day) => (
          <button
            className={`min-h-10 rounded-lg px-2 text-xs font-semibold transition ${schedule.workdays.includes(day) ? "bg-cyan/15 text-cyan" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}
            type="button"
            key={label}
            aria-pressed={schedule.workdays.includes(day)}
            onClick={() => toggleWorkday(day)}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function MeetingPlanner({
  language,
  locale: selectedLocale,
  labels,
  onClose,
  onPlannerChange,
  plannerPreferences,
}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const locale = selectedLocale ?? (language === "zh" ? "zh-CN" : "en-US");
  const [firstId, setFirstId] = useState(
    plannerPreferences?.firstId ?? "beijing",
  );
  const [secondId, setSecondId] = useState(
    plannerPreferences?.secondId ?? "new-york",
  );
  const [dateTime, setDateTime] = useState(() =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [firstSchedule, setFirstSchedule] = useState(
    plannerPreferences?.firstSchedule ?? defaultWorkSchedule,
  );
  const [secondSchedule, setSecondSchedule] = useState(
    plannerPreferences?.secondSchedule ?? defaultWorkSchedule,
  );
  const [duration, setDuration] = useState(plannerPreferences?.duration ?? 30);
  const [title, setTitle] = useState("");
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);
  const first =
    worldClocks.find((city) => city.id === firstId) ?? worldClocks[0];
  const second =
    worldClocks.find((city) => city.id === secondId) ?? worldClocks[1];
  const date = useMemo(() => {
    if (!dateTime) return null;
    const selectedDate = new Date(dateTime);
    return Number.isNaN(selectedDate.getTime()) ? null : selectedDate;
  }, [dateTime]);
  const slots = useMemo(
    () =>
      date
        ? overlapSlotsFor(
            date,
            first,
            second,
            locale,
            firstSchedule,
            secondSchedule,
            duration,
          )
        : [],
    [date, duration, first, firstSchedule, locale, second, secondSchedule],
  );
  const selectedSlot =
    slots.find((slot) => slot.start.getTime() === selectedSlotTime) ?? slots[0];

  useEffect(() => {
    onPlannerChange?.({
      duration,
      firstId,
      firstSchedule,
      secondId,
      secondSchedule,
    });
  }, [
    duration,
    firstId,
    firstSchedule,
    onPlannerChange,
    secondId,
    secondSchedule,
  ]);

  const formatSlot = (slot) =>
    `${formatWorldTime(slot.start, first.timeZone, true, locale)} – ${formatWorldTime(slot.end, first.timeZone, true, locale)}`;
  const copySelectedSlot = async () => {
    if (!selectedSlot) return;
    const meetingTitle = title.trim() || labels.meetingPlanner;
    const text = `${meetingTitle}\n${first.city[language]}: ${formatSlot(selectedSlot)}\n${second.city[language]}: ${formatWorldTime(selectedSlot.start, second.timeZone, true, locale)} – ${formatWorldTime(selectedSlot.end, second.timeZone, true, locale)}`;
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Copy is a convenience feature and may be denied outside a secure context.
    }
  };

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...(dialogRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? []),
      ];
      const firstFocusable = focusable[0];
      const lastFocusable = focusable.at(-1);
      if (!firstFocusable || !lastFocusable) return;
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
    );
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-night/75 p-4 backdrop-blur-md"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="meeting-planner-title"
    >
      <div className="grid w-full max-w-2xl gap-6 rounded-3xl border border-white/12 bg-panel/98 p-4 shadow-2xl shadow-black/50 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-[0.18em] text-cyan"
              id="meeting-planner-title"
            >
              {labels.meetingPlanner}
            </span>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
              {labels.meetingDescription}
            </p>
          </div>
          <button
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={labels.closeMeetingPlanner}
          >
            ×
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-2 text-xs font-semibold text-slate-300">
            {first.city[language]}
            <select
              className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"
              value={firstId}
              onChange={(event) => setFirstId(event.target.value)}
            >
              {worldClocks.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.city[language]} · {city.timeZone}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold text-slate-300">
            {second.city[language]}
            <select
              className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"
              value={secondId}
              onChange={(event) => setSecondId(event.target.value)}
            >
              {worldClocks.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.city[language]} · {city.timeZone}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold text-slate-300">
            {labels.meetingDateTime}
            <input
              className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"
              type="datetime-local"
              value={dateTime}
              onChange={(event) => setDateTime(event.target.value)}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <strong className="text-sm text-slate-300">
              {first.city[language]}
            </strong>
            <time className="font-mono text-3xl font-semibold text-white">
              {date ? formatWorldTime(date, first.timeZone, true, locale) : "—"}
            </time>
            <span className="text-xs text-slate-500">{first.timeZone}</span>
          </article>
          <article className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <strong className="text-sm text-slate-300">
              {second.city[language]}
            </strong>
            <time className="font-mono text-3xl font-semibold text-white">
              {date
                ? formatWorldTime(date, second.timeZone, true, locale)
                : "—"}
            </time>
            <span className="text-xs text-slate-500">{second.timeZone}</span>
          </article>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <WorkScheduleFields
            city={first}
            language={language}
            labels={labels}
            schedule={firstSchedule}
            onChange={setFirstSchedule}
          />
          <WorkScheduleFields
            city={second}
            language={language}
            labels={labels}
            schedule={secondSchedule}
            onChange={setSecondSchedule}
          />
        </div>
        <label className="grid gap-2 text-xs font-semibold text-slate-300">
          {labels.meetingDuration}
          <select
            className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {labels.durationMinutes(option)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold text-slate-300">
          {labels.meetingTitle}
          <input
            className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={labels.meetingTitlePlaceholder}
          />
        </label>
        <div className="grid gap-3 rounded-2xl border border-lime/25 bg-lime/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-lime/10 px-3 py-1 font-mono text-xs text-lime">
              {labels.durationMinutes(duration)}
            </span>
            <strong className="text-sm text-white">
              {selectedSlot
                ? formatSlot(selectedSlot)
                : date
                  ? labels.noWorkingHourOverlap
                  : "—"}
            </strong>
          </div>
          {!!slots.length && (
            <div
              className="grid gap-2 sm:grid-cols-3"
              role="group"
              aria-label={labels.meetingOptions}
            >
              {slots.map((slot) => {
                const isSelected =
                  selectedSlot?.start.getTime() === slot.start.getTime();
                return (
                  <button
                    className={`min-h-11 rounded-xl border px-3 text-xs font-semibold transition ${isSelected ? "border-lime/50 bg-lime/15 text-lime" : "border-white/10 bg-black/15 text-slate-300 hover:bg-white/10"}`}
                    key={slot.start.getTime()}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedSlotTime(slot.start.getTime())}
                  >
                    {formatSlot(slot)}
                  </button>
                );
              })}
            </div>
          )}
          {!!selectedSlot && (
            <div className="flex flex-wrap gap-2">
              <button
                className="min-h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white transition hover:bg-white/10"
                type="button"
                onClick={copySelectedSlot}
              >
                {labels.copyMeeting}
              </button>
              <button
                className="min-h-11 rounded-xl bg-lime px-3 text-xs font-bold text-night transition hover:brightness-110"
                type="button"
                onClick={() =>
                  exportMeetingIcs(
                    title.trim() || labels.meetingPlanner,
                    selectedSlot,
                  )
                }
              >
                {labels.exportMeetingIcs}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
