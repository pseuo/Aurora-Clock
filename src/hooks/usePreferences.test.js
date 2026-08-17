import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { defaultPreferences, getPreferences, normalizePreferences, preferenceKey, usePreferences } from './usePreferences.js';

describe('preference migration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('migrates the flat v3 preference schema to grouped preferences', () => {
    const preferences = normalizePreferences({ version: 3, hourMode: '12', language: 'en', themeMode: 'night', weatherEnabled: true, selectedWorldCities: ['tokyo'] });

    expect(preferences).toMatchObject({
      version: 5,
      display: { hourMode: '12', language: 'en', selectedWorldCities: ['tokyo'] },
      visual: { themeMode: 'night' },
      data: { weatherEnabled: true },
    });
  });

  it('falls back to safe defaults and filters malformed grouped values', () => {
    const preferences = normalizePreferences({
      version: 5,
      display: {
        hourMode: 12,
        language: 'fr',
        dateFormat: 'invalid',
        worldClockVisible: 'false',
        selectedWorldCities: ['tokyo', 'unknown', 42, 'tokyo'],
        maxWorldClocks: '10',
        displayMode: null,
      },
      visual: {
        themeMode: 'invalid',
        backgroundIntensity: false,
        auroraMotion: 'invalid',
        desktopMode: 'true',
        autoShift: null,
        wideLayout: 1,
      },
      data: {
        weatherEnabled: 'true',
        weatherLocation: { latitude: '31.2', longitude: 181, name: 42 },
      },
    });

    expect(preferences).toMatchObject({
      display: { ...defaultPreferences.display, selectedWorldCities: ['tokyo'] },
      visual: defaultPreferences.visual,
      data: defaultPreferences.data,
    });
  });

  it('keeps valid grouped values including a weather location', () => {
    const preferences = normalizePreferences({
      version: 5,
      display: { hourMode: '12', selectedWorldCities: [] },
      visual: { themeMode: 'night', wideLayout: true },
      data: { weatherEnabled: true, weatherLocation: { latitude: 31.2, longitude: 121.5, name: 'Shanghai' } },
    });

    expect(preferences).toMatchObject({
      display: { hourMode: '12', selectedWorldCities: [] },
      visual: { themeMode: 'night', wideLayout: true },
      data: { weatherEnabled: true, weatherLocation: { latitude: 31.2, longitude: 121.5, name: 'Shanghai' } },
    });
  });

  it('does not let malformed stored JSON reach the clock preferences', () => {
    window.localStorage.setItem(preferenceKey, JSON.stringify({
      version: 5,
      display: null,
      visual: { themeMode: {} },
      data: { weatherEnabled: [] },
    }));

    expect(getPreferences()).toEqual(defaultPreferences);
  });

  it('imports legacy localStorage keys and persists changes', () => {
    window.localStorage.setItem('time-theme-mode', 'evening');
    window.localStorage.setItem('time-hour-mode', '12');
    window.localStorage.setItem('time-language', 'en');

    expect(getPreferences()).toMatchObject({ visual: { themeMode: 'evening' }, display: { hourMode: '12', language: 'en' } });

    const { result } = renderHook(() => usePreferences());
    result.current[1]({ visual: { desktopMode: true } });

    expect(JSON.parse(window.localStorage.getItem(preferenceKey))).toMatchObject({ version: defaultPreferences.version, visual: { desktopMode: true } });
  });
});
