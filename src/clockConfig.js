export const numberFormat = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 2,
});

export const themeOptions = ["auto", "morning", "day", "evening", "night"];
export const languageOptions = ["zh", "en", "ja", "es"];
export const intensityOptions = ["calm", "normal", "vivid"];
export const dateFormatOptions = [
  "full",
  "compact",
  "weekday",
  "regional",
  "iso",
  "hidden",
];
export const localeOptions = [
  "auto",
  "en-US",
  "en-GB",
  "zh-CN",
  "ja-JP",
  "es-ES",
];
export const temperatureUnitOptions = ["celsius", "fahrenheit"];
export const auroraMotionOptions = ["dynamic", "static"];
export const defaultCityIds = ["tokyo", "london", "new-york"];
export const worldClockLimitOptions = [3, 4, 5, 6, 8, 10];
export const displayModeOptions = ["balanced", "black", "large"];
export const worldClockPresets = {
  workday: ["beijing", "singapore", "london", "new-york"],
  asia: ["beijing", "tokyo", "singapore", "sydney"],
  travel: ["new-york", "london", "paris", "tokyo", "sydney"],
};

export const copy = {
  zh: {
    appLabel: "Aurora Clock｜极光时钟",
    controls: "时钟控制",
    themeMode: "主题模式",
    themeDescription: "选择自动日夜主题，或固定一个你喜欢的时间氛围。",
    themeLabels: {
      auto: "自动",
      morning: "清晨",
      day: "白天",
      evening: "傍晚",
      night: "夜晚",
    },
    timeLabels: { hours: "小时", minutes: "分钟", seconds: "秒" },
    title: "Aurora Clock｜极光时钟",
    live: "实时",
    toggleHourMode: "切换 12 或 24 小时制",
    toggleFullscreen: "切换全屏",
    fullscreen: "全屏",
    worldClocks: "世界时钟",
    worldCities: "世界城市",
    worldDescription: "选择要显示在主时钟下方的城市。",
    showWorldClocks: "显示世界时钟",
    hideWorldClocks: "隐藏世界时钟",
    language: "语言",
    settings: "设置",
    closeSettings: "关闭设置",
    enableWeather: "开启天气氛围",
    retryWeather: "重试天气",
    weatherAtmosphere: "天气氛围",
    weatherDescription: "仅在成功获取本地天气后叠加背景效果。",
    weatherEnabled: "已开启",
    weatherDisabled: "已关闭",
    weatherLoading: "正在获取天气...",
    installApp: "安装为桌面时钟",
    installUnavailable: "当前浏览器暂不支持安装提示",
    installInstalled: "已安装",
    installAvailable: "可安装",
    installUnsupported: "不支持安装",
    dismiss: "稍后",
    updateReady: "新版本已就绪，刷新更新",
    refresh: "刷新",
    desktopMode: "桌面模式",
    disableWeather: "关闭天气氛围",
    offlineMode: "离线模式",
    offlineWeather: "离线模式 · 天气暂停",
    weatherFallback: "天气",
    weatherIdle: "本地氛围",
    weatherUnavailable: "天气不可用",
    weatherOffline: "天气离线",
    locationDenied: "定位关闭",
    locationFailed: "定位失败",
    manualLocation: "手动设置城市",
    manualLocationDescription: "定位不可用时，输入城市以获取天气。",
    manualLocationPlaceholder: "例如：上海",
    saveManualLocation: "使用此城市",
    manualLocationRequired: "请输入城市名称",
    manualLocationNotFound: "未找到该城市，请检查名称后重试",
    manualLocationFailed: "暂时无法查找城市，请稍后重试",
    manualLocationSaved: "已切换到手动城市",
    manualLocationCleared: "已清除手动天气位置",
    clearManualLocation: "清除天气位置",
    weatherPrivacy:
      "手动城市的名称和坐标仅保存在此浏览器中，也会包含在偏好导出文件内；请求天气时会发送给 Open-Meteo。",
    weatherTimeout: "天气请求超时",
    weatherInvalid: "天气响应无效",
    shortcuts: "快捷键：F 全屏 · T 主题 · L 语言 · H 小时制 · W 世界时钟",
    intensity: "背景强度",
    intensityDescription: "控制极光的亮度、运动和存在感。",
    auroraMotion: "极光动态",
    auroraMotionLabels: { dynamic: "动态", static: "静态" },
    appearance: "外观",
    appearanceDescription: "调整桌面模式和视觉呈现。",
    time: "时间",
    timeDescription: "控制小时制、全屏和世界时钟显示。",
    dateFormat: "日期格式",
    dateFormatLabels: {
      full: "完整",
      compact: "简洁",
      weekday: "星期",
      regional: "地区习惯",
      iso: "ISO 8601",
      hidden: "隐藏",
    },
    locale: "地区格式",
    localeLabels: {
      auto: "跟随语言",
      "en-US": "English (US)",
      "en-GB": "English (UK)",
      "zh-CN": "中文（简体）",
      "ja-JP": "日本語",
      "es-ES": "Español",
    },
    temperatureUnit: "温度单位",
    temperatureUnitLabels: { celsius: "摄氏 (°C)", fahrenheit: "华氏 (°F)" },
    help: "帮助",
    shortcutHelp: "快捷键帮助",
    performance: "性能仪表",
    performanceDescription:
      "设备或系统偏好触发了性能提示。选择动态仍可恢复动画，静态模式更省资源。",
    performanceReasons: {
      compactScreen: "小屏布局",
      reducedMotion: "系统减少动态效果",
      saveData: "已开启省流量模式",
      lowMemory: "设备内存较低",
      lowCpu: "设备线程较少",
    },
    performanceStatic: "极光已静态化",
    performanceNormal: "动态效果正常",
    today: "今天",
    yesterday: "昨日",
    tomorrow: "明日",
    shortcutRows: [
      ["F", "全屏"],
      ["T", "切换主题"],
      ["L", "切换语言"],
      ["H", "小时制"],
      ["W", "世界时钟"],
      ["Esc", "关闭面板"],
    ],
    app: "应用",
    appDescription: "桌面安装和应用级操作。",
    intensityLabels: { calm: "柔和", normal: "标准", vivid: "鲜明" },
    weatherLabels: {
      clear: "晴朗",
      cloudy: "多云",
      fog: "有雾",
      rain: "有雨",
      snow: "有雪",
      storm: "雷雨",
    },
    toast: {
      theme: "已切换到",
      intensity: "背景强度",
      weatherOn: "天气氛围已开启",
      weatherOff: "天气氛围已关闭",
      desktopOn: "桌面模式已开启",
      desktopOff: "桌面模式已关闭",
      language: "语言已切换",
      hour: "小时制已切换",
      world: "世界时钟已更新",
      aurora: "极光动态",
    },
    meetingPlanner: "跨时区会议",
    meetingDescription:
      "比较两个城市的当地时间，并按双方工作时间寻找可安排的时段。",
    dateTime: "日期 / 时间",
    meetingDateTime: "日期 / 时间",
    noWorkingHourOverlap: "无工作时间重叠",
    workSchedule: "工作时间",
    workdayStart: "开始",
    workdayEnd: "结束",
    workdays: "工作日",
    weekdayLabels: ["日", "一", "二", "三", "四", "五", "六"],
    meetingDuration: "会议时长",
    durationMinutes: (minutes) => `${minutes} 分钟`,
    meetingTitle: "会议标题",
    meetingTitlePlaceholder: "例如：产品同步会",
    meetingOptions: "可选会议时段",
    copyMeeting: "复制会议文本",
    exportMeetingIcs: "导出 ICS",
    openMeetingPlanner: "打开会议规划器",
    closeMeetingPlanner: "关闭会议规划器",
    citySearch: "搜索城市或 IANA 时区",
    commonPresets: "常用预设",
    maxWorldClocks: "最多显示数量",
    dragToSort: "拖拽或使用按钮排序",
    worldOrder: "已选城市排序",
    moveCityUp: "上移城市",
    moveCityDown: "下移城市",
    noCities: "没有匹配城市",
    tools: "桌面工具",
    alarm: "页面内闹钟",
    countdown: "倒计时",
    pomodoro: "番茄钟",
    start: "开始",
    stop: "停止",
    reset: "重置",
    pageAlarm: "页面内闹钟",
    alarmTime: "提醒时间",
    reminderName: "提醒名称",
    reminderNamePlaceholder: "例如：喝水",
    reminderRepeat: "重复",
    reminderRepeatLabels: { daily: "每天", weekdays: "工作日", once: "一次性" },
    reminderDate: "日期",
    advanceNotice: "提前通知",
    advanceNoticeMinutes: (minutes) =>
      minutes ? `提前 ${minutes} 分钟` : "准时",
    snooze: "贪睡",
    snoozeMinutes: (minutes) => `${minutes} 分钟后`,
    snoozeNow: "稍后提醒",
    reminderDue: "提醒时间到",
    addAlarm: "添加页面内提醒",
    noAlarms: "暂无提醒",
    soundHint: "提醒仅在当前页面打开且浏览器未被冻结时播放声音。",
    alarmNotice:
      "这不是系统闹钟。页面关闭、浏览器被冻结或设备休眠时，提醒不会可靠触发。",
    enableNotifications: "启用浏览器通知",
    notificationEnabled: "浏览器通知已启用；它不能保证后台或休眠后的提醒。",
    notificationBlocked: "浏览器通知已被阻止。",
    notificationUnavailable: "此浏览器不支持通知。",
    notificationOptional:
      "浏览器通知可在页面仍运行时补充提醒，但不能替代系统闹钟。",
    calendar: "日历事件",
    importIcs: "导入 ICS",
    basicIcsImport: "基础 ICS 导入",
    calendarImportScope:
      "保留最多 50 个近期事件，并支持每日、每周、每月和每年重复规则。例外规则暂不支持。最大文件为 1 MiB。",
    calendarImportLoading: "正在读取日历文件...",
    calendarImported: "已导入近期日历事件。",
    calendarInvalid: "无效的 ICS 日历文件。",
    calendarNoRecent: "该日历没有近期事件。",
    calendarUnsupported: "此日历包含尚不支持的重复事件或例外规则。",
    calendarReadFailed: "无法读取该日历文件。",
    calendarFileTooLarge: "日历文件超过 1 MiB 限制。",
    clearCalendar: "清除已导入事件",
    noEvent: "导入 ICS 后显示下一个事件",
    eventIn: "距离事件",
    displayModes: "展示模式",
    displayModeLabels: {
      balanced: "标准",
      black: "纯黑夜间",
      large: "极简大字",
    },
    autoShift: "自动位移防烧屏",
    wideLayout: "多屏 / 横屏布局",
    preferences: "偏好迁移",
    exportPreferences: "导出 JSON",
    importPreferences: "导入 JSON",
    importInvalidJson: "JSON 文件格式无效，请选择有效的偏好导出文件。",
    importInvalidCode: "迁移码无效，请检查内容后重试。",
    importInvalidPreferences: "该偏好文件不兼容或内容不完整。",
    importReadFailed: "无法读取偏好文件，请重试。",
    importSuccess: "已备份当前偏好并恢复导入的偏好。",
    defaultsRestored: "已恢复默认偏好。",
    confirmResetTitle: "恢复默认偏好？",
    confirmResetDescription: "这会清除当前的个性化设置，且无法撤销。",
    cancel: "取消",
    confirmReset: "恢复默认",
    migrationCode: "迁移码",
    copyCode: "复制迁移码",
    restoreDefaults: "恢复默认",
    weatherFeels: "体感",
    precipitation: "降水",
    updatedAt: "更新",
    refreshWeather: "刷新天气",
  },
  en: {
    appLabel: "Aurora Clock",
    controls: "Clock controls",
    themeMode: "Theme mode",
    themeDescription: "Use automatic day phases or pin a favorite atmosphere.",
    themeLabels: {
      auto: "Auto",
      morning: "Morning",
      day: "Day",
      evening: "Evening",
      night: "Night",
    },
    timeLabels: { hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    title: "Aurora Clock",
    live: "Live",
    toggleHourMode: "Toggle 12 or 24 hour time",
    toggleFullscreen: "Toggle fullscreen",
    fullscreen: "Full",
    worldClocks: "World clocks",
    worldCities: "World cities",
    worldDescription: "Choose which cities appear below the main clock.",
    showWorldClocks: "Show world clocks",
    hideWorldClocks: "Hide world clocks",
    language: "Language",
    settings: "Settings",
    closeSettings: "Close settings",
    enableWeather: "Enable weather atmosphere",
    retryWeather: "Retry weather",
    weatherAtmosphere: "Weather atmosphere",
    weatherDescription:
      "Applies a background layer only after local weather is available.",
    weatherEnabled: "Enabled",
    weatherDisabled: "Disabled",
    weatherLoading: "Fetching weather...",
    installApp: "Install desktop clock",
    installUnavailable: "Install prompt is not available in this browser",
    installInstalled: "Installed",
    installAvailable: "Installable",
    installUnsupported: "Install unsupported",
    dismiss: "Later",
    updateReady: "New version is ready. Refresh to update",
    refresh: "Refresh",
    desktopMode: "Desktop mode",
    disableWeather: "Disable weather atmosphere",
    offlineMode: "Offline mode",
    offlineWeather: "Offline mode · Weather paused",
    weatherFallback: "Weather",
    weatherIdle: "Local atmosphere",
    weatherUnavailable: "Weather unavailable",
    weatherOffline: "Weather offline",
    locationDenied: "Location off",
    locationFailed: "Location failed",
    manualLocation: "Set city manually",
    manualLocationDescription:
      "Enter a city to fetch weather when location is unavailable.",
    manualLocationPlaceholder: "For example: Shanghai",
    saveManualLocation: "Use this city",
    manualLocationRequired: "Enter a city name",
    manualLocationNotFound: "City not found. Check the name and try again.",
    manualLocationFailed: "City lookup is unavailable. Try again later.",
    manualLocationSaved: "Switched to manual city",
    manualLocationCleared: "Manual weather location cleared",
    clearManualLocation: "Clear weather location",
    weatherPrivacy:
      "Your manual city name and coordinates are stored only in this browser and included in preference exports. They are sent to Open-Meteo when weather is requested.",
    weatherTimeout: "Weather request timed out",
    weatherInvalid: "Weather response is invalid",
    shortcuts:
      "Shortcuts: F Fullscreen · T Theme · L Language · H Hour mode · W World clocks",
    intensity: "Background intensity",
    intensityDescription: "Controls aurora brightness, motion, and presence.",
    auroraMotion: "Aurora motion",
    auroraMotionLabels: { dynamic: "Dynamic", static: "Static" },
    appearance: "Appearance",
    appearanceDescription: "Tune desktop mode and visual presentation.",
    time: "Time",
    timeDescription: "Control hour mode, fullscreen, and world clocks.",
    dateFormat: "Date format",
    dateFormatLabels: {
      full: "Full",
      compact: "Compact",
      weekday: "Weekday",
      regional: "Regional",
      iso: "ISO 8601",
      hidden: "Hidden",
    },
    locale: "Regional format",
    localeLabels: {
      auto: "Match language",
      "en-US": "English (US)",
      "en-GB": "English (UK)",
      "zh-CN": "Chinese (Simplified)",
      "ja-JP": "Japanese",
      "es-ES": "Spanish",
    },
    temperatureUnit: "Temperature unit",
    temperatureUnitLabels: {
      celsius: "Celsius (°C)",
      fahrenheit: "Fahrenheit (°F)",
    },
    help: "Help",
    shortcutHelp: "Shortcut help",
    performance: "Performance",
    performanceDescription:
      "Your device or system settings triggered a performance hint. Dynamic remains available; static uses fewer resources.",
    performanceReasons: {
      compactScreen: "compact layout",
      reducedMotion: "reduced motion preference",
      saveData: "data saver",
      lowMemory: "low device memory",
      lowCpu: "limited CPU threads",
    },
    performanceStatic: "Aurora static",
    performanceNormal: "Dynamic effects normal",
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    shortcutRows: [
      ["F", "Fullscreen"],
      ["T", "Theme"],
      ["L", "Language"],
      ["H", "Hour mode"],
      ["W", "World clocks"],
      ["Esc", "Close panel"],
    ],
    app: "App",
    appDescription: "Desktop install and app-level actions.",
    intensityLabels: { calm: "Calm", normal: "Normal", vivid: "Vivid" },
    weatherLabels: {
      clear: "Clear",
      cloudy: "Cloudy",
      fog: "Fog",
      rain: "Rain",
      snow: "Snow",
      storm: "Storm",
    },
    toast: {
      theme: "Switched to",
      intensity: "Background intensity",
      weatherOn: "Weather atmosphere enabled",
      weatherOff: "Weather atmosphere disabled",
      desktopOn: "Desktop mode enabled",
      desktopOff: "Desktop mode disabled",
      language: "Language switched",
      hour: "Hour mode switched",
      world: "World clocks updated",
      aurora: "Aurora motion",
    },
    meetingPlanner: "Time zone meeting",
    meetingDescription:
      "Compare local times and find a slot that fits both work schedules.",
    dateTime: "Date / time",
    meetingDateTime: "Date / time",
    noWorkingHourOverlap: "No working-hour overlap",
    workSchedule: "Work schedule",
    workdayStart: "Start",
    workdayEnd: "End",
    workdays: "Working days",
    weekdayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    meetingDuration: "Meeting duration",
    durationMinutes: (minutes) => `${minutes} minutes`,
    meetingTitle: "Meeting title",
    meetingTitlePlaceholder: "For example: Product sync",
    meetingOptions: "Meeting time options",
    copyMeeting: "Copy meeting text",
    exportMeetingIcs: "Export ICS",
    openMeetingPlanner: "Open planner",
    closeMeetingPlanner: "Close planner",
    citySearch: "Search city or IANA time zone",
    commonPresets: "Presets",
    maxWorldClocks: "Visible clocks",
    dragToSort: "Drag or use buttons to reorder",
    worldOrder: "Selected city order",
    moveCityUp: "Move city up",
    moveCityDown: "Move city down",
    noCities: "No matching cities",
    tools: "Desk tools",
    alarm: "In-page alarm",
    countdown: "Countdown",
    pomodoro: "Pomodoro",
    start: "Start",
    stop: "Stop",
    reset: "Reset",
    pageAlarm: "In-page alarm",
    alarmTime: "Reminder time",
    reminderName: "Reminder name",
    reminderNamePlaceholder: "For example: Drink water",
    reminderRepeat: "Repeat",
    reminderRepeatLabels: {
      daily: "Daily",
      weekdays: "Weekdays",
      once: "One time",
    },
    reminderDate: "Date",
    advanceNotice: "Advance notice",
    advanceNoticeMinutes: (minutes) =>
      minutes ? `${minutes} minutes early` : "On time",
    snooze: "Snooze",
    snoozeMinutes: (minutes) => `In ${minutes} minutes`,
    snoozeNow: "Snooze reminder",
    reminderDue: "Reminder due",
    addAlarm: "Add in-page reminder",
    noAlarms: "No reminders",
    soundHint:
      "Sound reminders play only while this page is open and the browser is not frozen.",
    alarmNotice:
      "This is not a system alarm. It cannot reliably fire after the page closes, the browser freezes, or the device sleeps.",
    enableNotifications: "Enable browser notifications",
    notificationEnabled:
      "Browser notifications are enabled; they cannot guarantee a background or post-sleep reminder.",
    notificationBlocked: "Browser notifications are blocked.",
    notificationUnavailable: "Notifications are unavailable in this browser.",
    notificationOptional:
      "Browser notifications can supplement a running page, but cannot replace a system alarm.",
    calendar: "Calendar event",
    importIcs: "Import ICS",
    basicIcsImport: "Basic ICS import",
    calendarImportScope:
      "Keeps up to 50 upcoming events and supports daily, weekly, monthly, and yearly recurrence. Exception rules are not supported. Maximum file size: 1 MiB.",
    calendarImportLoading: "Reading calendar file...",
    calendarImported: "Upcoming calendar events imported.",
    calendarInvalid: "Invalid ICS calendar file.",
    calendarNoRecent: "This calendar has no upcoming events.",
    calendarUnsupported:
      "This calendar includes recurring events or exception rules that are not supported.",
    calendarReadFailed: "Could not read this calendar file.",
    calendarFileTooLarge: "Calendar file exceeds the 1 MiB limit.",
    clearCalendar: "Clear imported events",
    noEvent: "Import an ICS file to show the next event",
    eventIn: "Event in",
    displayModes: "Display modes",
    displayModeLabels: {
      balanced: "Balanced",
      black: "Pure black night",
      large: "Minimal large type",
    },
    autoShift: "Auto-shift for burn-in",
    wideLayout: "Multi-screen / wide layout",
    preferences: "Preference transfer",
    exportPreferences: "Export JSON",
    importPreferences: "Import JSON",
    importInvalidJson:
      "This JSON file is invalid. Choose a preference export file.",
    importInvalidCode:
      "This migration code is invalid. Check it and try again.",
    importInvalidPreferences:
      "These preferences are incompatible or incomplete.",
    importReadFailed: "The preference file could not be read. Try again.",
    importSuccess:
      "Your current preferences were backed up and the import was restored.",
    defaultsRestored: "Default preferences restored.",
    confirmResetTitle: "Restore default preferences?",
    confirmResetDescription:
      "This clears your current personalized settings and cannot be undone.",
    cancel: "Cancel",
    confirmReset: "Restore defaults",
    migrationCode: "Migration code",
    copyCode: "Copy code",
    restoreDefaults: "Reset defaults",
    weatherFeels: "Feels like",
    precipitation: "Precipitation",
    updatedAt: "Updated",
    refreshWeather: "Refresh weather",
  },
};

copy.ja = {
  ...copy.en,
  appLabel: "Aurora Clock",
  language: "言語",
  locale: "地域形式",
  temperatureUnit: "温度単位",
  localeLabels: {
    auto: "自動",
    "en-US": "English (US)",
    "en-GB": "English (UK)",
    "zh-CN": "中文（简体）",
    "ja-JP": "日本語",
    "es-ES": "Español",
  },
  temperatureUnitLabels: { celsius: "摂氏 (°C)", fahrenheit: "華氏 (°F)" },
};

copy.es = {
  ...copy.en,
  appLabel: "Aurora Clock",
  language: "Idioma",
  locale: "Formato regional",
  temperatureUnit: "Unidad de temperatura",
  localeLabels: {
    auto: "Automático",
    "en-US": "English (US)",
    "en-GB": "English (UK)",
    "zh-CN": "中文（简体）",
    "ja-JP": "日本語",
    "es-ES": "Español",
  },
  temperatureUnitLabels: {
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
  },
};

export const worldClocks = [
  {
    id: "beijing",
    city: { zh: "北京", en: "Beijing" },
    timeZone: "Asia/Shanghai",
  },
  { id: "tokyo", city: { zh: "东京", en: "Tokyo" }, timeZone: "Asia/Tokyo" },
  {
    id: "london",
    city: { zh: "伦敦", en: "London" },
    timeZone: "Europe/London",
  },
  {
    id: "new-york",
    city: { zh: "纽约", en: "New York" },
    timeZone: "America/New_York",
  },
  {
    id: "los-angeles",
    city: { zh: "洛杉矶", en: "Los Angeles" },
    timeZone: "America/Los_Angeles",
  },
  { id: "paris", city: { zh: "巴黎", en: "Paris" }, timeZone: "Europe/Paris" },
  {
    id: "sydney",
    city: { zh: "悉尼", en: "Sydney" },
    timeZone: "Australia/Sydney",
  },
  {
    id: "singapore",
    city: { zh: "新加坡", en: "Singapore" },
    timeZone: "Asia/Singapore",
  },
  {
    id: "hong-kong",
    city: { zh: "香港", en: "Hong Kong" },
    timeZone: "Asia/Hong_Kong",
  },
  { id: "seoul", city: { zh: "首尔", en: "Seoul" }, timeZone: "Asia/Seoul" },
  { id: "dubai", city: { zh: "迪拜", en: "Dubai" }, timeZone: "Asia/Dubai" },
  {
    id: "mumbai",
    city: { zh: "孟买", en: "Mumbai" },
    timeZone: "Asia/Kolkata",
  },
  {
    id: "bangkok",
    city: { zh: "曼谷", en: "Bangkok" },
    timeZone: "Asia/Bangkok",
  },
  {
    id: "berlin",
    city: { zh: "柏林", en: "Berlin" },
    timeZone: "Europe/Berlin",
  },
  {
    id: "moscow",
    city: { zh: "莫斯科", en: "Moscow" },
    timeZone: "Europe/Moscow",
  },
  {
    id: "honolulu",
    city: { zh: "檀香山", en: "Honolulu" },
    timeZone: "Pacific/Honolulu",
  },
  {
    id: "chicago",
    city: { zh: "芝加哥", en: "Chicago" },
    timeZone: "America/Chicago",
  },
  {
    id: "toronto",
    city: { zh: "多伦多", en: "Toronto" },
    timeZone: "America/Toronto",
  },
  {
    id: "mexico-city",
    city: { zh: "墨西哥城", en: "Mexico City" },
    timeZone: "America/Mexico_City",
  },
  {
    id: "sao-paulo",
    city: { zh: "圣保罗", en: "Sao Paulo" },
    timeZone: "America/Sao_Paulo",
  },
  {
    id: "amsterdam",
    city: { zh: "阿姆斯特丹", en: "Amsterdam" },
    timeZone: "Europe/Amsterdam",
  },
  { id: "cairo", city: { zh: "开罗", en: "Cairo" }, timeZone: "Africa/Cairo" },
  {
    id: "johannesburg",
    city: { zh: "约翰内斯堡", en: "Johannesburg" },
    timeZone: "Africa/Johannesburg",
  },
  {
    id: "auckland",
    city: { zh: "奥克兰", en: "Auckland" },
    timeZone: "Pacific/Auckland",
  },
];

const knownTimeZones = new Set(worldClocks.map(({ timeZone }) => timeZone));
const availableTimeZones =
  typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : worldClocks.map(({ timeZone }) => timeZone);

export function timeZoneId(timeZone) {
  return knownTimeZones.has(timeZone)
    ? worldClocks.find((clock) => clock.timeZone === timeZone).id
    : `tz:${timeZone}`;
}

export function isSupportedTimeZone(timeZone) {
  if (typeof timeZone !== "string" || !timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export function getWorldClock(cityId) {
  const knownCity = worldClocks.find((city) => city.id === cityId);
  if (knownCity) return knownCity;
  const timeZone = cityId?.startsWith("tz:") ? cityId.slice(3) : "";
  if (!isSupportedTimeZone(timeZone)) return null;
  const name = timeZone.split("/").at(-1).replaceAll("_", " ");
  return { id: cityId, city: { zh: name, en: name }, timeZone };
}

export function searchableWorldClocks() {
  const knownZones = new Set(worldClocks.map(({ timeZone }) => timeZone));
  return [
    ...worldClocks,
    ...availableTimeZones
      .filter((timeZone) => !knownZones.has(timeZone))
      .map((timeZone) => {
        const name = timeZone.split("/").at(-1).replaceAll("_", " ");
        return {
          id: `tz:${timeZone}`,
          city: { zh: name, en: name },
          timeZone,
        };
      }),
  ];
}

export const weatherCodeMap = [
  { codes: [0, 1], labelKey: "clear", atmosphere: "clear" },
  { codes: [2, 3], labelKey: "cloudy", atmosphere: "cloudy" },
  { codes: [45, 48], labelKey: "fog", atmosphere: "fog" },
  {
    codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
    labelKey: "rain",
    atmosphere: "rain",
  },
  { codes: [71, 73, 75, 77, 85, 86], labelKey: "snow", atmosphere: "snow" },
  { codes: [95, 96, 99], labelKey: "storm", atmosphere: "storm" },
];

export const themeVisuals = {
  morning: {
    aurora: {
      colorStops: ["#ffd69a", "#7ee8ff", "#ba8bff"],
      amplitude: 1.25,
      blend: 0.72,
    },
    glow: ["#ffd69a", "#7ee8ff", "#ba8bff"],
  },
  day: {
    aurora: {
      colorStops: ["#7ee8ff", "#b7dbff", "#67ffe4"],
      amplitude: 1.05,
      blend: 0.66,
    },
    glow: ["#7ee8ff", "#b7dbff", "#67ffe4"],
  },
  evening: {
    aurora: {
      colorStops: ["#ff8c66", "#b66cff", "#67ffe4"],
      amplitude: 1.35,
      blend: 0.74,
    },
    glow: ["#ff8c66", "#b66cff", "#67ffe4"],
  },
  night: {
    aurora: {
      colorStops: ["#67ffe4", "#b7dbff", "#8b5cf6"],
      amplitude: 1.45,
      blend: 0.78,
    },
    glow: ["#67ffe4", "#b7dbff", "#8b5cf6"],
  },
};

export const intensityConfig = {
  calm: { multiplier: 0.72, speed: 0.34 },
  normal: { multiplier: 1, speed: 0.5 },
  vivid: { multiplier: 1.22, speed: 0.64 },
};

export function getDayPhase(hour) {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

export function getNextThemeMode(current) {
  const index = themeOptions.indexOf(current);
  return themeOptions[(index + 1) % themeOptions.length];
}

export function getNextLanguage(current) {
  const index = languageOptions.indexOf(current);
  return languageOptions[(index + 1) % languageOptions.length];
}

export function getLocale(language, regionalLocale = "auto") {
  if (regionalLocale !== "auto") return regionalLocale;
  return (
    { zh: "zh-CN", en: "en-US", ja: "ja-JP", es: "es-ES" }[language] ?? "en-US"
  );
}

export function getWeatherInfo(code) {
  return (
    weatherCodeMap.find((item) => item.codes.includes(code)) ?? {
      labelKey: "weatherFallback",
      atmosphere: "clear",
    }
  );
}

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
    return;
  }

  document.exitFullscreen?.();
}
