import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { findWeatherLocation, useWeather } from "./useWeather.js";

describe("weather state", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("reports offline without requesting location", async () => {
    const { result } = renderHook(() => useWeather(true, false));

    await waitFor(() => expect(result.current.status).toBe("offline"));
    expect(result.current.labelKey).toBe("offlineMode");
  });

  it("maps a successful weather response to a ready state", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 35.7, longitude: 139.7 } }),
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            time: "2026-08-17T03:00",
            temperature_2m: 24.6,
            apparent_temperature: 25.2,
            weather_code: 63,
          },
          hourly: {
            time: ["2026-08-17T03:00"],
            precipitation_probability: [42],
          },
        }),
      }),
    );

    const { result } = renderHook(() => useWeather(true, true));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current).toMatchObject({
      labelKey: "rain",
      temp: 25,
      feelsLike: 25,
      atmosphere: "rain",
    });
    expect(result.current.precipitation).toBe(42);
    expect(new URL(fetch.mock.calls[0][0]).searchParams.get("latitude")).toBe(
      "35.7",
    );
    expect(new URL(fetch.mock.calls[0][0]).searchParams.get("longitude")).toBe(
      "139.7",
    );
    expect(new URL(fetch.mock.calls[0][0]).searchParams.get("timezone")).toBe(
      "auto",
    );
  });

  it("selects precipitation using the forecast response time", async () => {
    vi.spyOn(Date.prototype, "getHours").mockReturnValue(15);
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 35.7, longitude: 139.7 } }),
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            time: "2026-08-17T03:00",
            temperature_2m: 24,
            apparent_temperature: 24,
            weather_code: 0,
          },
          hourly: {
            time: ["2026-08-17T03:00", "2026-08-17T04:00"],
            precipitation_probability: [87, 12],
          },
        }),
      }),
    );

    const { result } = renderHook(() => useWeather(true, true));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.precipitation).toBe(87);
  });

  it("refreshes weather periodically while enabled and online", async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 35.7, longitude: 139.7 } }),
      },
    });
    const fetchWeather = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: "2026-08-17T03:00",
          temperature_2m: 24,
          apparent_temperature: 24,
          weather_code: 0,
        },
        hourly: { time: ["2026-08-17T03:00"], precipitation_probability: [42] },
      }),
    });
    vi.stubGlobal("fetch", fetchWeather);

    renderHook(() => useWeather(true, true));
    expect(fetchWeather).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15 * 60 * 1000);
    });
    expect(fetchWeather).toHaveBeenCalledTimes(2);
  });

  it("reports an error when the weather request fails", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 35.7, longitude: 139.7 } }),
      },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const { result } = renderHook(() => useWeather(true, true));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.labelKey).toBe("weatherOffline");
  });

  it("reports a timeout instead of remaining in a loading state", async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 35.7, longitude: 139.7 } }),
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, { signal }) =>
          new Promise((_resolve, reject) => {
            signal.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      ),
    );

    const { result } = renderHook(() => useWeather(true, true));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });

    expect(result.current).toMatchObject({
      status: "timeout",
      labelKey: "weatherTimeout",
    });
  });

  it("rejects weather responses without required current conditions", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 35.7, longitude: 139.7 } }),
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ current: { temperature_2m: 24 } }),
      }),
    );

    const { result } = renderHook(() => useWeather(true, true));
    await waitFor(() =>
      expect(result.current).toMatchObject({
        status: "invalid",
        labelKey: "weatherInvalid",
      }),
    );
  });

  it("reports a denied location so the interface can offer manual setup", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (_success, failure) => failure({ code: 1 }),
      },
    });

    const { result } = renderHook(() => useWeather(true, true));

    await waitFor(() =>
      expect(result.current).toMatchObject({
        status: "denied",
        labelKey: "locationDenied",
      }),
    );
  });

  it("uses a saved manual location without requesting browser location", async () => {
    const getCurrentPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 20,
            apparent_temperature: 19,
            weather_code: 0,
          },
          hourly: { precipitation_probability: [0] },
        }),
      }),
    );

    const { result } = renderHook(() =>
      useWeather(true, true, {
        latitude: 31.2,
        longitude: 121.5,
        name: "Shanghai",
      }),
    );

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(getCurrentPosition).not.toHaveBeenCalled();
  });

  it("resolves a city into a manual weather location", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              name: "Shanghai",
              admin1: "Shanghai",
              country: "China",
              latitude: 31.2,
              longitude: 121.5,
            },
          ],
        }),
      }),
    );

    await expect(findWeatherLocation("Shanghai")).resolves.toEqual({
      latitude: 31.2,
      longitude: 121.5,
      name: "Shanghai, Shanghai, China",
    });
  });

  it("rejects malformed weather API payloads instead of persisting them", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ name: "Shanghai", latitude: "31.2", longitude: 121.5 }],
        }),
      }),
    );

    await expect(findWeatherLocation("Shanghai")).resolves.toBeNull();
  });
});
