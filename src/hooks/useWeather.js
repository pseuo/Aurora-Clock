import { useEffect, useState } from 'react';
import { getWeatherInfo } from '../clockConfig.js';

export function useWeather(enabled, isOnline) {
  const [weather, setWeather] = useState({ status: 'idle', labelKey: 'weatherIdle', temp: null, atmosphere: 'clear' });

  useEffect(() => {
    if (!enabled) {
      window.setTimeout(() => setWeather({ status: 'idle', labelKey: 'weatherIdle', temp: null, atmosphere: 'clear' }), 0);
      return undefined;
    }

    if (!isOnline) {
      window.setTimeout(() => setWeather({ status: 'offline', labelKey: 'offlineMode', temp: null, atmosphere: 'clear' }), 0);
      return undefined;
    }

    if (!navigator.geolocation) {
      window.setTimeout(() => setWeather({ status: 'unavailable', labelKey: 'weatherUnavailable', temp: null, atmosphere: 'clear' }), 0);
      return undefined;
    }

    let cancelled = false;
    window.setTimeout(() => setWeather((current) => ({ ...current, status: 'loading', labelKey: 'weatherLoading' })), 0);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            latitude: String(coords.latitude),
            longitude: String(coords.longitude),
            current: 'temperature_2m,weather_code',
          });
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
          if (!response.ok) throw new Error('Weather request failed');
          const data = await response.json();
          if (cancelled) return;

          const info = getWeatherInfo(data.current?.weather_code);
          setWeather({
            status: 'ready',
            labelKey: info.labelKey,
            temp: Math.round(data.current?.temperature_2m),
            atmosphere: info.atmosphere,
          });
        } catch {
          if (!cancelled) setWeather({ status: 'error', labelKey: 'weatherOffline', temp: null, atmosphere: 'clear' });
        }
      },
      () => {
        if (!cancelled) setWeather({ status: 'denied', labelKey: 'locationDenied', temp: null, atmosphere: 'clear' });
      },
      { maximumAge: 15 * 60 * 1000, timeout: 8000 },
    );

    return () => {
      cancelled = true;
    };
  }, [enabled, isOnline]);

  return weather;
}
