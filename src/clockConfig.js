export const numberFormat = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 2,
});

export const themeOptions = ['auto', 'morning', 'day', 'evening', 'night'];
export const languageOptions = ['zh', 'en'];
export const intensityOptions = ['calm', 'normal', 'vivid'];
export const dateFormatOptions = ['full', 'compact', 'weekday', 'hidden'];
export const auroraMotionOptions = ['dynamic', 'static'];
export const defaultCityIds = ['tokyo', 'london', 'new-york'];
export const worldClockLimitOptions = [3, 4, 5, 6, 8, 10];
export const displayModeOptions = ['balanced', 'black', 'large'];
export const worldClockPresets = {
  workday: ['beijing', 'singapore', 'london', 'new-york'],
  asia: ['beijing', 'tokyo', 'singapore', 'sydney'],
  travel: ['new-york', 'london', 'paris', 'tokyo', 'sydney'],
};

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
    closeSettings: '关闭设置',
    enableWeather: '开启天气氛围',
    retryWeather: '重试天气',
    weatherAtmosphere: '天气氛围',
    weatherDescription: '仅在成功获取本地天气后叠加背景效果。',
    weatherEnabled: '已开启',
    weatherDisabled: '已关闭',
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
    locationFailed: '定位失败',
    manualLocation: '手动设置城市',
    manualLocationDescription: '定位不可用时，输入城市以获取天气。',
    manualLocationPlaceholder: '例如：上海',
    saveManualLocation: '使用此城市',
    manualLocationRequired: '请输入城市名称',
    manualLocationNotFound: '未找到该城市，请检查名称后重试',
    manualLocationFailed: '暂时无法查找城市，请稍后重试',
    manualLocationSaved: '已切换到手动城市',
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
     performance: '性能仪表',
     performanceDescription: '设备或系统偏好触发了性能提示。选择动态仍可恢复动画，静态模式更省资源。',
     performanceReasons: {
       compactScreen: '小屏布局',
       reducedMotion: '系统减少动态效果',
       saveData: '已开启省流量模式',
       lowMemory: '设备内存较低',
       lowCpu: '设备线程较少',
     },
     performanceStatic: '极光已静态化',
     performanceNormal: '动态效果正常',
     today: '今天',
     yesterday: '昨日',
     tomorrow: '明日',
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
    meetingPlanner: '跨时区会议', meetingDescription: '比较两个城市的当地时间与工作时间重叠区。',
    openMeetingPlanner: '打开会议规划器', closeMeetingPlanner: '关闭会议规划器', citySearch: '搜索城市或 IANA 时区', commonPresets: '常用预设',
    maxWorldClocks: '最多显示数量', dragToSort: '拖拽排序', noCities: '没有匹配城市',
    tools: '桌面工具', alarm: '闹钟', countdown: '倒计时', pomodoro: '番茄钟', start: '开始', stop: '停止', reset: '重置',
    alarmTime: '提醒时间', addAlarm: '添加本地提醒', noAlarms: '暂无提醒', soundHint: '提醒仅在当前页面打开时播放声音。',
    calendar: '日历事件', importIcs: '导入 ICS', noEvent: '导入 ICS 后显示下一个事件', eventIn: '距离事件',
    displayModes: '展示模式', displayModeLabels: { balanced: '标准', black: '纯黑夜间', large: '极简大字' }, autoShift: '自动位移防烧屏', wideLayout: '多屏 / 横屏布局',
    preferences: '偏好迁移', exportPreferences: '导出 JSON', importPreferences: '导入 JSON', migrationCode: '迁移码', copyCode: '复制迁移码', restoreDefaults: '恢复默认',
    weatherFeels: '体感', precipitation: '降水', updatedAt: '更新', refreshWeather: '刷新天气',
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
    closeSettings: 'Close settings',
    enableWeather: 'Enable weather atmosphere',
    retryWeather: 'Retry weather',
    weatherAtmosphere: 'Weather atmosphere',
    weatherDescription: 'Applies a background layer only after local weather is available.',
    weatherEnabled: 'Enabled',
    weatherDisabled: 'Disabled',
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
    locationFailed: 'Location failed',
    manualLocation: 'Set city manually',
    manualLocationDescription: 'Enter a city to fetch weather when location is unavailable.',
    manualLocationPlaceholder: 'For example: Shanghai',
    saveManualLocation: 'Use this city',
    manualLocationRequired: 'Enter a city name',
    manualLocationNotFound: 'City not found. Check the name and try again.',
    manualLocationFailed: 'City lookup is unavailable. Try again later.',
    manualLocationSaved: 'Switched to manual city',
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
     performance: 'Performance',
     performanceDescription: 'Your device or system settings triggered a performance hint. Dynamic remains available; static uses fewer resources.',
     performanceReasons: {
       compactScreen: 'compact layout',
       reducedMotion: 'reduced motion preference',
       saveData: 'data saver',
       lowMemory: 'low device memory',
       lowCpu: 'limited CPU threads',
     },
     performanceStatic: 'Aurora static',
     performanceNormal: 'Dynamic effects normal',
     today: 'Today',
     yesterday: 'Yesterday',
     tomorrow: 'Tomorrow',
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
    meetingPlanner: 'Time zone meeting', meetingDescription: 'Compare local times and working-hour overlap for two cities.',
    openMeetingPlanner: 'Open planner', closeMeetingPlanner: 'Close planner', citySearch: 'Search city or IANA time zone', commonPresets: 'Presets',
    maxWorldClocks: 'Visible clocks', dragToSort: 'Drag to reorder', noCities: 'No matching cities',
    tools: 'Desk tools', alarm: 'Alarm', countdown: 'Countdown', pomodoro: 'Pomodoro', start: 'Start', stop: 'Stop', reset: 'Reset',
    alarmTime: 'Reminder time', addAlarm: 'Add local reminder', noAlarms: 'No reminders', soundHint: 'Sound reminders play while this page is open.',
    calendar: 'Calendar event', importIcs: 'Import ICS', noEvent: 'Import an ICS file to show the next event', eventIn: 'Event in',
    displayModes: 'Display modes', displayModeLabels: { balanced: 'Balanced', black: 'Pure black night', large: 'Minimal large type' }, autoShift: 'Auto-shift for burn-in', wideLayout: 'Multi-screen / wide layout',
    preferences: 'Preference transfer', exportPreferences: 'Export JSON', importPreferences: 'Import JSON', migrationCode: 'Migration code', copyCode: 'Copy code', restoreDefaults: 'Reset defaults',
    weatherFeels: 'Feels like', precipitation: 'Precipitation', updatedAt: 'Updated', refreshWeather: 'Refresh weather',
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
  { id: 'hong-kong', city: { zh: '香港', en: 'Hong Kong' }, timeZone: 'Asia/Hong_Kong' },
  { id: 'seoul', city: { zh: '首尔', en: 'Seoul' }, timeZone: 'Asia/Seoul' },
  { id: 'dubai', city: { zh: '迪拜', en: 'Dubai' }, timeZone: 'Asia/Dubai' },
  { id: 'mumbai', city: { zh: '孟买', en: 'Mumbai' }, timeZone: 'Asia/Kolkata' },
  { id: 'bangkok', city: { zh: '曼谷', en: 'Bangkok' }, timeZone: 'Asia/Bangkok' },
  { id: 'berlin', city: { zh: '柏林', en: 'Berlin' }, timeZone: 'Europe/Berlin' },
  { id: 'moscow', city: { zh: '莫斯科', en: 'Moscow' }, timeZone: 'Europe/Moscow' },
  { id: 'honolulu', city: { zh: '檀香山', en: 'Honolulu' }, timeZone: 'Pacific/Honolulu' },
  { id: 'chicago', city: { zh: '芝加哥', en: 'Chicago' }, timeZone: 'America/Chicago' },
  { id: 'toronto', city: { zh: '多伦多', en: 'Toronto' }, timeZone: 'America/Toronto' },
  { id: 'mexico-city', city: { zh: '墨西哥城', en: 'Mexico City' }, timeZone: 'America/Mexico_City' },
  { id: 'sao-paulo', city: { zh: '圣保罗', en: 'Sao Paulo' }, timeZone: 'America/Sao_Paulo' },
  { id: 'amsterdam', city: { zh: '阿姆斯特丹', en: 'Amsterdam' }, timeZone: 'Europe/Amsterdam' },
  { id: 'cairo', city: { zh: '开罗', en: 'Cairo' }, timeZone: 'Africa/Cairo' },
  { id: 'johannesburg', city: { zh: '约翰内斯堡', en: 'Johannesburg' }, timeZone: 'Africa/Johannesburg' },
  { id: 'auckland', city: { zh: '奥克兰', en: 'Auckland' }, timeZone: 'Pacific/Auckland' },
];

export const weatherCodeMap = [
  { codes: [0, 1], labelKey: 'clear', atmosphere: 'clear' },
  { codes: [2, 3], labelKey: 'cloudy', atmosphere: 'cloudy' },
  { codes: [45, 48], labelKey: 'fog', atmosphere: 'fog' },
  { codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], labelKey: 'rain', atmosphere: 'rain' },
  { codes: [71, 73, 75, 77, 85, 86], labelKey: 'snow', atmosphere: 'snow' },
  { codes: [95, 96, 99], labelKey: 'storm', atmosphere: 'storm' },
];

export const themeVisuals = {
  morning: { aurora: { colorStops: ['#ffd69a', '#7ee8ff', '#ba8bff'], amplitude: 1.25, blend: 0.72 }, glow: ['#ffd69a', '#7ee8ff', '#ba8bff'] },
  day: { aurora: { colorStops: ['#7ee8ff', '#b7dbff', '#67ffe4'], amplitude: 1.05, blend: 0.66 }, glow: ['#7ee8ff', '#b7dbff', '#67ffe4'] },
  evening: { aurora: { colorStops: ['#ff8c66', '#b66cff', '#67ffe4'], amplitude: 1.35, blend: 0.74 }, glow: ['#ff8c66', '#b66cff', '#67ffe4'] },
  night: { aurora: { colorStops: ['#67ffe4', '#b7dbff', '#8b5cf6'], amplitude: 1.45, blend: 0.78 }, glow: ['#67ffe4', '#b7dbff', '#8b5cf6'] },
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
