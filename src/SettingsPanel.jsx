import {
  Check,
  ChevronRight,
  CloudSun,
  Download,
  Expand,
  Gauge,
  Globe2,
  Languages,
  MapPin,
  Monitor,
  Palette,
  Sparkles,
  Timer,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import {
  auroraMotionOptions,
  dateFormatOptions,
  intensityOptions,
  languageOptions,
  displayModeOptions,
  themeOptions,
  toggleFullscreen,
  worldClocks,
  worldClockLimitOptions,
  worldClockPresets,
} from './clockConfig.js';
import { DeskTools } from './DeskTools.jsx';
import { WeatherStatus } from './WeatherStatus.jsx';
import { findWeatherLocation } from './hooks/useWeather.js';

const sectionLayout = 'grid gap-4';
const headingLayout = 'flex items-start justify-between gap-3';
const subheading = 'flex items-center justify-between gap-3 text-xs font-semibold text-dim';
const action = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs font-semibold text-dim transition hover:border-cyan/40 hover:bg-cyan/10 hover:text-white disabled:cursor-wait disabled:opacity-50';
const field = 'min-h-11 min-w-0 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan/60';

function PanelHeader({ badge, description, headingId, icon: Icon, title }) {
  return (
    <div className={headingLayout}>
      <div className="flex items-start gap-3">
        {Icon && <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan"><Icon size={17} strokeWidth={1.8} aria-hidden="true" /></span>}
        <div>
          <span className="text-sm font-semibold text-white" id={headingId}>{title}</span>
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-slate-400">{description}</p>
        </div>
      </div>
      {badge && <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[0.65rem] font-bold text-slate-300">{badge}</span>}
    </div>
  );
}

function SegmentedControl({ ariaLabel, className = '', options, selected, labels, onChange }) {
  return (
    <div className={`grid gap-1 rounded-xl border border-white/10 bg-black/20 p-1 ${options.length === 4 ? 'grid-cols-4' : options.length === 5 ? 'grid-cols-5' : 'grid-cols-3'} ${className}`} role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          className={`min-h-10 rounded-lg px-2 text-xs font-bold transition ${selected === option ? 'bg-cyan/15 text-cyan shadow-inner' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          key={option}
          type="button"
          aria-pressed={selected === option}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

function SectionNav({ activeSection, ariaLabel, sections, onChange }) {
  return (
    <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:grid lg:content-start" aria-label={ariaLabel}>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === activeSection;
        return (
          <button
            className={`flex min-h-11 min-w-max items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition lg:grid lg:min-h-14 lg:grid-cols-[30px_minmax(0,1fr)_15px] lg:gap-2 ${isActive ? 'border-cyan/30 bg-cyan/10 text-white' : 'border-transparent text-slate-400 hover:bg-white/10 hover:text-white'}`}
            key={section.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(section.id)}
          >
            <span className="grid size-8 place-items-center rounded-lg bg-white/5 text-cyan"><Icon size={17} strokeWidth={1.8} aria-hidden="true" /></span>
            <span className="grid min-w-0 gap-0.5">
              <strong className="truncate text-xs font-bold">{section.label}</strong>
              <small className="hidden truncate text-[0.65rem] text-slate-500 lg:block">{section.meta}</small>
            </span>
            <ChevronRight className="hidden opacity-40 lg:block" size={15} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}

export const SettingsPanel = memo(function SettingsPanel({
  isOpen,
  is24Hour,
  isOnline,
  labels,
  onToggle,
  onClose,
  onImportCalendar,
  onImportPreferences,
  onInstall,
  onOpenPlanner,
  onPreferenceChange,
  onResetPreferences,
  performanceMode = false,
  performanceReasons = [],
  pwaInstallStatus,
  preferences,
  weather,
}) {
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [activeSection, setActiveSection] = useState('appearance');
  const [citySearch, setCitySearch] = useState('');
  const [draggingId, setDraggingId] = useState(null);
  const [manualLocationError, setManualLocationError] = useState('');
  const [manualLocationQuery, setManualLocationQuery] = useState('');
  const [isManualLocationSearching, setIsManualLocationSearching] = useState(false);
  const [transferCode, setTransferCode] = useState('');
  const { display, visual, data } = preferences;
  const { dateFormat, displayMode, language, maxWorldClocks, selectedWorldCities, worldClockVisible } = display;
  const { auroraMotion, autoShift, backgroundIntensity, desktopMode, themeMode, wideLayout } = visual;
  const { weatherEnabled } = data;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
      return undefined;
    }

    restoreFocusRef.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : triggerRef.current;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = [...(panelRef.current?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() => panelRef.current?.querySelector('button:not([disabled])')?.focus());
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
    };
  }, [isOpen]);

  const toggleCity = (cityId) => {
    const nextCities = selectedWorldCities.includes(cityId)
      ? selectedWorldCities.filter((id) => id !== cityId)
      : [...selectedWorldCities, cityId];
    onPreferenceChange({ display: { selectedWorldCities: nextCities } }, labels.toast.world);
  };

  const applyPreset = (preset) => {
    onPreferenceChange({ display: { selectedWorldCities: worldClockPresets[preset].slice(0, maxWorldClocks) } }, labels.toast.world);
  };

  const submitManualLocation = async (event) => {
    event.preventDefault();
    const query = manualLocationQuery.trim();
    if (!query) {
      setManualLocationError(labels.manualLocationRequired);
      return;
    }

    setIsManualLocationSearching(true);
    setManualLocationError('');
    try {
      const location = await findWeatherLocation(query);
      if (!location) {
        setManualLocationError(labels.manualLocationNotFound);
        return;
      }

      onPreferenceChange({ data: { weatherLocation: location } }, labels.manualLocationSaved);
      setManualLocationQuery('');
    } catch {
      setManualLocationError(labels.manualLocationFailed);
    } finally {
      setIsManualLocationSearching(false);
    }
  };

  const moveCity = (targetId) => {
    if (!draggingId || draggingId === targetId) return;
    const nextCities = [...selectedWorldCities];
    const fromIndex = nextCities.indexOf(draggingId);
    const targetIndex = nextCities.indexOf(targetId);
    if (fromIndex < 0 || targetIndex < 0) return;
    nextCities.splice(fromIndex, 1);
    nextCities.splice(targetIndex, 0, draggingId);
    setDraggingId(null);
    onPreferenceChange({ display: { selectedWorldCities: nextCities } }, labels.toast.world);
  };

  const exportPreferences = () => {
    const serialized = JSON.stringify(preferences, null, 2);
    setTransferCode(btoa(unescape(encodeURIComponent(serialized))));
    const url = URL.createObjectURL(new Blob([serialized], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aurora-clock-preferences.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'appearance', label: labels.appearance, meta: labels.themeLabels[themeMode], icon: Palette },
    { id: 'time', label: labels.time, meta: is24Hour ? '24H' : '12H', icon: Timer },
    { id: 'world', label: labels.worldClocks, meta: `${selectedWorldCities.length} ${labels.worldCities}`, icon: Globe2 },
    { id: 'weather', label: labels.weatherAtmosphere, meta: weatherEnabled ? labels.weatherEnabled : labels.weatherDisabled, icon: CloudSun },
    { id: 'tools', label: labels.tools, meta: labels.countdown, icon: Wrench },
    { id: 'app', label: labels.app, meta: labels[pwaInstallStatus], icon: Monitor },
  ];

  const renderAppearance = () => (
    <section className={sectionLayout} aria-labelledby="appearance-heading">
      <PanelHeader headingId="appearance-heading" icon={Palette} title={labels.appearance} description={labels.appearanceDescription} />
      {performanceMode && (
        <aside className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-2xl border border-warning/25 bg-warning/5 p-3" aria-label={labels.performance}>
          <span className="grid size-9 place-items-center rounded-xl bg-warning/15 text-warning"><Gauge size={17} aria-hidden="true" /></span>
          <span className="grid gap-1">
            <strong className="text-xs text-white">{labels.performance} · {labels.performanceStatic}</strong>
            <small className="text-xs leading-relaxed text-warning/70">{labels.performanceDescription}</small>
          </span>
          <span className="col-start-2 text-[0.65rem] text-warning/80">{performanceReasons.map((reason) => labels.performanceReasons[reason]).join(' · ')}</span>
        </aside>
      )}
      <div className="grid gap-2">
        <button
          className={`setting-row-button grid min-h-16 grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3 text-left transition ${desktopMode ? 'border-cyan/35 bg-cyan/10' : 'border-white/10 bg-white/[0.04] hover:border-cyan/30 hover:bg-white/[0.07]'}`}
          type="button"
          aria-pressed={desktopMode}
          onClick={() => onPreferenceChange({ visual: { desktopMode: !desktopMode } }, desktopMode ? labels.toast.desktopOff : labels.toast.desktopOn)}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-cyan/10 text-cyan"><Monitor size={17} aria-hidden="true" /></span>
          <span className="grid min-w-0 gap-1"><strong className="text-xs text-white">{labels.desktopMode}</strong><small className="truncate text-[0.68rem] text-slate-500">{labels.appearanceDescription}</small></span>
          <span className="text-[0.68rem] font-bold text-cyan">{desktopMode ? labels.weatherEnabled : labels.weatherDisabled}</span>
        </button>
      </div>

      <div className="grid gap-2">
        <div className={subheading}><span>{labels.themeMode}</span><strong className="text-white">{labels.themeLabels[themeMode]}</strong></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5" role="group" aria-label={labels.themeMode}>
          {themeOptions.map((option) => {
            const isSelected = themeMode === option;
            return (
              <button
                className={`grid min-h-16 gap-2 rounded-2xl border p-2 text-left text-xs font-semibold transition hover:-translate-y-0.5 hover:border-white/30 ${isSelected ? 'border-cyan bg-cyan/10 text-white shadow-lg shadow-cyan/10' : 'border-white/10 bg-white/[0.04] text-slate-300'}`}
                key={option}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onPreferenceChange({ visual: { themeMode: option } }, `${labels.toast.theme} ${labels.themeLabels[option]}`)}
              >
                <span className={`h-6 rounded-lg shadow-inner ${option === 'morning' ? 'bg-gradient-to-r from-amber-200 via-sky-300 to-violet-400' : option === 'day' ? 'bg-gradient-to-r from-sky-300 via-blue-200 to-emerald-300' : option === 'evening' ? 'bg-gradient-to-r from-orange-400 via-violet-400 to-emerald-300' : option === 'night' ? 'bg-gradient-to-r from-cyan via-blue-300 to-violet-500' : 'bg-gradient-to-r from-amber-200 via-sky-300 to-violet-500'}`} />
                <span>{labels.themeLabels[option]}</span>
                {isSelected && <Check size={14} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className={subheading}><span>{labels.intensity}</span><strong className="text-white">{labels.intensityLabels[backgroundIntensity]}</strong></div>
          <SegmentedControl
            ariaLabel={labels.intensity}
            options={intensityOptions}
            selected={backgroundIntensity}
            labels={labels.intensityLabels}
            onChange={(option) => onPreferenceChange({ visual: { backgroundIntensity: option } }, `${labels.toast.intensity}: ${labels.intensityLabels[option]}`)}
          />
        </div>
        <div>
          <div className={subheading}><span>{labels.auroraMotion}</span><strong className="text-white">{labels.auroraMotionLabels[auroraMotion]}</strong></div>
          <SegmentedControl
            ariaLabel={labels.auroraMotion}
            options={auroraMotionOptions}
            selected={auroraMotion}
            labels={labels.auroraMotionLabels}
            onChange={(option) => onPreferenceChange({ visual: { auroraMotion: option } }, `${labels.toast.aurora}: ${labels.auroraMotionLabels[option]}`)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <div className={subheading}><span className="inline-flex items-center gap-1.5"><Languages size={15} aria-hidden="true" />{labels.language}</span><strong className="text-white">{language === 'zh' ? '中文' : 'EN'}</strong></div>
        <SegmentedControl
          ariaLabel={labels.language}
          className="language-switcher"
          options={languageOptions}
          selected={language}
          labels={{ zh: '中文', en: 'English' }}
          onChange={(option) => onPreferenceChange({ display: { language: option } }, labels.toast.language)}
        />
      </div>
      <div className="grid gap-2">
        <div className={subheading}><span>{labels.displayModes}</span><strong className="text-white">{labels.displayModeLabels[displayMode]}</strong></div>
        <SegmentedControl
          ariaLabel={labels.displayModes}
          options={displayModeOptions}
          selected={displayMode}
          labels={labels.displayModeLabels}
          onChange={(option) => onPreferenceChange({ display: { displayMode: option } })}
        />
        <div className="grid grid-cols-2 gap-2">
          <button className={`${action} ${autoShift ? 'border-cyan/40 bg-cyan/10 text-cyan' : ''}`} type="button" aria-pressed={autoShift} onClick={() => onPreferenceChange({ visual: { autoShift: !autoShift } })}>{labels.autoShift}</button>
          <button className={`${action} ${wideLayout ? 'border-cyan/40 bg-cyan/10 text-cyan' : ''}`} type="button" aria-pressed={wideLayout} onClick={() => onPreferenceChange({ visual: { wideLayout: !wideLayout } })}>{labels.wideLayout}</button>
        </div>
      </div>
    </section>
  );

  const renderTime = () => (
    <section className={sectionLayout} aria-labelledby="time-heading">
      <PanelHeader headingId="time-heading" icon={Timer} title={labels.time} description={labels.timeDescription} />
      <div className="grid gap-2 sm:grid-cols-2">
        <button className={`${action} min-h-24 flex-col ${is24Hour ? 'border-cyan/40 bg-cyan/10 text-cyan' : ''}`} type="button" aria-pressed={is24Hour} onClick={() => onPreferenceChange({ display: { hourMode: is24Hour ? '12' : '24' } }, labels.toast.hour)}>
          <span className="font-mono text-2xl font-bold">{is24Hour ? '24H' : '12H'}</span>
          <span>{labels.toggleHourMode}</span>
        </button>
        <button className={`${action} min-h-24 flex-col`} type="button" onClick={toggleFullscreen} aria-label={labels.toggleFullscreen}>
          <Expand size={18} aria-hidden="true" />
          <span>{labels.fullscreen}</span>
        </button>
      </div>
      <div className="grid gap-2">
        <div className={subheading}><span>{labels.dateFormat}</span><strong className="text-white">{labels.dateFormatLabels[dateFormat]}</strong></div>
        <SegmentedControl
          ariaLabel={labels.dateFormat}
          className="date-format-switcher"
          options={dateFormatOptions}
          selected={dateFormat}
          labels={labels.dateFormatLabels}
          onChange={(option) => onPreferenceChange({ display: { dateFormat: option } })}
        />
      </div>
    </section>
  );

  const renderWorld = () => (
    <section className={sectionLayout} aria-labelledby="world-heading">
      <PanelHeader headingId="world-heading" icon={Globe2} badge={String(selectedWorldCities.length)} title={labels.worldCities} description={labels.worldDescription} />
      <button className={`setting-row-button grid min-h-16 grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3 text-left transition ${worldClockVisible ? 'border-cyan/35 bg-cyan/10' : 'border-white/10 bg-white/[0.04] hover:border-cyan/30'}`} type="button" aria-pressed={worldClockVisible} onClick={() => onPreferenceChange({ display: { worldClockVisible: !worldClockVisible } }, labels.toast.world)}>
        <span className="grid size-9 place-items-center rounded-xl bg-cyan/10 text-cyan"><Globe2 size={17} aria-hidden="true" /></span>
        <span className="grid min-w-0 gap-1"><strong className="text-xs text-white">{worldClockVisible ? labels.showWorldClocks : labels.hideWorldClocks}</strong><small className="truncate text-[0.68rem] text-slate-500">{labels.worldDescription}</small></span>
        <span className="text-[0.68rem] font-bold text-cyan">{worldClockVisible ? labels.weatherEnabled : labels.weatherDisabled}</span>
      </button>
      <div className="grid gap-2">
        <div className={subheading}><span>{labels.maxWorldClocks}</span><strong className="text-white">{maxWorldClocks}</strong></div>
        <SegmentedControl
          ariaLabel={labels.maxWorldClocks}
          className="clock-limit-switcher"
          options={worldClockLimitOptions}
          selected={maxWorldClocks}
          labels={Object.fromEntries(worldClockLimitOptions.map((value) => [value, String(value)]))}
          onChange={(option) => onPreferenceChange({ display: { maxWorldClocks: option, selectedWorldCities: selectedWorldCities.slice(0, option) } })}
        />
      </div>
      <div className="grid gap-2">
        <div className={subheading}><span>{labels.commonPresets}</span><strong className="text-white">{labels.dragToSort}</strong></div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(worldClockPresets).map((preset) => <button className={action} key={preset} type="button" onClick={() => applyPreset(preset)}>{preset}</button>)}
        </div>
        <input className={field} type="search" value={citySearch} onChange={(event) => setCitySearch(event.target.value)} placeholder={labels.citySearch} aria-label={labels.citySearch} />
        <div className="grid grid-cols-2 gap-2" role="group" aria-label={labels.worldCities}>
          {worldClocks.filter((clock) => `${clock.city.zh} ${clock.city.en} ${clock.timeZone}`.toLowerCase().includes(citySearch.toLowerCase())).map((clock) => {
            const isSelected = selectedWorldCities.includes(clock.id);
            return (
              <button
                className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-xs font-semibold transition ${isSelected ? 'border-cyan/40 bg-cyan/10 text-white' : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/30 hover:text-white'}`}
                key={clock.id}
                type="button"
                aria-pressed={isSelected}
                draggable={isSelected}
                onDragEnd={() => setDraggingId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDragStart={() => setDraggingId(clock.id)}
                onDrop={() => moveCity(clock.id)}
                onClick={() => toggleCity(clock.id)}
              >
                <span>{clock.city[language]}</span>
                {isSelected && <Check size={14} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        {!worldClocks.some((clock) => `${clock.city.zh} ${clock.city.en} ${clock.timeZone}`.toLowerCase().includes(citySearch.toLowerCase())) && <small>{labels.noCities}</small>}
      </div>
      <button className={`${action} min-h-12 border-cyan/30 bg-gradient-to-r from-cyan/90 to-lime/90 text-night`} type="button" onClick={onOpenPlanner}><Globe2 size={16} aria-hidden="true" />{labels.openMeetingPlanner}</button>
    </section>
  );

  const renderWeather = () => (
    <section className={sectionLayout} aria-labelledby="weather-heading">
      <PanelHeader headingId="weather-heading" icon={CloudSun} badge={weatherEnabled ? labels.weatherEnabled : labels.weatherDisabled} title={labels.weatherAtmosphere} description={labels.weatherDescription} />
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <WeatherStatus announce={false} enabled={weatherEnabled} isOnline={isOnline} labels={labels} weather={weather} onRefresh={weatherEnabled ? weather.refresh : undefined} />
        <span className="text-xs text-slate-500">{weather.status === 'ready' ? labels.weatherLabels[weather.labelKey] ?? labels.weatherFallback : labels[weather.labelKey] ?? labels.weatherIdle}</span>
      </div>
      {weatherEnabled && ['denied', 'unavailable', 'locationError'].includes(weather.status) && (
          <form className="grid gap-3 rounded-2xl border border-warning/25 bg-warning/5 p-3" onSubmit={submitManualLocation}>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-warning"><MapPin size={16} aria-hidden="true" /><span>{labels.manualLocation}</span></div>
          <p className="text-xs leading-relaxed text-warning/70">{labels.manualLocationDescription}</p>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              className={field}
              type="search"
              value={manualLocationQuery}
              onChange={(event) => setManualLocationQuery(event.target.value)}
              placeholder={labels.manualLocationPlaceholder}
              aria-label={labels.manualLocation}
              aria-describedby={manualLocationError ? 'manual-location-error' : undefined}
              disabled={isManualLocationSearching}
            />
            <button className={`${action} border-cyan/30 bg-cyan/90 text-night`} type="submit" disabled={isManualLocationSearching}>{isManualLocationSearching ? labels.weatherLoading : labels.saveManualLocation}</button>
          </div>
          {manualLocationError && <small id="manual-location-error" role="alert">{manualLocationError}</small>}
        </form>
      )}
      <button className={`${action} min-h-12 border-cyan/30 bg-gradient-to-r from-cyan/90 to-lime/90 text-night`} type="button" aria-pressed={weatherEnabled} onClick={() => onPreferenceChange({ data: { weatherEnabled: !weatherEnabled } }, weatherEnabled ? labels.toast.weatherOff : labels.toast.weatherOn)}>
        <Sparkles size={16} aria-hidden="true" />
        {weatherEnabled ? labels.disableWeather : labels.enableWeather}
      </button>
    </section>
  );

  const renderApp = () => (
    <section className={sectionLayout} aria-labelledby="app-heading">
      <PanelHeader headingId="app-heading" icon={Monitor} badge={labels[pwaInstallStatus]} title={labels.app} description={labels.appDescription} />
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-[40px_1fr_auto] sm:items-center">
        <div className="grid size-10 place-items-center rounded-xl bg-cyan/10 text-cyan"><Download size={19} aria-hidden="true" /></div>
        <div className="grid gap-1"><strong className="text-xs text-white">{labels.installApp}</strong><small className="text-[0.68rem] text-slate-500">{labels[pwaInstallStatus]}</small></div>
        <button className={action} type="button" onClick={onInstall}>{labels.installApp}</button>
      </div>
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>{labels.shortcutHelp}</span><kbd className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-slate-400">?</kbd></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {labels.shortcutRows.map(([key, value]) => (
            <div className="flex items-center gap-2 text-[0.68rem] text-slate-400" key={key}><kbd className="min-w-7 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-center font-mono text-white">{key}</kbd><span>{value}</span></div>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        <div className={subheading}><span>{labels.preferences}</span></div>
        <div className="grid gap-2 sm:grid-cols-3">
          <button className={action} type="button" onClick={exportPreferences}><Download size={16} aria-hidden="true" />{labels.exportPreferences}</button>
          <label className={`${action} cursor-pointer`}><Upload size={16} aria-hidden="true" />{labels.importPreferences}<input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            file.text().then((text) => {
              try {
                onImportPreferences?.(JSON.parse(text));
              } catch {
                // Invalid preference files leave the current settings unchanged.
              }
            });
          }} /></label>
          <button className={action} type="button" onClick={onResetPreferences}>{labels.restoreDefaults}</button>
        </div>
        {transferCode && <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-3"><textarea className="min-h-28 rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs text-slate-300" value={transferCode} onChange={(event) => setTransferCode(event.target.value)} aria-label={labels.migrationCode} /><div className="flex flex-wrap gap-2"><button className={action} type="button" onClick={() => navigator.clipboard?.writeText(transferCode)}>{labels.copyCode}</button><button className={action} type="button" onClick={() => { try { onImportPreferences?.(JSON.parse(decodeURIComponent(escape(atob(transferCode))))); } catch { /* The editable code can be corrected before importing. */ } }}>{labels.importPreferences}</button></div></div>}
      </div>
    </section>
  );

  const renderTools = () => (
    <section className={sectionLayout} aria-labelledby="tools-heading">
      <PanelHeader headingId="tools-heading" icon={Wrench} title={labels.tools} description={labels.soundHint} />
      <DeskTools labels={labels} />
      <div className="grid gap-2">
        <div className={subheading}><span>{labels.calendar}</span></div>
        <label className={`${action} min-h-12 cursor-pointer border-cyan/30 bg-gradient-to-r from-cyan/90 to-lime/90 text-night`}><Upload size={16} aria-hidden="true" />{labels.importIcs}<input className="sr-only" type="file" accept=".ics,text/calendar" onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) file.text().then((text) => onImportCalendar?.(text));
        }} /></label>
      </div>
    </section>
  );

  const content = { appearance: renderAppearance, time: renderTime, world: renderWorld, weather: renderWeather, tools: renderTools, app: renderApp }[activeSection]();

  return (
    <>
      {isOpen && <button className="fixed inset-0 z-30 cursor-default bg-black/35 backdrop-blur-sm" type="button" tabIndex="-1" aria-label={labels.settings} onClick={onClose} />}
      <div className="absolute right-5 top-5 z-40 flex max-w-[calc(100%-2.5rem)] flex-col items-end gap-3 max-[520px]:bottom-5 max-[520px]:left-5 max-[520px]:right-auto max-[520px]:top-auto max-[520px]:items-start">
        <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-panel/80 px-3 text-sm font-bold text-white shadow-xl backdrop-blur-xl transition hover:border-cyan/40 hover:bg-cyan/10" type="button" onClick={onToggle} aria-controls="settings-panel" aria-expanded={isOpen} ref={triggerRef}>
          {isOpen ? <X size={16} aria-hidden="true" /> : <Palette size={16} aria-hidden="true" />}
          <span>{labels.settings}</span>
          {performanceMode && <i className="size-2 rounded-full bg-warning shadow-[0_0_14px_rgb(255_201_120_/_0.8)]" title={`${labels.performance}: ${labels.performanceStatic}`} aria-hidden="true" />}
        </button>

        {isOpen && (
          <div className="grid max-h-[min(760px,calc(100dvh-5rem))] w-[min(760px,calc(100vw-2.5rem))] gap-4 overflow-y-auto overscroll-contain rounded-3xl border border-white/12 bg-panel/98 p-4 shadow-2xl shadow-black/60 backdrop-blur-2xl max-[700px]:w-[min(520px,calc(100vw-2rem))] max-[520px]:max-h-[78vh] max-[520px]:w-[calc(100vw-2rem)] max-[520px]:p-3" id="settings-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="settings-panel-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-cyan">{labels.controls}</span>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-white" id="settings-panel-title">{labels.settings}</h2>
              </div>
              <button className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan/40 hover:bg-cyan/10 hover:text-white" data-panel-close type="button" onClick={onClose} aria-label={labels.closeSettings}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/[0.035] p-2" aria-label={labels.controls}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1 text-[0.68rem] text-slate-300"><i className="size-1.5 rounded-full bg-cyan" />{labels.themeLabels[themeMode]}</span>
              <span className="rounded-full bg-white/5 px-2 py-1 text-[0.68rem] text-slate-300">{labels.intensityLabels[backgroundIntensity]}</span>
              <span className="rounded-full bg-white/5 px-2 py-1 text-[0.68rem] text-slate-300">{is24Hour ? '24H' : '12H'}</span>
              <span className="rounded-full bg-white/5 px-2 py-1 text-[0.68rem] text-slate-300">{language === 'zh' ? '中文' : 'EN'}</span>
            </div>

             <div className="grid min-h-0 gap-4 lg:grid-cols-[168px_minmax(0,1fr)]">
              <SectionNav activeSection={activeSection} ariaLabel={labels.controls} sections={sections} onChange={setActiveSection} />
              <div className="min-w-0">{content}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});
