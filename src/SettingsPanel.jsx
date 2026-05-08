import { CloudSun, Download, Maximize2, Settings, X } from 'lucide-react';
import { auroraMotionOptions, dateFormatOptions, intensityOptions, languageOptions, themeOptions, toggleFullscreen, worldClocks } from './clockConfig.js';
import { WeatherStatus } from './WeatherStatus.jsx';
import { useEffect, useRef } from 'react';

function PanelHeader({ badge, description, title }) {
  return (
    <div className="panel-heading">
      <div>
        <span className="panel-label">{title}</span>
        <p>{description}</p>
      </div>
      {badge && <span className="panel-badge">{badge}</span>}
    </div>
  );
}

export function SettingsPanel({
  isOpen,
  is24Hour,
  isOnline,
  labels,
  onToggle,
  onClose,
  onInstall,
  onPreferenceChange,
  pwaInstallStatus,
  preferences,
  weather,
}) {
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const { auroraMotion, backgroundIntensity, dateFormat, desktopMode, hourMode, language, selectedWorldCities, themeMode, weatherEnabled, worldClockVisible } = preferences;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };
    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    window.setTimeout(() => panelRef.current?.querySelector('button')?.focus(), 0);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, onClose]);

  const toggleCity = (cityId) => {
    const nextCities = selectedWorldCities.includes(cityId)
      ? selectedWorldCities.filter((id) => id !== cityId)
      : [...selectedWorldCities, cityId];
    onPreferenceChange({ selectedWorldCities: nextCities }, labels.toast.world);
  };

  return (
    <div className="settings-shell" aria-label={labels.controls}>
      <button className="settings-trigger" type="button" onClick={onToggle} aria-expanded={isOpen} ref={triggerRef}>
        {isOpen ? <X size={16} /> : <Settings size={16} />}
        <span>{labels.settings}</span>
      </button>

      {isOpen && (
        <div className="settings-panel" ref={panelRef} role="dialog" aria-modal="false" aria-label={labels.settings}>
          <div className="control-summary">
            <span>{labels.themeLabels[themeMode]}</span>
            <span>{labels.intensityLabels[backgroundIntensity]}</span>
            <span>{hourMode}</span>
            <span>{language === 'zh' ? '中文' : 'EN'}</span>
          </div>

          <div className="panel-section panel-card">
            <PanelHeader badge={desktopMode ? 'ON' : 'OFF'} description={labels.appearanceDescription} title={labels.appearance} />
            <button className={`panel-action ${desktopMode ? 'is-active' : ''}`} type="button" onClick={() => onPreferenceChange({ desktopMode: !desktopMode }, desktopMode ? labels.toast.desktopOff : labels.toast.desktopOn)}>
              {labels.desktopMode}
            </button>
          </div>

          <div className="panel-section panel-card">
            <PanelHeader badge={labels.themeLabels[themeMode]} description={labels.themeDescription} title={labels.themeMode} />
            <div className="theme-preview-grid" aria-label={labels.themeMode}>
              {themeOptions.map((option) => (
                <button className={`theme-preview theme-preview-${option} ${themeMode === option ? 'is-active' : ''}`} key={option} type="button" onClick={() => onPreferenceChange({ themeMode: option }, `${labels.toast.theme} ${labels.themeLabels[option]}`)}>
                  <span className="theme-swatch" />
                  {labels.themeLabels[option]}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section panel-card">
            <PanelHeader badge={labels.intensityLabels[backgroundIntensity]} description={labels.intensityDescription} title={labels.intensity} />
            <div className="segmented-slider intensity-switcher" aria-label={labels.intensity}>
              {intensityOptions.map((option) => (
                <button className={backgroundIntensity === option ? 'is-active' : ''} key={option} type="button" onClick={() => onPreferenceChange({ backgroundIntensity: option }, `${labels.toast.intensity}: ${labels.intensityLabels[option]}`)}>
                  {labels.intensityLabels[option]}
                </button>
              ))}
            </div>
            <div className="compact-control">
              <span className="panel-label">{labels.auroraMotion}</span>
              <div className="segmented-slider" aria-label={labels.auroraMotion}>
                {auroraMotionOptions.map((option) => (
                  <button className={auroraMotion === option ? 'is-active' : ''} key={option} type="button" onClick={() => onPreferenceChange({ auroraMotion: option }, `${labels.toast.aurora}: ${labels.auroraMotionLabels[option]}`)}>
                    {labels.auroraMotionLabels[option]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-section panel-card app-panel">
            <div className="panel-span">
              <PanelHeader description={labels.timeDescription} title={labels.time} />
            </div>
            <button className="panel-action" type="button" onClick={() => onPreferenceChange({ hourMode: is24Hour ? '12' : '24' }, labels.toast.hour)} aria-label={labels.toggleHourMode}>
              {is24Hour ? '24H' : '12H'}
            </button>
            <button className="panel-action" type="button" onClick={() => onPreferenceChange({ worldClockVisible: !worldClockVisible }, labels.toast.world)}>
              {worldClockVisible ? labels.hideWorldClocks : labels.showWorldClocks}
            </button>
            <button className="panel-action" type="button" onClick={toggleFullscreen} aria-label={labels.toggleFullscreen}>
              <Maximize2 size={15} />
              {labels.fullscreen}
            </button>
            <div className="panel-span compact-control">
              <span className="panel-label">{labels.dateFormat}</span>
              <div className="segmented-slider date-format-switcher" aria-label={labels.dateFormat}>
                {dateFormatOptions.map((option) => (
                  <button className={dateFormat === option ? 'is-active' : ''} key={option} type="button" onClick={() => onPreferenceChange({ dateFormat: option })}>
                    {labels.dateFormatLabels[option]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-section panel-card">
            <PanelHeader badge={language === 'zh' ? '中文' : 'EN'} description={labels.language} title={labels.language} />
            <div className="control-group language-switcher" aria-label={labels.language}>
              {languageOptions.map((option) => (
                <button className={language === option ? 'is-active' : ''} key={option} type="button" onClick={() => onPreferenceChange({ language: option }, labels.toast.language)}>
                  {option === 'zh' ? '中' : 'EN'}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section panel-card">
            <PanelHeader badge={String(selectedWorldCities.length)} description={labels.worldDescription} title={labels.worldCities} />
            <div className="city-picker">
              {worldClocks.map((clock) => (
                <button className={selectedWorldCities.includes(clock.id) ? 'is-active' : ''} key={clock.id} type="button" onClick={() => toggleCity(clock.id)}>
                  {clock.city[language]}
                </button>
              ))}
            </div>
          </div>

          <div className={`weather-consent weather-consent-${weather.status} panel-card`}>
            <CloudSun size={17} />
            <span>{labels.weatherHint}</span>
            <WeatherStatus enabled={weatherEnabled} isOnline={isOnline} labels={labels} weather={weather} />
            <button type="button" onClick={() => onPreferenceChange({ weatherEnabled: !weatherEnabled }, weatherEnabled ? labels.toast.weatherOff : labels.toast.weatherOn)}>
              {weatherEnabled ? labels.disableWeather : weather.status === 'denied' || weather.status === 'error' || weather.status === 'offline' ? labels.retryWeather : labels.enableWeather}
            </button>
          </div>

          <div className="panel-section panel-grid panel-card time-panel">
            <div className="panel-span">
              <PanelHeader badge={labels[pwaInstallStatus]} description={labels.appDescription} title={labels.app} />
            </div>
            <button className="panel-action" type="button" onClick={onInstall}>
              <Download size={15} />
              {labels.installApp}
            </button>
          </div>

          <div className="shortcut-hint">
            <strong>{labels.shortcutHelp}</strong>
            <div className="shortcut-grid compact">
              {labels.shortcutRows.map(([key, value]) => (
                <div key={key}>
                  <kbd>{key}</kbd>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
