import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getWeatherInfo } from '../clockConfig.js';

const REFRESH_THROTTLE_MS = 30 * 1000;
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

function getEmptyWeather(status = 'idle', labelKey = 'weatherIdle') {
  return { status, labelKey, temp: null, feelsLike: null, precipitation: null, updatedAt: null, atmosphere: 'clear' };
}

function hasCoordinates(location) {
  return Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);
}

function getCurrentPrecipitation(data) {
  const currentTime = data.current?.time;
  const hourlyTimes = data.hourly?.time;
  const probabilities = data.hourly?.precipitation_probability;
  if (!currentTime || !Array.isArray(hourlyTimes) || !Array.isArray(probabilities)) return null;

  const currentHour = currentTime.slice(0, 13);
  const index = hourlyTimes.findIndex((time) => time === currentTime || time.slice(0, 13) === currentHour);
  return index >= 0 ? probabilities[index] ?? null : null;
}

export async function findWeatherLocation(query) {
  const params = new URLSearchParams({ name: query.trim(), count: '1', language: 'en', format: 'json' });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!response.ok) throw new Error('Location search failed');

  const result = (await response.json()).results?.[0];
  if (!result) return null;

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
  };
}

export function useWeather(enabled, isOnline, manualLocation = null) {
  const [refreshToken, setRefreshToken] = useState(0);
  const [weather, setWeather] = useState(getEmptyWeather());
  const lastRequestAtRef = useRef(0);
  const lastReadyWeatherRef = useRef(null);
  const lastLocationKeyRef = useRef('');
  const location = hasCoordinates(manualLocation) ? manualLocation : null;
  const locationKey = location ? `${location.latitude},${location.longitude}` : 'browser';

  useEffect(() => {
    if (!enabled) {
      window.setTimeout(() => setWeather(getEmptyWeather()), 0);
      return undefined;
    }

    if (!isOnline) {
      lastRequestAtRef.current = 0;
      window.setTimeout(() => setWeather(getEmptyWeather('offline', 'offlineMode')), 0);
      return undefined;
    }

    if (!location && !navigator.geolocation) {
      window.setTimeout(() => setWeather(getEmptyWeather('unavailable', 'weatherUnavailable')), 0);
      return undefined;
    }

    if (lastLocationKeyRef.current !== locationKey) {
      lastLocationKeyRef.current = locationKey;
      lastRequestAtRef.current = 0;
      lastReadyWeatherRef.current = null;
    }

    if (Date.now() - lastRequestAtRef.current < REFRESH_THROTTLE_MS && lastReadyWeatherRef.current) {
      window.setTimeout(() => setWeather(lastReadyWeatherRef.current), 0);
      return undefined;
    }

    let cancelled = false;
    const controller = new AbortController();
    lastRequestAtRef.current = Date.now();
    const loadingTimer = window.setTimeout(() => setWeather((current) => ({ ...current, status: 'loading', labelKey: 'weatherLoading' })), 0);

    const requestWeather = async (coords) => {
      if (cancelled) return;
      try {
        window.clearTimeout(loadingTimer);
        const params = new URLSearchParams({
          latitude: String(coords.latitude),
          longitude: String(coords.longitude),
          current: 'temperature_2m,apparent_temperature,precipitation,weather_code',
          hourly: 'precipitation_probability',
          forecast_days: '1',
          timezone: 'auto',
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Weather request failed');
        const data = await response.json();
        if (cancelled) return;

        const info = getWeatherInfo(data.current?.weather_code);
        const nextWeather = {
          status: 'ready',
          labelKey: info.labelKey,
          temp: Math.round(data.current?.temperature_2m),
          feelsLike: Math.round(data.current?.apparent_temperature),
          precipitation: getCurrentPrecipitation(data),
          updatedAt: new Date(),
          atmosphere: info.atmosphere,
        };
        lastReadyWeatherRef.current = nextWeather;
        setWeather(nextWeather);
      } catch (error) {
        window.clearTimeout(loadingTimer);
        if (error.name === 'AbortError') return;
        if (!cancelled) setWeather(getEmptyWeather('error', 'weatherOffline'));
      }
    };

    if (location) {
      requestWeather(location);
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => requestWeather(coords),
        (error) => {
          window.clearTimeout(loadingTimer);
          if (cancelled) return;
          setWeather(error.code === 1
            ? getEmptyWeather('denied', 'locationDenied')
            : getEmptyWeather('locationError', 'locationFailed'));
        },
        { maximumAge: 15 * 60 * 1000, timeout: 8000 },
      );
    }

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(loadingTimer);
    };
  }, [enabled, isOnline, location, locationKey, refreshToken]);

  useEffect(() => {
    if (!enabled || !isOnline) return undefined;

    const interval = window.setInterval(() => {
      setRefreshToken((value) => value + 1);
    }, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [enabled, isOnline]);

  const refresh = useCallback(() => {
    if (Date.now() - lastRequestAtRef.current < REFRESH_THROTTLE_MS && lastReadyWeatherRef.current) return;
    setRefreshToken((value) => value + 1);
  }, []);

  return useMemo(() => ({ ...weather, refresh }), [refresh, weather]);
}
