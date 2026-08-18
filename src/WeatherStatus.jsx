import {
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudSun,
  LoaderCircle,
  MapPinOff,
  RefreshCw,
  WifiOff,
} from "lucide-react";

function getWeatherIcon(status, atmosphere, isOnline) {
  if (!isOnline || status === "offline") return <WifiOff size={17} />;
  if (status === "loading")
    return <LoaderCircle className="animate-spin" size={17} />;
  if (
    status === "denied" ||
    status === "unavailable" ||
    status === "locationError"
  )
    return <MapPinOff size={17} />;
  if (atmosphere === "rain") return <CloudRain size={17} />;
  if (atmosphere === "snow") return <CloudSnow size={17} />;
  if (atmosphere === "fog" || atmosphere === "cloudy")
    return <CloudFog size={17} />;
  return <CloudSun size={17} />;
}

export function WeatherStatus({
  announce = true,
  enabled,
  isOnline,
  labels,
  weather,
  onRefresh,
  temperatureUnit = "celsius",
}) {
  const formatTemperature = (value) => {
    const temperature =
      temperatureUnit === "fahrenheit"
        ? Math.round((value * 9) / 5 + 32)
        : value;
    return `${temperature}°${temperatureUnit === "fahrenheit" ? "F" : "C"}`;
  };
  const weatherLabel = !isOnline
    ? labels.offlineWeather
    : (labels.weatherLabels[weather.labelKey] ??
      labels[weather.labelKey] ??
      labels.weatherFallback);
  const text =
    enabled && weather.temp != null
      ? `${weatherLabel} ${formatTemperature(weather.temp)}`
      : weatherLabel;

  return (
    <span
      className="inline-flex min-h-9 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-300"
      aria-live={announce ? "polite" : undefined}
    >
      {getWeatherIcon(weather.status, weather.atmosphere, isOnline)}
      <span>{text}</span>
      {enabled && weather.feelsLike != null && (
        <small className="text-xs text-slate-400">
          {labels.weatherFeels} {formatTemperature(weather.feelsLike)} ·{" "}
          {labels.precipitation} {weather.precipitation ?? 0}%
        </small>
      )}
      {enabled && weather.updatedAt && (
        <small className="text-xs text-slate-400">
          {labels.updatedAt}{" "}
          {new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(weather.updatedAt))}
        </small>
      )}
      {onRefresh && (
        <button
          className="inline-grid size-8 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
          type="button"
          onClick={onRefresh}
          aria-label={labels.refreshWeather}
        >
          <RefreshCw size={14} />
        </button>
      )}
    </span>
  );
}
