import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  defaultPreferences,
  getPreferences,
  normalizePreferences,
  preferenceKey,
  usePreferences,
} from "./usePreferences.js";

describe("preference migration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("migrates the flat v3 preference schema to grouped preferences", () => {
    const preferences = normalizePreferences({
      version: 3,
      hourMode: "12",
      language: "en",
      themeMode: "night",
      weatherEnabled: true,
      selectedWorldCities: ["tokyo"],
    });

    expect(preferences).toMatchObject({
      version: defaultPreferences.version,
      display: {
        hourMode: "12",
        language: "en",
        selectedWorldCities: ["tokyo"],
      },
      visual: { themeMode: "night" },
      data: { weatherEnabled: true },
    });
  });

  it("falls back to safe defaults and filters malformed grouped values", () => {
    const preferences = normalizePreferences({
      version: 5,
      display: {
        hourMode: 12,
        language: "fr",
        dateFormat: "invalid",
        worldClockVisible: "false",
        selectedWorldCities: ["tokyo", "unknown", 42, "tokyo"],
        maxWorldClocks: "10",
        displayMode: null,
      },
      visual: {
        themeMode: "invalid",
        backgroundIntensity: false,
        auroraMotion: "invalid",
        desktopMode: "true",
        autoShift: null,
        wideLayout: 1,
      },
      data: {
        weatherEnabled: "true",
        weatherLocation: { latitude: "31.2", longitude: 181, name: 42 },
      },
    });

    expect(preferences).toMatchObject({
      display: {
        ...defaultPreferences.display,
        selectedWorldCities: ["tokyo"],
      },
      visual: defaultPreferences.visual,
      data: defaultPreferences.data,
    });
  });

  it("keeps valid grouped values including a weather location", () => {
    const preferences = normalizePreferences({
      version: 5,
      display: { hourMode: "12", selectedWorldCities: [] },
      visual: { themeMode: "night", wideLayout: true },
      data: {
        alarms: [{ id: "alarm-1", time: "09:00", addedAt: 1 }],
        weatherEnabled: true,
        weatherLocation: { latitude: 31.2, longitude: 121.5, name: "Shanghai" },
      },
    });

    expect(preferences).toMatchObject({
      display: { hourMode: "12", selectedWorldCities: [] },
      visual: { themeMode: "night", wideLayout: true },
      data: {
        alarms: [{ id: "alarm-1", time: "09:00", addedAt: 1 }],
        weatherEnabled: true,
        weatherLocation: { latitude: 31.2, longitude: 121.5, name: "Shanghai" },
      },
    });
  });

  it("keeps a running countdown's end time, pause state, and mode", () => {
    const preferences = normalizePreferences({
      version: 6,
      data: {
        countdown: {
          endsAt: 1_768_137_600_000,
          mode: "pomodoro",
          paused: false,
          remainingSeconds: 25 * 60,
        },
      },
    });

    expect(preferences.data.countdown).toEqual({
      endsAt: 1_768_137_600_000,
      mode: "pomodoro",
      paused: false,
      remainingSeconds: 25 * 60,
    });
  });

  it("migrates legacy alarms and keeps valid extended reminder options", () => {
    const preferences = normalizePreferences({
      version: 7,
      display: {
        language: "ja",
        locale: "ja-JP",
        temperatureUnit: "fahrenheit",
      },
      data: {
        alarms: [
          { id: "legacy", time: "09:00", addedAt: 1 },
          {
            id: "one-time",
            name: "Planning",
            time: "10:30",
            repeat: "once",
            date: "2026-08-20",
            addedAt: 2,
            advanceMinutes: 15,
            snoozeMinutes: 5,
          },
          { id: "invalid", time: "10:00", repeat: "once", addedAt: 3 },
        ],
      },
    });

    expect(preferences.display).toMatchObject({
      language: "ja",
      locale: "ja-JP",
      temperatureUnit: "fahrenheit",
    });
    expect(preferences.data.alarms).toEqual([
      expect.objectContaining({
        id: "legacy",
        repeat: "daily",
        snoozeMinutes: 10,
      }),
      expect.objectContaining({
        id: "one-time",
        date: "2026-08-20",
        advanceMinutes: 15,
        snoozeMinutes: 5,
      }),
    ]);
  });

  it("does not let malformed stored JSON reach the clock preferences", () => {
    window.localStorage.setItem(
      preferenceKey,
      JSON.stringify({
        version: defaultPreferences.version,
        display: null,
        visual: { themeMode: {} },
        data: { weatherEnabled: [] },
      }),
    );

    expect(getPreferences()).toEqual(defaultPreferences);
  });

  it("imports legacy localStorage keys and persists changes", () => {
    window.localStorage.setItem("time-theme-mode", "evening");
    window.localStorage.setItem("time-hour-mode", "12");
    window.localStorage.setItem("time-language", "en");

    expect(getPreferences()).toMatchObject({
      visual: { themeMode: "evening" },
      display: { hourMode: "12", language: "en" },
    });

    const { result } = renderHook(() => usePreferences());
    result.current[1]({ visual: { desktopMode: true } });

    expect(
      JSON.parse(window.localStorage.getItem(preferenceKey)),
    ).toMatchObject({
      version: defaultPreferences.version,
      visual: { desktopMode: true },
    });
  });
});
