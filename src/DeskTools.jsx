import { useEffect, useRef, useState } from 'react';

function beep(context) {
  if (!context) return;
  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 660;
    gain.gain.value = 0.08;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.32);
  } catch { /* Audio is optional. */ }
}

function formatRemaining(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function DeskTools({ labels }) {
  const [tab, setTab] = useState('countdown');
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);
  const [alarm, setAlarm] = useState('');
  const [alarms, setAlarms] = useState([]);
  const countdownEndsAt = useRef(null);
  const firedAlarmOccurrences = useRef(new Set());
  const lastAlarmCheck = useRef(null);
  const nextAlarmId = useRef(0);
  const audioContextRef = useRef(null);

  const prepareAudio = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch {
        return;
      }
    }
    if (audioContextRef.current.state === 'suspended') {
      const resumeResult = audioContextRef.current.resume?.();
      resumeResult?.catch(() => {});
    }
  };

  useEffect(() => {
    if (!running) return undefined;

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((countdownEndsAt.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) {
        countdownEndsAt.current = null;
        setRunning(false);
        beep(audioContextRef.current);
      }
    };

    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const checkedSince = lastAlarmCheck.current ?? now.getTime();

      alarms.forEach((item) => {
        const [hours, minutes] = item.time.split(':').map(Number);
        const day = new Date(Math.max(checkedSince, item.addedAt));
        day.setHours(0, 0, 0, 0);

        while (day <= now) {
          const scheduledAt = new Date(day);
          scheduledAt.setHours(hours, minutes, 0, 0);
          const occurrenceId = `${item.id}:${scheduledAt.getTime()}`;
          if (scheduledAt >= item.addedAt && scheduledAt > checkedSince && scheduledAt <= now && !firedAlarmOccurrences.current.has(occurrenceId)) {
            // Save the occurrence before sounding it so repeated or delayed checks cannot replay it.
            firedAlarmOccurrences.current.add(occurrenceId);
            beep(audioContextRef.current);
          }
          day.setDate(day.getDate() + 1);
        }
      });

      lastAlarmCheck.current = now.getTime();
    };

    checkAlarms();
    const timer = window.setInterval(checkAlarms, 1000);
    return () => window.clearInterval(timer);
  }, [alarms]);

  const selectTab = (next) => { countdownEndsAt.current = null; setTab(next); setSeconds(next === 'pomodoro' ? 25 * 60 : 5 * 60); setRunning(false); };
  const toggleCountdown = () => {
    if (running) {
      setSeconds(Math.max(0, Math.ceil((countdownEndsAt.current - Date.now()) / 1000)));
      countdownEndsAt.current = null;
      setRunning(false);
      return;
    }
    prepareAudio();
    countdownEndsAt.current = Date.now() + seconds * 1000;
    setRunning(true);
  };
  return (
    <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/20 p-1" role="tablist">
        {[['countdown', labels.countdown], ['pomodoro', labels.pomodoro], ['alarm', labels.alarm]].map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={`min-h-10 rounded-lg px-2 text-xs font-bold transition ${tab === id ? 'bg-cyan/15 text-cyan shadow-inner' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`} onClick={() => selectTab(id)}>{label}</button>)}
      </div>
      {tab === 'alarm' ? <div className="grid gap-3"><label className="grid gap-2 text-xs font-semibold text-slate-300">{labels.alarmTime}<input className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-white focus:border-cyan/60" type="time" value={alarm} onChange={(event) => setAlarm(event.target.value)} /></label><button className="min-h-11 rounded-xl bg-cyan px-4 text-sm font-bold text-night transition hover:brightness-110 disabled:opacity-50" type="button" onClick={() => { prepareAudio(); if (alarm && !alarms.some((item) => item.time === alarm)) setAlarms([...alarms, { addedAt: Date.now(), id: nextAlarmId.current += 1, time: alarm }].sort((left, right) => left.time.localeCompare(right.time))); }}>{labels.addAlarm}</button><div className="flex flex-wrap gap-2">{alarms.length ? alarms.map((item) => <button className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-xs text-cyan transition hover:bg-cyan/20" type="button" key={item.id} onClick={() => setAlarms(alarms.filter((value) => value.id !== item.id))}>{item.time} ×</button>) : <small className="text-slate-500">{labels.noAlarms}</small>}</div><small className="text-xs text-slate-500">{labels.soundHint}</small></div> : <div className="grid justify-items-center gap-5 py-4"><strong className="font-mono text-5xl tracking-tight text-white">{formatRemaining(seconds)}</strong><div className="flex gap-2"><button className="min-h-11 rounded-xl bg-cyan px-4 text-sm font-bold text-night transition hover:brightness-110" type="button" onClick={toggleCountdown}>{running ? labels.stop : labels.start}</button><button className="min-h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10" type="button" onClick={() => { countdownEndsAt.current = null; setRunning(false); setSeconds(tab === 'pomodoro' ? 25 * 60 : 5 * 60); }}>{labels.reset}</button></div></div>}
    </div>
  );
}
