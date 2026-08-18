import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Globe2, Keyboard, X } from "lucide-react";
import BorderGlow from "./BorderGlow.jsx";
import { getBurnInShiftOffset } from "./burnInShift.js";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { EventInfoBar } from "./EventInfoBar.jsx";
import { IcsImportError, parseIcsEvents } from "./calendarIcs.js";
import { MeetingPlanner } from "./MeetingPlanner.jsx";
import SpotlightCard from "./SpotlightCard.jsx";
import { SettingsPanel } from "./SettingsPanel.jsx";
import { Toast } from "./Toast.jsx";
import { WeatherStatus } from "./WeatherStatus.jsx";
import { WorldClocks } from "./WorldClocks.jsx";
import {
  copy,
  getDayPhase,
  getLocale,
  getNextLanguage,
  getNextThemeMode,
  getWorldClock,
  intensityConfig,
  themeVisuals,
  toggleFullscreen,
} from "./clockConfig.js";
import {
  formatDateLabel,
  formatWorldDate,
  formatWorldTime,
  getClockParts,
  getWorldDayOffset,
} from "./clockTime.js";
import { useAppLifecycle } from "./hooks/useAppLifecycle.js";
import { useFullscreenAutoHide } from "./hooks/useFullscreenAutoHide.js";
import {
  defaultPreferences,
  normalizePreferences,
  usePreferences,
} from "./hooks/usePreferences.js";
import { useWeather } from "./hooks/useWeather.js";
import Aurora from "./reactbits/Aurora.jsx";

function getVisualCapabilities() {
  const compactScreen = window.matchMedia("(max-width: 520px)").matches;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const saveData = navigator.connection?.saveData === true;
  const lowMemory =
    typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
  const lowCpu =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;

  const reasons = [
    compactScreen && "compactScreen",
    reducedMotion && "reducedMotion",
    saveData && "saveData",
    lowMemory && "lowMemory",
    lowCpu && "lowCpu",
  ].filter(Boolean);

  return {
    performanceMode: reasons.length > 0,
    performanceReasons: reasons,
    reducedMotion,
  };
}

function useVisualCapabilities() {
  const [capabilities, setCapabilities] = useState(getVisualCapabilities);

  useEffect(() => {
    const compactScreen = window.matchMedia("(max-width: 520px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateCapabilities = () => setCapabilities(getVisualCapabilities());

    compactScreen.addEventListener("change", updateCapabilities);
    reducedMotion.addEventListener("change", updateCapabilities);
    return () => {
      compactScreen.removeEventListener("change", updateCapabilities);
      reducedMotion.removeEventListener("change", updateCapabilities);
    };
  }, []);

  return capabilities;
}

function TimeUnit({ large, value, label }) {
  return (
    <div className="grid min-w-0 justify-items-center gap-2 sm:gap-3">
      <span
        className={`animate-digit bg-gradient-to-b from-[#f5fbff] via-[#c7d8e2] to-[#7891a1] bg-clip-text pr-[0.06em] font-mono font-semibold leading-[0.82] tracking-[-0.08em] text-transparent drop-shadow-[0_16px_36px_rgb(0_0_0_/_0.58)] ${large ? "text-[clamp(4.4rem,16vw,16rem)]" : "text-[clamp(3.65rem,13.5vw,13.5rem)]"}`}
        key={value}
      >
        {value}
      </span>
      <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-dim uppercase sm:text-xs sm:tracking-[0.18em]">
        {label}
      </span>
    </div>
  );
}

function DisplayClock({ dateTime, hours, labels, large, minutes, seconds }) {
  return (
    <time
      className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[clamp(0.3rem,1.8vw,1.5rem)] py-[clamp(2.5rem,6vw,4.5rem)] max-[520px]:py-[clamp(2rem,9vw,3rem)]"
      dateTime={dateTime}
      aria-label={`${hours}:${minutes}:${seconds}`}
    >
      <TimeUnit large={large} value={hours} label={labels.hours} />
      <span className="-mt-5 font-mono text-[clamp(2.1rem,7vw,8rem)] font-light text-white/35 sm:-mt-7">
        :
      </span>
      <TimeUnit large={large} value={minutes} label={labels.minutes} />
      <span className="-mt-5 font-mono text-[clamp(2.1rem,7vw,8rem)] font-light text-white/35 sm:-mt-7">
        :
      </span>
      <TimeUnit large={large} value={seconds} label={labels.seconds} />
    </time>
  );
}

function PerformanceMeter({ labels, reasons }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 60_000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="mx-auto grid max-w-2xl gap-1 rounded-xl border border-warning/25 bg-warning/10 px-3 py-2 text-xs text-warning/85"
      role="status"
    >
      <strong className="text-warning">
        {labels.performance} · {labels.performanceStatic}
      </strong>
      <span>{labels.performanceDescription}</span>
      <small className="text-warning/70">
        {reasons.map((reason) => labels.performanceReasons[reason]).join(" · ")}
      </small>
    </div>
  );
}

export function Clock() {
  const [now, setNow] = useState(() => new Date());
  const [preferences, updatePreferences] = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef(0);
  const shortcutCloseRef = useRef(null);
  const shortcutDialogRef = useRef(null);
  const shortcutRestoreFocusRef = useRef(null);
  const shortcutTriggerRef = useRef(null);
  const isUiHidden = useFullscreenAutoHide();
  const { display, visual, data } = preferences;
  const {
    dateFormat,
    displayMode,
    hourMode,
    language,
    locale: regionalLocale,
    maxWorldClocks,
    selectedWorldCities,
    temperatureUnit,
    worldClockVisible,
  } = display;
  const {
    auroraMotion,
    autoShift,
    backgroundIntensity,
    desktopMode,
    themeMode,
    wideLayout,
  } = visual;
  const { calendarEvents, planner, weatherEnabled, weatherLocation } = data;
  const { performanceMode, performanceReasons, reducedMotion } =
    useVisualCapabilities();
  const labels = copy[language];

  const showToast = useCallback((message) => {
    if (!message) return;
    setToastMessage(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(""), 2200);
  }, []);

  const updatePreferenceWithToast = useCallback(
    (next, message) => {
      updatePreferences(next);
      showToast(message);
    },
    [showToast, updatePreferences],
  );
  const { install, isOnline, isPwaInstalled, pwaInstallStatus, updateReady } =
    useAppLifecycle({
      installInstalledLabel: labels.installInstalled,
      onAppInstalled: showToast,
    });
  const weather = useWeather(weatherEnabled, isOnline, weatherLocation);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          'button, input, select, textarea, [contenteditable="true"]',
        )
      )
        return;
      const key = event.key.toLowerCase();
      if (key === "f") {
        event.preventDefault();
        toggleFullscreen();
      }
      if (key === "t") {
        event.preventDefault();
        updatePreferenceWithToast(
          (current) => {
            const nextThemeMode = getNextThemeMode(current.visual.themeMode);
            return { visual: { themeMode: nextThemeMode } };
          },
          `${labels.toast.theme} ${labels.themeLabels[getNextThemeMode(themeMode)]}`,
        );
      }
      if (key === "l") {
        event.preventDefault();
        updatePreferenceWithToast(
          (current) => ({
            display: { language: getNextLanguage(current.display.language) },
          }),
          labels.toast.language,
        );
      }
      if (key === "h") {
        event.preventDefault();
        updatePreferenceWithToast(
          (current) => ({
            display: {
              hourMode: current.display.hourMode === "24" ? "12" : "24",
            },
          }),
          labels.toast.hour,
        );
      }
      if (key === "w") {
        event.preventDefault();
        updatePreferenceWithToast(
          (current) => ({
            display: { worldClockVisible: !current.display.worldClockVisible },
          }),
          labels.toast.world,
        );
      }
      if (event.key === "?") {
        event.preventDefault();
        setIsShortcutHelpOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [labels, themeMode, updatePreferenceWithToast]);

  useEffect(() => {
    if (!isShortcutHelpOpen) return undefined;

    shortcutRestoreFocusRef.current =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : shortcutTriggerRef.current;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsShortcutHelpOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [
        ...(shortcutDialogRef.current?.querySelectorAll(
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
      shortcutCloseRef.current?.focus(),
    );
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      if (shortcutRestoreFocusRef.current?.isConnected)
        shortcutRestoreFocusRef.current.focus();
      shortcutRestoreFocusRef.current = null;
    };
  }, [isShortcutHelpOpen]);

  const handleInstall = useCallback(async () => {
    if (isPwaInstalled) {
      showToast(labels.installInstalled);
      return;
    }

    if (!(await install())) {
      showToast(labels.installUnavailable);
    }
  }, [
    install,
    isPwaInstalled,
    labels.installInstalled,
    labels.installUnavailable,
    showToast,
  ]);

  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const toggleSettings = useCallback(
    () => setIsSettingsOpen((open) => !open),
    [],
  );
  const refreshForUpdate = useCallback(async () => {
    const reload = () => window.location.reload();
    if (!("serviceWorker" in navigator)) {
      reload();
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration?.waiting) {
        reload();
        return;
      }

      const fallback = window.setTimeout(reload, 3000);
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          window.clearTimeout(fallback);
          reload();
        },
        { once: true },
      );
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    } catch {
      reload();
    }
  }, []);
  const openPlanner = useCallback(() => {
    setIsSettingsOpen(false);
    setIsPlannerOpen(true);
  }, []);
  const importCalendar = useCallback(
    (text) => {
      try {
        const events = parseIcsEvents(text);
        updatePreferences({
          data: {
            calendarEvents: events.map((event) => ({
              end: event.end?.toISOString() ?? null,
              start: event.start.toISOString(),
              title: event.title,
            })),
          },
        });
        return events.length ? "imported" : "noRecent";
      } catch (error) {
        return error instanceof IcsImportError && error.code === "unsupported"
          ? "unsupported"
          : "invalid";
      }
    },
    [updatePreferences],
  );
  const clearCalendar = useCallback(() => {
    updatePreferences({ data: { calendarEvents: [] } });
  }, [updatePreferences]);
  const updatePlanner = useCallback(
    (nextPlanner) => updatePreferences({ data: { planner: nextPlanner } }),
    [updatePreferences],
  );
  const resetPreferences = useCallback(
    () => updatePreferences(defaultPreferences),
    [updatePreferences],
  );
  const importPreferences = useCallback(
    (value) => {
      const next = normalizePreferences(value);
      if (next) {
        updatePreferences(next);
        return true;
      }
      return false;
    },
    [updatePreferences],
  );

  const is24Hour = hourMode === "24";
  const locale = getLocale(language, regionalLocale);
  const parts = getClockParts(now, is24Hour, locale);
  const dateLabel = formatDateLabel(now, locale, dateFormat);
  const autoPhase = getDayPhase(now.getHours());
  const dayPhase = themeMode === "auto" ? autoPhase : themeMode;
  const intensity = intensityConfig[backgroundIntensity];
  const themeVisual = themeVisuals[dayPhase];
  const burnInShift =
    autoShift && !reducedMotion ? getBurnInShiftOffset(now) : { x: 0, y: 0 };
  const weatherAtmosphere =
    weatherEnabled && weather.status === "ready" ? weather.atmosphere : "none";
  const weatherTint =
    {
      clear: "#78e8e0",
      cloudy: "#b8c8de",
      rain: "#669cff",
      fog: "#d9e2eb",
      snow: "#d7efff",
      storm: "#8496ff",
    }[weatherAtmosphere] ?? themeVisual.glow[1];
  const pureBlack = displayMode === "black";
  const stageStyle = {
    "--accent-a": themeVisual.glow[0],
    "--accent-b": themeVisual.glow[1],
    "--accent-c": themeVisual.glow[2],
    background: pureBlack
      ? "#000"
      : `radial-gradient(circle at 20% 12%, ${weatherTint}22, transparent 30%), radial-gradient(circle at 84% 78%, ${themeVisual.glow[2]}28, transparent 38%), linear-gradient(135deg, #030712 0%, #071423 52%, #02030a 100%)`,
  };
  const baseAurora = themeVisual.aurora;
  const aurora = {
    ...baseAurora,
    amplitude: baseAurora.amplitude * intensity.multiplier,
    blend: baseAurora.blend * intensity.multiplier,
    speed: intensity.speed,
  };
  // An explicit dynamic choice should win over the automatic performance suggestion.
  const isAuroraStatic = auroraMotion === "static";
  const worldTimes = useMemo(
    () =>
      selectedWorldCities
        .map(getWorldClock)
        .filter(Boolean)
        .slice(0, maxWorldClocks)
        .map((clock) => ({
          city: clock.city[language],
          dateTime: now.toISOString(),
          date: formatWorldDate(now, clock.timeZone, locale),
          dayOffset: getWorldDayOffset(now, clock.timeZone),
          time: formatWorldTime(now, clock.timeZone, is24Hour, locale),
          timeZone: clock.timeZone,
        })),
    [maxWorldClocks, now, is24Hour, language, locale, selectedWorldCities],
  );
  const showWorldClocks =
    worldClockVisible && !desktopMode && !document.fullscreenElement;

  return (
    <main
      className={`relative grid min-h-dvh place-items-center overflow-hidden px-4 pb-20 pt-24 sm:p-7 lg:py-10 ${desktopMode ? "lg:p-10" : ""} ${isUiHidden ? "[&_.hud-control]:pointer-events-none [&_.hud-control]:-translate-y-3 [&_.hud-control]:opacity-0" : ""}`}
      style={stageStyle}
    >
      <h1 className="sr-only">{labels.appLabel}</h1>
      {!pureBlack && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--accent-b) 12%, transparent), transparent 42%)",
            }}
            key={dayPhase}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgb(255_255_255_/_0.025)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.025)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute -inset-[10%] overflow-hidden opacity-80 blur-sm saturate-150 ${isAuroraStatic ? "" : "animate-float"}`}
            aria-hidden="true"
          >
            <Aurora
              amplitude={aurora.amplitude}
              animated={!isAuroraStatic}
              blend={aurora.blend}
              colorStops={aurora.colorStops}
              speed={aurora.speed}
            />
          </div>
          <div
            className="pointer-events-none absolute -left-48 -top-48 size-[42rem] rounded-full bg-[radial-gradient(circle,var(--accent-a)_0%,transparent_64%)] opacity-15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-64 -right-48 size-[48rem] rounded-full bg-[radial-gradient(circle,var(--accent-c)_0%,transparent_64%)] opacity-20 blur-3xl"
            aria-hidden="true"
          />
        </>
      )}

      <button
        className="hud-control absolute left-5 top-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-panel/80 px-3 text-sm font-bold text-white shadow-xl backdrop-blur-xl transition hover:border-cyan/40 hover:bg-cyan/10 max-[820px]:left-4 max-[820px]:top-4"
        type="button"
        onClick={() => setIsShortcutHelpOpen(true)}
        aria-controls="shortcut-dialog"
        aria-expanded={isShortcutHelpOpen}
        ref={shortcutTriggerRef}
      >
        <Keyboard size={16} aria-hidden="true" />
        <span>{labels.help}</span>
        <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-slate-300">
          ?
        </kbd>
      </button>

      {isShortcutHelpOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-night/75 p-5 backdrop-blur-md"
          role="presentation"
          onPointerDown={(event) =>
            event.target === event.currentTarget && setIsShortcutHelpOpen(false)
          }
        >
          <section
            className="w-full max-w-sm rounded-3xl border border-white/15 bg-panel/95 p-5 shadow-2xl shadow-black/50"
            id="shortcut-dialog"
            ref={shortcutDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcut-dialog-title"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <strong id="shortcut-dialog-title">{labels.shortcutHelp}</strong>
              <button
                className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                ref={shortcutCloseRef}
                type="button"
                onClick={() => setIsShortcutHelpOpen(false)}
                aria-label={labels.dismiss}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="grid gap-2">
              {labels.shortcutRows.map(([key, value]) => (
                <div
                  className="flex items-center justify-between gap-4 text-sm text-slate-400"
                  key={key}
                >
                  <kbd className="min-w-10 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center font-mono font-bold text-white">
                    {key}
                  </kbd>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <SettingsPanel
        is24Hour={is24Hour}
        isOnline={isOnline}
        isOpen={isSettingsOpen}
        labels={labels}
        onClose={closeSettings}
        onInstall={handleInstall}
        onPreferenceChange={updatePreferenceWithToast}
        pwaInstallStatus={pwaInstallStatus}
        onToggle={toggleSettings}
        preferences={preferences}
        weather={weather}
        onOpenPlanner={openPlanner}
        onImportCalendar={importCalendar}
        onClearCalendar={clearCalendar}
        onResetPreferences={resetPreferences}
        onImportPreferences={importPreferences}
        performanceMode={performanceMode}
        performanceReasons={performanceReasons}
      />

      <Toast message={toastMessage} />
      {isPlannerOpen && (
        <MeetingPlanner
          language={language}
          locale={locale}
          labels={labels}
          onClose={() => setIsPlannerOpen(false)}
          onPlannerChange={updatePlanner}
          plannerPreferences={planner}
        />
      )}

      {updateReady && (
        <div
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-cyan/25 bg-panel/95 p-3 text-sm text-white shadow-2xl backdrop-blur-xl"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{labels.updateReady}</span>
          <button
            className="rounded-lg bg-cyan px-3 py-2 text-xs font-bold text-night transition hover:brightness-110"
            type="button"
            onClick={refreshForUpdate}
          >
            {labels.refresh}
          </button>
        </div>
      )}

      <ErrorBoundary
        fallback={
          <div className="relative z-10 h-[420px] w-full max-w-6xl rounded-3xl border border-white/10 bg-panel/70" />
        }
      >
        <BorderGlow
          className={`relative z-10 w-full ${wideLayout || desktopMode ? "max-w-[90rem]" : "max-w-6xl"}`}
          edgeSensitivity={26}
          glowColor="185 90 78"
          backgroundColor="transparent"
          borderRadius={38}
          glowRadius={46}
          glowIntensity={pureBlack ? 0 : 0.85}
          coneSpread={22}
          animated={!pureBlack && !isAuroraStatic}
          colors={themeVisual.glow}
          backgroundColor={pureBlack ? "#000" : "transparent"}
          fillOpacity={pureBlack ? 1 : 0.22}
        >
          <SpotlightCard
            className={`min-h-0 rounded-[37px] border p-[clamp(1.25rem,4vw,3rem)] transition-[transform,border-color] duration-500 motion-reduce:transition-none ${pureBlack ? "border-transparent !bg-black shadow-none backdrop-blur-none hover:border-transparent" : "border-white/12 bg-gradient-to-br from-white/[0.09] to-white/[0.025] shadow-[0_36px_110px_rgb(0_0_0_/_0.72)] backdrop-blur-2xl hover:border-white/24"}`}
            style={{
              transform: `translate3d(${burnInShift.x}px, ${burnInShift.y}px, 0)`,
            }}
            spotlightColor={
              pureBlack ? "transparent" : "rgba(120, 232, 224, 0.08)"
            }
            aria-label={labels.appLabel}
          >
            <div className="relative z-10 animate-[float_420s_ease-in-out_infinite_alternate]">
              <div
                className={`flex items-center justify-between gap-4 text-sm text-dim ${desktopMode ? "hidden" : ""}`}
              >
                <span className="rounded-full border border-white/12 bg-white/[0.045] px-3 py-2 text-xs font-semibold tracking-wide">
                  {labels.title}
                </span>
                <span className="inline-flex items-center gap-2 text-xs text-dim before:size-2 before:rounded-full before:bg-lime before:shadow-[0_0_16px_rgb(200_243_106_/_0.9)]">
                  {labels.live} · {!is24Hour ? `${parts.meridiem} · ` : ""}
                  {themeMode === "auto"
                    ? `${labels.themeLabels.auto} ${labels.themeLabels[autoPhase]}`
                    : labels.themeLabels[dayPhase]}
                </span>
              </div>

              {performanceMode && (
                <PerformanceMeter
                  labels={labels}
                  reasons={performanceReasons}
                />
              )}

              <DisplayClock
                dateTime={now.toISOString()}
                hours={parts.hours}
                large={displayMode === "large"}
                minutes={parts.minutes}
                seconds={parts.seconds}
                labels={labels.timeLabels}
              />

              {showWorldClocks && (
                <WorldClocks
                  clocks={worldTimes}
                  dayLabels={{
                    yesterday: labels.yesterday,
                    tomorrow: labels.tomorrow,
                  }}
                  label={labels.worldClocks}
                />
              )}

              <EventInfoBar
                event={calendarEvents
                  .map((event) => ({
                    ...event,
                    end: event.end ? new Date(event.end) : null,
                    start: new Date(event.start),
                  }))
                  .find((event) => event.start >= now || event.end >= now)}
                labels={labels}
                language={language}
                locale={locale}
                now={now.getTime()}
              />

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-dim">
                {dateLabel && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={17} className="text-cyan" /> {dateLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Globe2 size={17} className="text-cyan" /> {parts.zoneLabel}
                </span>
                <WeatherStatus
                  enabled={weatherEnabled}
                  isOnline={isOnline}
                  labels={labels}
                  weather={weather}
                  onRefresh={weatherEnabled ? weather.refresh : undefined}
                  temperatureUnit={temperatureUnit}
                />
              </div>
            </div>
          </SpotlightCard>
        </BorderGlow>
      </ErrorBoundary>
    </main>
  );
}
