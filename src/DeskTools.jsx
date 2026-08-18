import { useCallback, useEffect, useRef, useState } from "react";

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
  } catch {
    /* Audio is optional. */
  }
}

function formatRemaining(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function durationForMode(mode) {
  return mode === "pomodoro" ? 25 * 60 : 5 * 60;
}

function remainingSeconds(countdown) {
  if (countdown.paused) return countdown.remainingSeconds;
  return Math.max(0, Math.ceil((countdown.endsAt - Date.now()) / 1000));
}

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function occursOn(alarm, date) {
  if (alarm.repeat === "once") return alarm.date === dateKey(date);
  if (alarm.repeat === "weekdays")
    return date.getDay() >= 1 && date.getDay() <= 5;
  return true;
}

export function DeskTools({
  alarms: controlledAlarms,
  countdown: controlledCountdown,
  labels,
  onAlarmsChange,
  onCountdownChange,
}) {
  const [localCountdown, setLocalCountdown] = useState({
    endsAt: null,
    mode: "countdown",
    paused: true,
    remainingSeconds: 5 * 60,
  });
  const countdown = controlledCountdown ?? localCountdown;
  const [tab, setTab] = useState(() => countdown.mode);
  const [now, setNow] = useState(() => Date.now());
  const [alarm, setAlarm] = useState("");
  const [alarmName, setAlarmName] = useState("");
  const [alarmRepeat, setAlarmRepeat] = useState("daily");
  const [alarmDate, setAlarmDate] = useState("");
  const [advanceMinutes, setAdvanceMinutes] = useState(0);
  const [snoozeMinutes, setSnoozeMinutes] = useState(10);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [localAlarms, setLocalAlarms] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(() =>
    typeof Notification === "undefined"
      ? "unsupported"
      : Notification.permission,
  );
  const firedAlarmOccurrences = useRef(new Set());
  const lastAlarmCheck = useRef(null);
  const audioContextRef = useRef(null);
  const tabRefs = useRef({});
  const alarms = controlledAlarms ?? localAlarms;
  const running = !countdown.paused && countdown.endsAt !== null;
  const seconds = countdown.paused
    ? countdown.remainingSeconds
    : Math.max(0, Math.ceil((countdown.endsAt - now) / 1000));
  const tabs = [
    ["countdown", labels.countdown],
    ["pomodoro", labels.pomodoro],
    ["alarm", labels.alarm],
  ];

  const setAlarms = useCallback(
    (nextAlarms) => {
      if (onAlarmsChange) {
        onAlarmsChange(nextAlarms);
        return;
      }
      setLocalAlarms(nextAlarms);
    },
    [onAlarmsChange],
  );

  const setCountdown = useCallback(
    (nextCountdown) => {
      if (onCountdownChange) {
        onCountdownChange(nextCountdown);
        return;
      }
      setLocalCountdown(nextCountdown);
    },
    [onCountdownChange],
  );

  const prepareAudio = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch {
        return;
      }
    }
    if (audioContextRef.current.state === "suspended") {
      const resumeResult = audioContextRef.current.resume?.();
      resumeResult?.catch(() => {});
    }
  };

  const requestNotifications = async () => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      try {
        setNotificationPermission(await Notification.requestPermission());
      } catch {
        setNotificationPermission(Notification.permission);
      }
      return;
    }
    setNotificationPermission(Notification.permission);
  };

  const notify = useCallback(
    (item) => {
      if (
        typeof Notification === "undefined" ||
        Notification.permission !== "granted"
      )
        return;
      try {
        new Notification(labels.pageAlarm, {
          body: item.name || `${labels.alarmTime}: ${item.time}`,
        });
      } catch {
        // Browsers can reject notifications even after granting permission.
      }
    },
    [labels.alarmTime, labels.pageAlarm],
  );

  useEffect(() => {
    if (!running) return undefined;

    const updateCountdown = () => {
      const remaining = remainingSeconds(countdown);
      setNow(Date.now());
      if (remaining === 0) {
        setCountdown({
          ...countdown,
          endsAt: null,
          paused: true,
          remainingSeconds: 0,
        });
        beep(audioContextRef.current);
      }
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [countdown, running, setCountdown]);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const checkedSince = lastAlarmCheck.current ?? now.getTime();

      alarms.forEach((item) => {
        if (
          item.snoozedUntil &&
          item.snoozedUntil > checkedSince &&
          item.snoozedUntil <= now
        ) {
          const occurrenceId = `${item.id}:snooze:${item.snoozedUntil}`;
          if (!firedAlarmOccurrences.current.has(occurrenceId)) {
            firedAlarmOccurrences.current.add(occurrenceId);
            setAlarms(
              alarms.map((alarm) =>
                alarm.id === item.id ? { ...alarm, snoozedUntil: null } : alarm,
              ),
            );
            setActiveAlarm(item);
            beep(audioContextRef.current);
            notify(item);
          }
          return;
        }
        const [hours, minutes] = item.time.split(":").map(Number);
        const day = new Date(Math.max(checkedSince, item.addedAt));
        day.setHours(0, 0, 0, 0);

        while (day <= now) {
          const scheduledAt = new Date(day);
          scheduledAt.setHours(hours, minutes, 0, 0);
          const notifiedAt = new Date(
            scheduledAt.getTime() - (item.advanceMinutes ?? 0) * 60 * 1000,
          );
          const occurrenceId = `${item.id}:${scheduledAt.getTime()}:${item.advanceMinutes ?? 0}`;
          if (
            scheduledAt >= item.addedAt &&
            occursOn(item, scheduledAt) &&
            notifiedAt > checkedSince &&
            notifiedAt <= now &&
            !firedAlarmOccurrences.current.has(occurrenceId)
          ) {
            // Save the occurrence before sounding it so repeated or delayed checks cannot replay it.
            firedAlarmOccurrences.current.add(occurrenceId);
            setActiveAlarm(item);
            beep(audioContextRef.current);
            notify(item);
          }
          day.setDate(day.getDate() + 1);
        }
      });

      lastAlarmCheck.current = now.getTime();
    };

    checkAlarms();
    const timer = window.setInterval(checkAlarms, 1000);
    return () => window.clearInterval(timer);
  }, [alarms, notify, setAlarms]);

  const selectTab = (next) => {
    setTab(next);
    if (next === "alarm" || next === countdown.mode) return;
    setCountdown({
      endsAt: null,
      mode: next,
      paused: true,
      remainingSeconds: durationForMode(next),
    });
  };
  const handleTabKeyDown = (event, id) => {
    const index = tabs.findIndex(([tabId]) => tabId === id);
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    const nextId = tabs[nextIndex][0];
    selectTab(nextId);
    tabRefs.current[nextId]?.focus();
  };
  const toggleCountdown = () => {
    if (running) {
      setCountdown({
        ...countdown,
        endsAt: null,
        paused: true,
        remainingSeconds: remainingSeconds(countdown),
      });
      return;
    }
    prepareAudio();
    setCountdown({
      ...countdown,
      endsAt: Date.now() + seconds * 1000,
      paused: false,
    });
  };
  const addAlarm = (event) => {
    event.preventDefault();
    prepareAudio();
    if (!alarm || (alarmRepeat === "once" && !alarmDate)) return;
    setAlarms(
      [
        ...alarms,
        {
          addedAt: Date.now(),
          advanceMinutes,
          date: alarmRepeat === "once" ? alarmDate : null,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: alarmName.trim().slice(0, 80),
          repeat: alarmRepeat,
          snoozeMinutes,
          snoozedUntil: null,
          time: alarm,
        },
      ].sort((left, right) => left.time.localeCompare(right.time)),
    );
    setAlarmName("");
    setAlarmDate("");
  };

  const snoozeActiveAlarm = () => {
    if (!activeAlarm) return;
    const until = Date.now() + activeAlarm.snoozeMinutes * 60 * 1000;
    setAlarms(
      alarms.map((item) =>
        item.id === activeAlarm.id ? { ...item, snoozedUntil: until } : item,
      ),
    );
    setActiveAlarm(null);
  };

  const notificationStatus =
    notificationPermission === "granted"
      ? labels.notificationEnabled
      : notificationPermission === "denied"
        ? labels.notificationBlocked
        : notificationPermission === "unsupported"
          ? labels.notificationUnavailable
          : labels.notificationOptional;

  return (
    <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div
        className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/20 p-1"
        role="tablist"
        aria-label={labels.tools}
        aria-orientation="horizontal"
      >
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`desk-tool-tab-${id}`}
            aria-controls={`desk-tool-panel-${id}`}
            aria-selected={tab === id}
            tabIndex={tab === id ? 0 : -1}
            className={`min-h-10 rounded-lg px-2 text-xs font-bold transition ${tab === id ? "bg-cyan/15 text-cyan shadow-inner" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}
            onClick={() => selectTab(id)}
            onKeyDown={(event) => handleTabKeyDown(event, id)}
            ref={(element) => {
              tabRefs.current[id] = element;
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        id={`desk-tool-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`desk-tool-tab-${tab}`}
      >
        {tab === "alarm" ? (
          <div className="grid gap-3">
            <form className="grid gap-3" onSubmit={addAlarm}>
              <label className="grid gap-2 text-xs font-semibold text-slate-300">
                {labels.reminderName}
                <input
                  className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-white focus:border-cyan/60"
                  type="text"
                  value={alarmName}
                  placeholder={labels.reminderNamePlaceholder}
                  onChange={(event) => setAlarmName(event.target.value)}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-semibold text-slate-300">
                  {labels.alarmTime}
                  <input
                    className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-white focus:border-cyan/60"
                    type="time"
                    value={alarm}
                    onChange={(event) => setAlarm(event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold text-slate-300">
                  {labels.reminderRepeat}
                  <select
                    className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-white focus:border-cyan/60"
                    value={alarmRepeat}
                    onChange={(event) => setAlarmRepeat(event.target.value)}
                  >
                    {["daily", "weekdays", "once"].map((value) => (
                      <option key={value} value={value}>
                        {labels.reminderRepeatLabels?.[value] ?? value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {alarmRepeat === "once" && (
                <label className="grid gap-2 text-xs font-semibold text-slate-300">
                  {labels.reminderDate}
                  <input
                    className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-white focus:border-cyan/60"
                    type="date"
                    value={alarmDate}
                    onChange={(event) => setAlarmDate(event.target.value)}
                    required
                  />
                </label>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-semibold text-slate-300">
                  {labels.advanceNotice}
                  <select
                    className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-white focus:border-cyan/60"
                    value={advanceMinutes}
                    onChange={(event) =>
                      setAdvanceMinutes(Number(event.target.value))
                    }
                  >
                    {[0, 5, 10, 15, 30, 60].map((minutes) => (
                      <option key={minutes} value={minutes}>
                        {labels.advanceNoticeMinutes?.(minutes) ?? minutes}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-xs font-semibold text-slate-300">
                  {labels.snooze}
                  <select
                    className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-white focus:border-cyan/60"
                    value={snoozeMinutes}
                    onChange={(event) =>
                      setSnoozeMinutes(Number(event.target.value))
                    }
                  >
                    {[5, 10, 15, 30].map((minutes) => (
                      <option key={minutes} value={minutes}>
                        {labels.snoozeMinutes?.(minutes) ?? minutes}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                className="min-h-11 rounded-xl bg-cyan px-4 text-sm font-bold text-night transition hover:brightness-110 disabled:opacity-50"
                type="submit"
              >
                {labels.addAlarm}
              </button>
            </form>
            <p className="rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs leading-relaxed text-warning/85">
              {labels.alarmNotice}
            </p>
            <div className="flex flex-wrap gap-2">
              {alarms.length ? (
                alarms.map((item) => (
                  <button
                    className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-xs text-cyan transition hover:bg-cyan/20"
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setAlarms(alarms.filter((value) => value.id !== item.id))
                    }
                  >
                    {item.name ? `${item.name} · ` : ""}
                    {item.time} ×
                  </button>
                ))
              ) : (
                <small className="text-slate-500">{labels.noAlarms}</small>
              )}
            </div>
            {activeAlarm && (
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan/30 bg-cyan/10 p-3 text-xs text-cyan"
                role="status"
              >
                <span>
                  {labels.reminderDue ?? labels.pageAlarm}:{" "}
                  {activeAlarm.name || activeAlarm.time}
                </span>
                <button
                  className="min-h-9 rounded-lg border border-cyan/40 px-3 font-semibold transition hover:bg-cyan/10"
                  type="button"
                  onClick={snoozeActiveAlarm}
                >
                  {labels.snoozeNow ?? labels.snooze}
                </button>
              </div>
            )}
            <div className="grid gap-2 rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs text-warning/80">
              <span>{labels.alarmNotice}</span>
              <span className="text-slate-500">{notificationStatus}</span>
              {notificationPermission === "default" && (
                <button
                  className="justify-self-start rounded-lg border border-cyan/30 px-3 py-2 font-semibold text-cyan transition hover:bg-cyan/10"
                  type="button"
                  onClick={requestNotifications}
                >
                  {labels.enableNotifications}
                </button>
              )}
            </div>
            <small className="text-xs text-slate-500">{labels.soundHint}</small>
          </div>
        ) : (
          <div className="grid justify-items-center gap-5 py-4">
            <strong className="font-mono text-5xl tracking-tight text-white">
              {formatRemaining(seconds)}
            </strong>
            <div className="flex gap-2">
              <button
                className="min-h-11 rounded-xl bg-cyan px-4 text-sm font-bold text-night transition hover:brightness-110"
                type="button"
                onClick={toggleCountdown}
              >
                {running ? labels.stop : labels.start}
              </button>
              <button
                className="min-h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                type="button"
                onClick={() => {
                  setCountdown({
                    endsAt: null,
                    mode: countdown.mode,
                    paused: true,
                    remainingSeconds: durationForMode(countdown.mode),
                  });
                }}
              >
                {labels.reset}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
