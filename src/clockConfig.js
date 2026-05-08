export const numberFormat = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 2,
});

export const themeOptions = ['auto', 'morning', 'day', 'evening', 'night'];
export const languageOptions = ['zh', 'en'];
export const intensityOptions = ['calm', 'normal', 'vivid'];
export const dateFormatOptions = ['full', 'compact', 'weekday', 'hidden'];
export const auroraMotionOptions = ['dynamic', 'static'];
export const defaultCityIds = ['tokyo', 'london', 'new-york'];

export const copy = {
  zh: {
    appLabel: 'Aurora Clock｜极光时钟',
    controls: '时钟控制',
    themeMode: '主题模式',
    themeDescription: '选择自动日夜主题，或固定一个你喜欢的时间氛围。',
    themeLabels: { auto: '自动', morning: '清晨', day: '白天', evening: '傍晚', night: '夜晚' },
    timeLabels: { hours: '小时', minutes: '分钟', seconds: '秒' },
    title: 'Aurora Clock｜极光时钟',
    live: '实时',
    toggleHourMode: '切换 12 或 24 小时制',
    toggleFullscreen: '切换全屏',
    fullscreen: '全屏',
    worldClocks: '世界时钟',
    worldCities: '世界城市',
    worldDescription: '选择要显示在主时钟下方的城市。',
    showWorldClocks: '显示世界时钟',
    hideWorldClocks: '隐藏世界时钟',
    language: '语言',
    settings: '设置',
    enableWeather: '开启天气氛围',
    retryWeather: '重试天气',
    weatherHint: '允许定位后，可根据本地天气微调背景氛围。',
    weatherLoading: '正在获取天气...',
    installApp: '安装为桌面时钟',
    installUnavailable: '当前浏览器暂不支持安装提示',
    installInstalled: '已安装',
    installAvailable: '可安装',
    installUnsupported: '不支持安装',
    dismiss: '稍后',
    updateReady: '新版本已就绪，刷新更新',
    refresh: '刷新',
    desktopMode: '桌面模式',
    disableWeather: '关闭天气氛围',
    offlineMode: '离线模式',
    offlineWeather: '离线模式 · 天气暂停',
    weatherFallback: '天气',
    weatherIdle: '本地氛围',
    weatherUnavailable: '天气不可用',
    weatherOffline: '天气离线',
    locationDenied: '定位关闭',
    shortcuts: '快捷键：F 全屏 · T 主题 · L 语言 · H 小时制 · W 世界时钟',
    intensity: '背景强度',
    intensityDescription: '控制极光的亮度、运动和存在感。',
    auroraMotion: '极光动态',
    auroraMotionLabels: { dynamic: '动态', static: '静态' },
    appearance: '外观',
    appearanceDescription: '调整桌面模式和视觉呈现。',
    time: '时间',
    timeDescription: '控制小时制、全屏和世界时钟显示。',
    dateFormat: '日期格式',
    dateFormatLabels: { full: '完整', compact: '简洁', weekday: '星期', hidden: '隐藏' },
    help: '帮助',
    shortcutHelp: '快捷键帮助',
    shortcutRows: [
      ['F', '全屏'],
      ['T', '切换主题'],
      ['L', '切换语言'],
      ['H', '小时制'],
      ['W', '世界时钟'],
      ['Esc', '关闭面板'],
    ],
    app: '应用',
    appDescription: '桌面安装和应用级操作。',
    intensityLabels: { calm: '柔和', normal: '标准', vivid: '鲜明' },
    weatherLabels: { clear: '晴朗', cloudy: '多云', fog: '有雾', rain: '有雨', snow: '有雪', storm: '雷雨' },
    toast: {
      theme: '已切换到',
      intensity: '背景强度',
      weatherOn: '天气氛围已开启',
      weatherOff: '天气氛围已关闭',
      desktopOn: '桌面模式已开启',
      desktopOff: '桌面模式已关闭',
      language: '语言已切换',
      hour: '小时制已切换',
      world: '世界时钟已更新',
      aurora: '极光动态',
    },
  },
  en: {
    appLabel: 'Aurora Clock',
    controls: 'Clock controls',
    themeMode: 'Theme mode',
    themeDescription: 'Use automatic day phases or pin a favorite atmosphere.',
    themeLabels: { auto: 'Auto', morning: 'Morning', day: 'Day', evening: 'Evening', night: 'Night' },
    timeLabels: { hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
    title: 'Aurora Clock',
    live: 'Live',
    toggleHourMode: 'Toggle 12 or 24 hour time',
    toggleFullscreen: 'Toggle fullscreen',
    fullscreen: 'Full',
    worldClocks: 'World clocks',
    worldCities: 'World cities',
    worldDescription: 'Choose which cities appear below the main clock.',
    showWorldClocks: 'Show world clocks',
    hideWorldClocks: 'Hide world clocks',
    language: 'Language',
    settings: 'Settings',
    enableWeather: 'Enable weather atmosphere',
    retryWeather: 'Retry weather',
    weatherHint: 'Allow location to tune the background with local weather.',
    weatherLoading: 'Fetching weather...',
    installApp: 'Install desktop clock',
    installUnavailable: 'Install prompt is not available in this browser',
    installInstalled: 'Installed',
    installAvailable: 'Installable',
    installUnsupported: 'Install unsupported',
    dismiss: 'Later',
    updateReady: 'New version is ready. Refresh to update',
    refresh: 'Refresh',
    desktopMode: 'Desktop mode',
    disableWeather: 'Disable weather atmosphere',
    offlineMode: 'Offline mode',
    offlineWeather: 'Offline mode · Weather paused',
    weatherFallback: 'Weather',
    weatherIdle: 'Local atmosphere',
    weatherUnavailable: 'Weather unavailable',
    weatherOffline: 'Weather offline',
    locationDenied: 'Location off',
    shortcuts: 'Shortcuts: F Fullscreen · T Theme · L Language · H Hour mode · W World clocks',
    intensity: 'Background intensity',
    intensityDescription: 'Controls aurora brightness, motion, and presence.',
    auroraMotion: 'Aurora motion',
    auroraMotionLabels: { dynamic: 'Dynamic', static: 'Static' },
    appearance: 'Appearance',
    appearanceDescription: 'Tune desktop mode and visual presentation.',
    time: 'Time',
    timeDescription: 'Control hour mode, fullscreen, and world clocks.',
    dateFormat: 'Date format',
    dateFormatLabels: { full: 'Full', compact: 'Compact', weekday: 'Weekday', hidden: 'Hidden' },
    help: 'Help',
    shortcutHelp: 'Shortcut help',
    shortcutRows: [
      ['F', 'Fullscreen'],
      ['T', 'Theme'],
      ['L', 'Language'],
      ['H', 'Hour mode'],
      ['W', 'World clocks'],
      ['Esc', 'Close panel'],
    ],
    app: 'App',
    appDescription: 'Desktop install and app-level actions.',
    intensityLabels: { calm: 'Calm', normal: 'Normal', vivid: 'Vivid' },
    weatherLabels: { clear: 'Clear', cloudy: 'Cloudy', fog: 'Fog', rain: 'Rain', snow: 'Snow', storm: 'Storm' },
    toast: {
      theme: 'Switched to',
      intensity: 'Background intensity',
      weatherOn: 'Weather atmosphere enabled',
      weatherOff: 'Weather atmosphere disabled',
      desktopOn: 'Desktop mode enabled',
      desktopOff: 'Desktop mode disabled',
      language: 'Language switched',
      hour: 'Hour mode switched',
      world: 'World clocks updated',
      aurora: 'Aurora motion',
    },
  },
};

export const worldClocks = [
  { id: 'beijing', city: { zh: '北京', en: 'Beijing' }, timeZone: 'Asia/Shanghai' },
  { id: 'tokyo', city: { zh: '东京', en: 'Tokyo' }, timeZone: 'Asia/Tokyo' },
  { id: 'london', city: { zh: '伦敦', en: 'London' }, timeZone: 'Europe/London' },
  { id: 'new-york', city: { zh: '纽约', en: 'New York' }, timeZone: 'America/New_York' },
  { id: 'los-angeles', city: { zh: '洛杉矶', en: 'Los Angeles' }, timeZone: 'America/Los_Angeles' },
  { id: 'paris', city: { zh: '巴黎', en: 'Paris' }, timeZone: 'Europe/Paris' },
  { id: 'sydney', city: { zh: '悉尼', en: 'Sydney' }, timeZone: 'Australia/Sydney' },
  { id: 'singapore', city: { zh: '新加坡', en: 'Singapore' }, timeZone: 'Asia/Singapore' },
];

export const weatherCodeMap = [
  { codes: [0, 1], labelKey: 'clear', atmosphere: 'clear' },
  { codes: [2, 3], labelKey: 'cloudy', atmosphere: 'cloudy' },
  { codes: [45, 48], labelKey: 'fog', atmosphere: 'fog' },
  { codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], labelKey: 'rain', atmosphere: 'rain' },
  { codes: [71, 73, 75, 77, 85, 86], labelKey: 'snow', atmosphere: 'snow' },
  { codes: [95, 96, 99], labelKey: 'storm', atmosphere: 'rain' },
];

export const glowColors = {
  morning: ['#ffd69a', '#7ee8ff', '#ba8bff'],
  day: ['#7ee8ff', '#b7dbff', '#67ffe4'],
  evening: ['#ff8c66', '#b66cff', '#67ffe4'],
  night: ['#67ffe4', '#b7dbff', '#8b5cf6'],
};

export const auroraBaseConfig = {
  morning: { colorStops: ['#ffd69a', '#7ee8ff', '#ba8bff'], amplitude: 1.25, blend: 0.72 },
  day: { colorStops: ['#7ee8ff', '#b7dbff', '#67ffe4'], amplitude: 1.05, blend: 0.66 },
  evening: { colorStops: ['#ff8c66', '#b66cff', '#67ffe4'], amplitude: 1.35, blend: 0.74 },
  night: { colorStops: ['#67ffe4', '#b7dbff', '#8b5cf6'], amplitude: 1.45, blend: 0.78 },
};

export const intensityConfig = {
  calm: { multiplier: 0.72, speed: 0.34 },
  normal: { multiplier: 1, speed: 0.5 },
  vivid: { multiplier: 1.22, speed: 0.64 },
};

export function getDayPhase(hour) {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

export function getNextThemeMode(current) {
  const index = themeOptions.indexOf(current);
  return themeOptions[(index + 1) % themeOptions.length];
}

export function getNextLanguage(current) {
  return current === 'zh' ? 'en' : 'zh';
}

export function getWeatherInfo(code) {
  return weatherCodeMap.find((item) => item.codes.includes(code)) ?? { labelKey: 'weatherFallback', atmosphere: 'clear' };
}

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
    return;
  }

  document.exitFullscreen?.();
}
