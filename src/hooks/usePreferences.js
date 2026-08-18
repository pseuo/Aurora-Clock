import { useCallback, useEffect, useRef, useState } from "react";
import {
  auroraMotionOptions,
  dateFormatOptions,
  displayModeOptions,
  intensityOptions,
  languageOptions,
  localeOptions,
  temperatureUnitOptions,
  themeOptions,
  getWorldClock,
  worldClockLimitOptions,
} from "../clockConfig.js";

export const preferenceKey = "time-preferences";
/**
 * @typedef {Object} WeatherLocation
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} name
 */

/**
 * @typedef {Object} Preferences
 * @property {number} version
 * @property {Object} display
 * @property {Object} visual
 * @property {{ weatherEnabled: boolean, weatherLocation: WeatherLocation | null, alarms: Array, calendarEvents: Array, countdown: Object, planner: Object }} data
 */

/** @type {Preferences} */
export const defaultPreferences = {
  version: 8,
  display: {
    hourMode: "24",
    language: "zh",
    locale: "auto",
    temperatureUnit: "celsius",
    dateFormat: "full",
    worldClockVisible: true,
    selectedWorldCities: ["tokyo", "london", "new-york"],
    maxWorldClocks: 6,
    displayMode: "balanced",
  },
  visual: {
    themeMode: "auto",
    backgroundIntensity: "normal",
    auroraMotion: "dynamic",
    desktopMode: false,
    autoShift: true,
    wideLayout: false,
  },
  data: {
    weatherEnabled: false,
    weatherLocation: null,
    alarms: [],
    calendarEvents: [],
    countdown: {
      endsAt: null,
      mode: "countdown",
      paused: true,
      remainingSeconds: 5 * 60,
    },
    planner: {
      duration: 30,
      firstId: "beijing",
      firstSchedule: {
        end: "18:00",
        start: "09:00",
        workdays: [1, 2, 3, 4, 5],
      },
      secondId: "new-york",
      secondSchedule: {
        end: "18:00",
        start: "09:00",
        workdays: [1, 2, 3, 4, 5],
      },
    },
  },
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function valueFromOptions(value, options, fallback) {
  return typeof value === "string" && options.includes(value)
    ? value
    : fallback;
}

function booleanOrDefault(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function numberFromOptions(value, options, fallback) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    options.includes(value)
    ? value
    : fallback;
}

function normalizeCities(value) {
  if (!Array.isArray(value))
    return defaultPreferences.display.selectedWorldCities;

  return [
    ...new Set(
      value.filter((id) => typeof id === "string" && getWorldClock(id)),
    ),
  ];
}

function normalizeWeatherLocation(value) {
  if (value === null) return null;
  if (!isRecord(value) || typeof value.name !== "string" || !value.name.trim())
    return null;
  if (!Number.isFinite(value.latitude) || !Number.isFinite(value.longitude))
    return null;
  if (
    value.latitude < -90 ||
    value.latitude > 90 ||
    value.longitude < -180 ||
    value.longitude > 180
  )
    return null;

  return {
    latitude: value.latitude,
    longitude: value.longitude,
    name: value.name,
  };
}

function normalizeAlarms(value) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((alarm) => {
    const repeat = ["daily", "weekdays", "once"].includes(alarm?.repeat)
      ? alarm.repeat
      : "daily";
    const validDate =
      typeof alarm?.date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(alarm.date) &&
      !Number.isNaN(new Date(`${alarm.date}T00:00:00`).getTime());
    if (
      !isRecord(alarm) ||
      typeof alarm.id !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(alarm.time) ||
      !Number.isFinite(alarm.addedAt) ||
      (repeat === "once" && !validDate)
    )
      return [];
    return [
      {
        addedAt: alarm.addedAt,
        advanceMinutes: [0, 5, 10, 15, 30, 60].includes(alarm.advanceMinutes)
          ? alarm.advanceMinutes
          : 0,
        date: repeat === "once" ? alarm.date : null,
        id: alarm.id,
        name: typeof alarm.name === "string" ? alarm.name.slice(0, 80) : "",
        repeat,
        snoozeMinutes: [5, 10, 15, 30].includes(alarm.snoozeMinutes)
          ? alarm.snoozeMinutes
          : 10,
        snoozedUntil:
          Number.isFinite(alarm.snoozedUntil) && alarm.snoozedUntil > 0
            ? alarm.snoozedUntil
            : null,
        time: alarm.time,
      },
    ];
  });
}

function normalizeCountdown(value) {
  if (!isRecord(value)) return defaultPreferences.data.countdown;

  const mode = valueFromOptions(
    value.mode,
    ["countdown", "pomodoro"],
    defaultPreferences.data.countdown.mode,
  );
  const remainingSeconds =
    Number.isInteger(value.remainingSeconds) && value.remainingSeconds >= 0
      ? value.remainingSeconds
      : mode === "pomodoro"
        ? 25 * 60
        : 5 * 60;
  const paused = booleanOrDefault(value.paused, true);
  const endsAt =
    Number.isFinite(value.endsAt) && value.endsAt > 0 ? value.endsAt : null;

  if (!paused && endsAt !== null)
    return { endsAt, mode, paused, remainingSeconds };

  return { endsAt: null, mode, paused: true, remainingSeconds };
}

function normalizeSchedule(value, fallback) {
  if (!isRecord(value)) return fallback;
  const validTime = (time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  const workdays = Array.isArray(value.workdays)
    ? [
        ...new Set(
          value.workdays.filter(
            (day) => Number.isInteger(day) && day >= 0 && day <= 6,
          ),
        ),
      ].sort()
    : fallback.workdays;
  return {
    end: validTime(value.end) ? value.end : fallback.end,
    start: validTime(value.start) ? value.start : fallback.start,
    workdays,
  };
}

function normalizePlanner(value) {
  const fallback = defaultPreferences.data.planner;
  if (!isRecord(value)) return fallback;
  return {
    duration: [15, 30, 45, 60, 90, 120].includes(value.duration)
      ? value.duration
      : fallback.duration,
    firstId: getWorldClock(value.firstId) ? value.firstId : fallback.firstId,
    firstSchedule: normalizeSchedule(
      value.firstSchedule,
      fallback.firstSchedule,
    ),
    secondId: getWorldClock(value.secondId)
      ? value.secondId
      : fallback.secondId,
    secondSchedule: normalizeSchedule(
      value.secondSchedule,
      fallback.secondSchedule,
    ),
  };
}

function normalizeCalendarEvents(value) {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((event) => {
      if (!isRecord(event) || typeof event.title !== "string") return [];
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : null;
      if (Number.isNaN(start.getTime()) || (end && Number.isNaN(end.getTime())))
        return [];
      return [
        {
          end: end?.toISOString() ?? null,
          start: start.toISOString(),
          title: event.title.slice(0, 300),
        },
      ];
    })
    .slice(0, 50);
}

function migratePreferences(saved) {
  if (!isRecord(saved) || !Number.isInteger(saved.version) || saved.version < 1)
    return null;

  const display = isRecord(saved.display) ? saved.display : {};
  const visual = isRecord(saved.visual) ? saved.visual : {};
  const data = isRecord(saved.data) ? saved.data : {};
  const isGrouped =
    isRecord(saved.display) || isRecord(saved.visual) || isRecord(saved.data);
  const source = isGrouped
    ? saved
    : {
        display: {
          hourMode: saved.hourMode,
          language: saved.language,
          locale: saved.locale,
          temperatureUnit: saved.temperatureUnit,
          dateFormat: saved.dateFormat,
          worldClockVisible: saved.worldClockVisible,
          selectedWorldCities: saved.selectedWorldCities,
          maxWorldClocks: saved.maxWorldClocks,
          displayMode: saved.displayMode,
        },
        visual: {
          themeMode: saved.themeMode,
          backgroundIntensity: saved.backgroundIntensity,
          auroraMotion: saved.auroraMotion,
          desktopMode: saved.desktopMode,
          autoShift: saved.autoShift,
          wideLayout: saved.wideLayout,
        },
        data: {
          weatherEnabled: saved.weatherEnabled,
          weatherLocation: saved.weatherLocation,
          alarms: saved.alarms,
          calendarEvents: saved.calendarEvents,
          countdown: saved.countdown,
          planner: saved.planner,
        },
      };
  const normalizedDisplay = isGrouped ? display : source.display;
  const normalizedVisual = isGrouped ? visual : source.visual;
  const normalizedData = isGrouped ? data : source.data;

  return {
    version: defaultPreferences.version,
    display: {
      ...defaultPreferences.display,
      hourMode: valueFromOptions(
        normalizedDisplay.hourMode,
        ["12", "24"],
        defaultPreferences.display.hourMode,
      ),
      language: valueFromOptions(
        normalizedDisplay.language,
        languageOptions,
        defaultPreferences.display.language,
      ),
      locale: valueFromOptions(
        normalizedDisplay.locale,
        localeOptions,
        defaultPreferences.display.locale,
      ),
      temperatureUnit: valueFromOptions(
        normalizedDisplay.temperatureUnit,
        temperatureUnitOptions,
        defaultPreferences.display.temperatureUnit,
      ),
      dateFormat: valueFromOptions(
        normalizedDisplay.dateFormat,
        dateFormatOptions,
        defaultPreferences.display.dateFormat,
      ),
      worldClockVisible: booleanOrDefault(
        normalizedDisplay.worldClockVisible,
        defaultPreferences.display.worldClockVisible,
      ),
      selectedWorldCities: normalizeCities(
        normalizedDisplay.selectedWorldCities,
      ),
      maxWorldClocks: numberFromOptions(
        normalizedDisplay.maxWorldClocks,
        worldClockLimitOptions,
        defaultPreferences.display.maxWorldClocks,
      ),
      displayMode: valueFromOptions(
        normalizedDisplay.displayMode,
        displayModeOptions,
        defaultPreferences.display.displayMode,
      ),
    },
    visual: {
      ...defaultPreferences.visual,
      themeMode: valueFromOptions(
        normalizedVisual.themeMode,
        themeOptions,
        defaultPreferences.visual.themeMode,
      ),
      backgroundIntensity: valueFromOptions(
        normalizedVisual.backgroundIntensity,
        intensityOptions,
        defaultPreferences.visual.backgroundIntensity,
      ),
      auroraMotion: valueFromOptions(
        normalizedVisual.auroraMotion,
        auroraMotionOptions,
        defaultPreferences.visual.auroraMotion,
      ),
      desktopMode: booleanOrDefault(
        normalizedVisual.desktopMode,
        defaultPreferences.visual.desktopMode,
      ),
      autoShift: booleanOrDefault(
        normalizedVisual.autoShift,
        defaultPreferences.visual.autoShift,
      ),
      wideLayout: booleanOrDefault(
        normalizedVisual.wideLayout,
        defaultPreferences.visual.wideLayout,
      ),
    },
    data: {
      ...defaultPreferences.data,
      weatherEnabled: booleanOrDefault(
        normalizedData.weatherEnabled,
        defaultPreferences.data.weatherEnabled,
      ),
      weatherLocation: normalizeWeatherLocation(normalizedData.weatherLocation),
      alarms: normalizeAlarms(normalizedData.alarms),
      calendarEvents: normalizeCalendarEvents(normalizedData.calendarEvents),
      countdown: normalizeCountdown(normalizedData.countdown),
      planner: normalizePlanner(normalizedData.planner),
    },
  };
}

export function getPreferences() {
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(preferenceKey) ?? "null",
    );
    const migrated = migratePreferences(saved);
    if (migrated) return migrated;

    return migratePreferences({
      version: defaultPreferences.version,
      themeMode: window.localStorage.getItem("time-theme-mode"),
      hourMode: window.localStorage.getItem("time-hour-mode"),
      language: window.localStorage.getItem("time-language"),
    });
  } catch {
    return defaultPreferences;
  }
}

export function usePreferences() {
  const [preferences, setPreferencesState] = useState(() => getPreferences());
  const preferencesRef = useRef(preferences);

  const updatePreferences = useCallback((next) => {
    const current = preferencesRef.current;
    const updates = typeof next === "function" ? next(current) : next;
    const updated = {
      ...current,
      ...updates,
      display: { ...current.display, ...updates.display },
      visual: { ...current.visual, ...updates.visual },
      data: { ...current.data, ...updates.data },
    };
    preferencesRef.current = updated;
    setPreferencesState(updated);
    try {
      window.localStorage.setItem(preferenceKey, JSON.stringify(updated));
    } catch {
      // Preferences are progressive enhancement.
    }
  }, []);

  useEffect(() => {
    preferencesRef.current = preferences;
    try {
      window.localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    } catch {
      // Preferences are progressive enhancement.
    }
    document.documentElement.lang =
      { zh: "zh-CN", en: "en", ja: "ja", es: "es" }[
        preferences.display.language
      ] ?? "en";
  }, [preferences]);

  return [preferences, updatePreferences];
}

/**
 * Validates untrusted localStorage, file, and migration-code payloads before they reach React state.
 * @param {unknown} value
 * @returns {Preferences | null}
 */
export function normalizePreferences(value) {
  return migratePreferences(value);
}
