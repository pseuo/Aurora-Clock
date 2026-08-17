import { useEffect, useMemo, useRef, useState } from 'react';
import { worldClocks } from './clockConfig.js';
import { formatWorldTime } from './clockTime.js';
import { overlapFor } from './meetingOverlap.js';

export function MeetingPlanner({ language, labels, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const locale = language === 'zh' ? 'zh-CN' : 'en-US';
  const [firstId, setFirstId] = useState('beijing');
  const [secondId, setSecondId] = useState('new-york');
  const [dateTime, setDateTime] = useState(() => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
  const first = worldClocks.find((city) => city.id === firstId) ?? worldClocks[0];
  const second = worldClocks.find((city) => city.id === secondId) ?? worldClocks[1];
  const date = useMemo(() => {
    if (!dateTime) return null;
    const selectedDate = new Date(dateTime);
    return Number.isNaN(selectedDate.getTime()) ? null : selectedDate;
  }, [dateTime]);
  const overlap = useMemo(() => (date ? overlapFor(date, first, second, locale) : '—'), [date, first, second, locale]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])];
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

    window.addEventListener('keydown', handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-night/75 p-4 backdrop-blur-md" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="meeting-planner-title">
      <div className="grid w-full max-w-2xl gap-6 rounded-3xl border border-white/12 bg-panel/98 p-4 shadow-2xl shadow-black/50 sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan" id="meeting-planner-title">{labels.meetingPlanner}</span><p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">{labels.meetingDescription}</p></div><button className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white" ref={closeButtonRef} type="button" onClick={onClose} aria-label={labels.closeMeetingPlanner}>×</button></div>
       <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-2 text-xs font-semibold text-slate-300">{first.city[language]}<select className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white" value={firstId} onChange={(event) => setFirstId(event.target.value)}>{worldClocks.map((city) => <option key={city.id} value={city.id}>{city.city[language]} · {city.timeZone}</option>)}</select></label>
        <label className="grid gap-2 text-xs font-semibold text-slate-300">{second.city[language]}<select className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white" value={secondId} onChange={(event) => setSecondId(event.target.value)}>{worldClocks.map((city) => <option key={city.id} value={city.id}>{city.city[language]} · {city.timeZone}</option>)}</select></label>
        <label className="grid gap-2 text-xs font-semibold text-slate-300">日期 / 时间<input className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white" type="datetime-local" value={dateTime} onChange={(event) => setDateTime(event.target.value)} /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <article className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-4"><strong className="text-sm text-slate-300">{first.city[language]}</strong><time className="font-mono text-3xl font-semibold text-white">{date ? formatWorldTime(date, first.timeZone, true, locale) : '—'}</time><span className="text-xs text-slate-500">{first.timeZone}</span></article>
        <article className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-4"><strong className="text-sm text-slate-300">{second.city[language]}</strong><time className="font-mono text-3xl font-semibold text-white">{date ? formatWorldTime(date, second.timeZone, true, locale) : '—'}</time><span className="text-xs text-slate-500">{second.timeZone}</span></article>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-lime/25 bg-lime/5 p-4"><span className="rounded-full bg-lime/10 px-3 py-1 font-mono text-xs text-lime">09:00–18:00</span><strong className="text-sm text-white">{overlap}</strong></div>
      </div>
    </div>
  );
}
