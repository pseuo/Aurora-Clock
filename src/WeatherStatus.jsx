import { CloudFog, CloudRain, CloudSnow, CloudSun, LoaderCircle, MapPinOff, WifiOff } from 'lucide-react';

function getWeatherIcon(status, atmosphere, isOnline) {
  if (!isOnline || status === 'offline') return <WifiOff size={17} />;
  if (status === 'loading') return <LoaderCircle className="weather-spin" size={17} />;
  if (status === 'denied') return <MapPinOff size={17} />;
  if (atmosphere === 'rain') return <CloudRain size={17} />;
  if (atmosphere === 'snow') return <CloudSnow size={17} />;
  if (atmosphere === 'fog' || atmosphere === 'cloudy') return <CloudFog size={17} />;
  return <CloudSun size={17} />;
}

export function WeatherStatus({ enabled, isOnline, labels, weather }) {
  const weatherLabel = !isOnline ? labels.offlineWeather : labels.weatherLabels[weather.labelKey] ?? labels[weather.labelKey] ?? labels.weatherFallback;
  const text = enabled && weather.temp != null ? `${weatherLabel} ${weather.temp}°C` : weatherLabel;

  return (
    <span className={`weather-status weather-status-${weather.status}`} aria-live="polite">
      {getWeatherIcon(weather.status, weather.atmosphere, isOnline)}
      {text}
    </span>
  );
}
