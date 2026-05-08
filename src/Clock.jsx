import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Globe2 } from 'lucide-react';
import BorderGlow from './BorderGlow.jsx';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import SpotlightCard from './SpotlightCard.jsx';
import { SettingsPanel } from './SettingsPanel.jsx';
import { Toast } from './Toast.jsx';
import { WeatherStatus } from './WeatherStatus.jsx';
import { WorldClocks } from './WorldClocks.jsx';
import {
  auroraBaseConfig,
  copy,
  getDayPhase,
  getNextLanguage,
  getNextThemeMode,
  glowColors,
  intensityConfig,
  numberFormat,
  toggleFullscreen,
  worldClocks,
} from './clockConfig.js';
import { useFullscreenAutoHide } from './hooks/useFullscreenAutoHide.js';
import { usePreferences } from './hooks/usePreferences.js';
import { useWeather } from './hooks/useWeather.js';
import Aurora from './reactbits/Aurora.jsx';

const formatterCache = new Map();

function getDateTimeFormatter(locale, options) {
  const key = `${locale}:${JSON.stringify(options)}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.DateTimeFormat(locale, options));
  }
  return formatterCache.get(key);
}

function getClockParts(date, is24Hour, locale) {
  const rawHours = date.getHours();
  const displayHours = is24Hour ? rawHours : rawHours % 12 || 12;
  const zoneFormat = getDateTimeFormatter(locale, { timeZoneName: 'short' });

  return {
    hours: numberFormat.format(displayHours),
    minutes: numberFormat.format(date.getMinutes()),
    seconds: numberFormat.format(date.getSeconds()),
    meridiem: rawHours >= 12 ? 'PM' : 'AM',
    zoneLabel: zoneFormat.formatToParts(date).find((part) => part.type === 'timeZoneName')?.value ?? 'Local',
  };
}

function formatDateLabel(date, locale, format) {
  if (format === 'hidden') return null;

  const options = {
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    compact: { year: 'numeric', month: '2-digit', day: '2-digit' },
    weekday: { weekday: 'long' },
  }[format];

  return getDateTimeFormatter(locale, options).format(date);
}

function formatWorldTime(date, timeZone, is24Hour, locale) {
  return getDateTimeFormatter(locale, { hour: '2-digit', minute: '2-digit', hour12: !is24Hour, timeZone }).format(date);
}

function TimeUnit({ value, label }) {
  return (
    <div className="time-unit">
      <span className="time-value" key={value}>{value}</span>
      <span className="time-label">{label}</span>
    </div>
  );
}

function DisplayClock({ hours, labels, minutes, seconds }) {
  return (
    <div className="display-clock" aria-label={`${hours}:${minutes}:${seconds}`}>
      <TimeUnit value={hours} label={labels.hours} />
      <span className="time-separator">:</span>
      <TimeUnit value={minutes} label={labels.minutes} />
      <span className="time-separator">:</span>
      <TimeUnit value={seconds} label={labels.seconds} />
    </div>
  );
}

function isStandalonePwa() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function Clock() {
  const [now, setNow] = useState(() => new Date());
  const [preferences, updatePreferences] = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(() => isStandalonePwa());
  const [toastMessage, setToastMessage] = useState('');
  const [updateReady, setUpdateReady] = useState(false);
  const toastTimerRef = useRef(0);
  const isUiHidden = useFullscreenAutoHide();
  const weather = useWeather(preferences.weatherEnabled, isOnline);
  const { auroraMotion, backgroundIntensity, dateFormat, desktopMode, hourMode, language, selectedWorldCities, themeMode, weatherEnabled, worldClockVisible } = preferences;
  const labels = copy[language];

  const showToast = useCallback((message) => {
    if (!message) return;
    setToastMessage(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(''), 2200);
  }, []);

  const updatePreferenceWithToast = useCallback((next, message) => {
    updatePreferences(next);
    showToast(message);
  }, [showToast, updatePreferences]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === 'f') {
        event.preventDefault();
        toggleFullscreen();
      }
      if (key === 't') {
        event.preventDefault();
        updatePreferenceWithToast((current) => {
          const themeMode = getNextThemeMode(current.themeMode);
          return { themeMode };
        }, `${labels.toast.theme} ${labels.themeLabels[getNextThemeMode(themeMode)]}`);
      }
      if (key === 'l') {
        event.preventDefault();
        updatePreferenceWithToast((current) => ({ language: getNextLanguage(current.language) }), labels.toast.language);
      }
      if (key === 'h') {
        event.preventDefault();
        updatePreferenceWithToast((current) => ({ hourMode: current.hourMode === '24' ? '12' : '24' }), labels.toast.hour);
      }
      if (key === 'w') {
        event.preventDefault();
        updatePreferenceWithToast((current) => ({ worldClockVisible: !current.worldClockVisible }), labels.toast.world);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [labels, themeMode, updatePreferenceWithToast]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isStandalonePwa()) return undefined;
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      if (!preferences.installDismissed) setInstallPrompt(event);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsPwaInstalled(true);
      showToast(labels.installInstalled);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [labels.installInstalled, preferences.installDismissed, showToast]);

  useEffect(() => {
    const handleAppUpdateReady = () => setUpdateReady(true);
    window.addEventListener('app-update-ready', handleAppUpdateReady);
    return () => window.removeEventListener('app-update-ready', handleAppUpdateReady);
  }, []);

  const handleInstall = async () => {
    if (isPwaInstalled) {
      showToast(labels.installInstalled);
      return;
    }

    if (!installPrompt) {
      showToast(labels.installUnavailable);
      return;
    }
    await installPrompt.prompt();
    setInstallPrompt(null);
  };
  const pwaInstallStatus = isPwaInstalled ? 'installInstalled' : installPrompt ? 'installAvailable' : 'installUnsupported';

  const is24Hour = hourMode === '24';
  const locale = language === 'zh' ? 'zh-CN' : 'en-US';
  const parts = getClockParts(now, is24Hour, locale);
  const dateLabel = formatDateLabel(now, locale, dateFormat);
  const autoPhase = getDayPhase(now.getHours());
  const dayPhase = themeMode === 'auto' ? autoPhase : themeMode;
  const intensity = intensityConfig[backgroundIntensity];
  const baseAurora = auroraBaseConfig[dayPhase];
  const aurora = {
    ...baseAurora,
    amplitude: baseAurora.amplitude * intensity.multiplier,
    blend: baseAurora.blend * intensity.multiplier,
    speed: intensity.speed,
  };
  const worldTimes = useMemo(
    () => worldClocks
      .filter((clock) => selectedWorldCities.includes(clock.id))
      .map((clock) => ({ city: clock.city[language], time: formatWorldTime(now, clock.timeZone, is24Hour, locale), timeZone: clock.timeZone })),
    [now, is24Hour, language, locale, selectedWorldCities],
  );
  const showWorldClocks = worldClockVisible && !desktopMode && !document.fullscreenElement;

  return (
    <main className={`stage apple-stage theme-${dayPhase} weather-${weather.atmosphere} intensity-${backgroundIntensity} ${desktopMode ? 'desktop-mode' : ''} ${isUiHidden ? 'ui-hidden' : ''}`}>
      <div className="theme-cue" key={dayPhase} aria-hidden="true" />
      <div className="weather-visual" aria-hidden="true" />
      <div className="aurora-field" aria-hidden="true">
        <ErrorBoundary fallback={<div className="aurora-fallback" />}>
          {auroraMotion === 'dynamic' ? <Aurora colorStops={aurora.colorStops} blend={aurora.blend} amplitude={aurora.amplitude} speed={aurora.speed} /> : <div className="aurora-fallback" />}
        </ErrorBoundary>
      </div>
      <div className="decor decor-one" aria-hidden="true" />
      <div className="decor decor-two" aria-hidden="true" />
      <div className="decor decor-three" aria-hidden="true" />
      <div className="decor-grid" aria-hidden="true" />

      <SettingsPanel
        is24Hour={is24Hour}
        isOnline={isOnline}
        isOpen={isSettingsOpen}
        labels={labels}
        onClose={() => setIsSettingsOpen(false)}
        onInstall={handleInstall}
        onPreferenceChange={updatePreferenceWithToast}
        pwaInstallStatus={pwaInstallStatus}
        onToggle={() => setIsSettingsOpen((open) => !open)}
        preferences={preferences}
        weather={weather}
      />

      <Toast message={toastMessage} />

      {updateReady && (
        <div className="update-toast" aria-live="polite" aria-atomic="true">
          <span>{labels.updateReady}</span>
          <button type="button" onClick={() => window.location.reload()}>{labels.refresh}</button>
        </div>
      )}

      <ErrorBoundary fallback={<div className="clock-glow visual-fallback" />}>
        <BorderGlow
          className="clock-glow"
          edgeSensitivity={26}
          glowColor="185 90 78"
          backgroundColor="transparent"
          borderRadius={38}
          glowRadius={46}
          glowIntensity={0.85}
          coneSpread={22}
          animated
          colors={glowColors[dayPhase]}
          fillOpacity={0.22}
        >
        <SpotlightCard className="flip-shell" spotlightColor="rgba(255, 255, 255, 0.22)" aria-label={labels.appLabel}>
            <div className="burn-in-guard">
              <div className="glass-toolbar">
                <span className="glass-pill">{labels.title}</span>
                <span className="glass-status">{labels.live} · {!is24Hour ? `${parts.meridiem} · ` : ''}{themeMode === 'auto' ? `${labels.themeLabels.auto} ${labels.themeLabels[autoPhase]}` : labels.themeLabels[dayPhase]}</span>
              </div>

              <DisplayClock hours={parts.hours} minutes={parts.minutes} seconds={parts.seconds} labels={labels.timeLabels} />

              {showWorldClocks && <WorldClocks clocks={worldTimes} label={labels.worldClocks} />}

              <div className="glass-meta">
                {dateLabel && <span><CalendarDays size={17} /> {dateLabel}</span>}
                <span><Globe2 size={17} /> {parts.zoneLabel}</span>
                <WeatherStatus enabled={weatherEnabled} isOnline={isOnline} labels={labels} weather={weather} />
              </div>
            </div>
          </SpotlightCard>
        </BorderGlow>
      </ErrorBoundary>
    </main>
  );
}
