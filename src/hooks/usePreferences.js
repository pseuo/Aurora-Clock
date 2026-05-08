import { useEffect, useState } from 'react';

const preferenceKey = 'time-preferences';
const defaultPreferences = {
  version: 3,
  themeMode: 'auto',
  hourMode: '24',
  language: 'zh',
  worldClockVisible: true,
  weatherEnabled: false,
  installDismissed: false,
  backgroundIntensity: 'normal',
  auroraMotion: 'dynamic',
  dateFormat: 'full',
  desktopMode: false,
  selectedWorldCities: ['tokyo', 'london', 'new-york'],
};

function getPreferences() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(preferenceKey) ?? 'null');
    if (saved?.version) return { ...defaultPreferences, ...saved, version: defaultPreferences.version };

    return {
      ...defaultPreferences,
      themeMode: window.localStorage.getItem('time-theme-mode') ?? defaultPreferences.themeMode,
      hourMode: window.localStorage.getItem('time-hour-mode') ?? defaultPreferences.hourMode,
      language: window.localStorage.getItem('time-language') ?? defaultPreferences.language,
    };
  } catch {
    return defaultPreferences;
  }
}

export function usePreferences() {
  const [preferences, setPreferencesState] = useState(() => getPreferences());

  const updatePreferences = (next) => {
    setPreferencesState((current) => ({ ...current, ...(typeof next === 'function' ? next(current) : next) }));
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    } catch {
      // Preferences are progressive enhancement.
    }
    document.documentElement.lang = preferences.language === 'zh' ? 'zh-CN' : 'en';
  }, [preferences]);

  return [preferences, updatePreferences];
}
