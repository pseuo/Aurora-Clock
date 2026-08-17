import { useCallback, useEffect, useRef, useState } from 'react';
import {
  auroraMotionOptions,
  dateFormatOptions,
  displayModeOptions,
  intensityOptions,
  languageOptions,
  themeOptions,
  worldClockLimitOptions,
  worldClocks,
} from '../clockConfig.js';

export const preferenceKey = 'time-preferences';
export const defaultPreferences = {
  version: 5,
  display: {
    hourMode: '24',
    language: 'zh',
    dateFormat: 'full',
    worldClockVisible: true,
    selectedWorldCities: ['tokyo', 'london', 'new-york'],
    maxWorldClocks: 6,
    displayMode: 'balanced',
  },
  visual: {
    themeMode: 'auto',
    backgroundIntensity: 'normal',
    auroraMotion: 'dynamic',
    desktopMode: false,
    autoShift: true,
    wideLayout: false,
  },
  data: {
    weatherEnabled: false,
    weatherLocation: null,
  },
};

const worldCityIds = new Set(worldClocks.map(({ id }) => id));

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function valueFromOptions(value, options, fallback) {
  return typeof value === 'string' && options.includes(value) ? value : fallback;
}

function booleanOrDefault(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function numberFromOptions(value, options, fallback) {
  return typeof value === 'number' && Number.isFinite(value) && options.includes(value) ? value : fallback;
}

function normalizeCities(value) {
  if (!Array.isArray(value)) return defaultPreferences.display.selectedWorldCities;

  return [...new Set(value.filter((id) => typeof id === 'string' && worldCityIds.has(id)))];
}

function normalizeWeatherLocation(value) {
  if (value === null) return null;
  if (!isRecord(value) || typeof value.name !== 'string' || !value.name.trim()) return null;
  if (!Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) return null;
  if (value.latitude < -90 || value.latitude > 90 || value.longitude < -180 || value.longitude > 180) return null;

  return { latitude: value.latitude, longitude: value.longitude, name: value.name };
}

function migratePreferences(saved) {
  if (!isRecord(saved) || !Number.isInteger(saved.version) || saved.version < 1) return null;

  const display = isRecord(saved.display) ? saved.display : {};
  const visual = isRecord(saved.visual) ? saved.visual : {};
  const data = isRecord(saved.data) ? saved.data : {};
  const isGrouped = isRecord(saved.display) || isRecord(saved.visual) || isRecord(saved.data);
  const source = isGrouped ? saved : {
    display: {
      hourMode: saved.hourMode,
      language: saved.language,
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
    },
  };
  const normalizedDisplay = isGrouped ? display : source.display;
  const normalizedVisual = isGrouped ? visual : source.visual;
  const normalizedData = isGrouped ? data : source.data;

  return {
    version: defaultPreferences.version,
    display: {
      ...defaultPreferences.display,
      hourMode: valueFromOptions(normalizedDisplay.hourMode, ['12', '24'], defaultPreferences.display.hourMode),
      language: valueFromOptions(normalizedDisplay.language, languageOptions, defaultPreferences.display.language),
      dateFormat: valueFromOptions(normalizedDisplay.dateFormat, dateFormatOptions, defaultPreferences.display.dateFormat),
      worldClockVisible: booleanOrDefault(normalizedDisplay.worldClockVisible, defaultPreferences.display.worldClockVisible),
      selectedWorldCities: normalizeCities(normalizedDisplay.selectedWorldCities),
      maxWorldClocks: numberFromOptions(normalizedDisplay.maxWorldClocks, worldClockLimitOptions, defaultPreferences.display.maxWorldClocks),
      displayMode: valueFromOptions(normalizedDisplay.displayMode, displayModeOptions, defaultPreferences.display.displayMode),
    },
    visual: {
      ...defaultPreferences.visual,
      themeMode: valueFromOptions(normalizedVisual.themeMode, themeOptions, defaultPreferences.visual.themeMode),
      backgroundIntensity: valueFromOptions(normalizedVisual.backgroundIntensity, intensityOptions, defaultPreferences.visual.backgroundIntensity),
      auroraMotion: valueFromOptions(normalizedVisual.auroraMotion, auroraMotionOptions, defaultPreferences.visual.auroraMotion),
      desktopMode: booleanOrDefault(normalizedVisual.desktopMode, defaultPreferences.visual.desktopMode),
      autoShift: booleanOrDefault(normalizedVisual.autoShift, defaultPreferences.visual.autoShift),
      wideLayout: booleanOrDefault(normalizedVisual.wideLayout, defaultPreferences.visual.wideLayout),
    },
    data: {
      ...defaultPreferences.data,
      weatherEnabled: booleanOrDefault(normalizedData.weatherEnabled, defaultPreferences.data.weatherEnabled),
      weatherLocation: normalizeWeatherLocation(normalizedData.weatherLocation),
    },
  };
}

export function getPreferences() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(preferenceKey) ?? 'null');
    const migrated = migratePreferences(saved);
    if (migrated) return migrated;

    return migratePreferences({
      version: defaultPreferences.version,
      themeMode: window.localStorage.getItem('time-theme-mode'),
      hourMode: window.localStorage.getItem('time-hour-mode'),
      language: window.localStorage.getItem('time-language'),
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
    const updates = typeof next === 'function' ? next(current) : next;
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
    document.documentElement.lang = preferences.display.language === 'zh' ? 'zh-CN' : 'en';
  }, [preferences]);

  return [preferences, updatePreferences];
}

export function normalizePreferences(value) {
  return migratePreferences(value);
}
