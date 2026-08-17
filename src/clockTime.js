import { numberFormat } from './clockConfig.js';

const formatterCache = new Map();

function getDateTimeFormatter(locale, options) {
  const key = `${locale}:${JSON.stringify(options)}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.DateTimeFormat(locale, options));
  }
  return formatterCache.get(key);
}

export function getClockParts(date, is24Hour, locale) {
  const rawHours = date.getHours();
  const displayHours = is24Hour ? rawHours : rawHours % 12 || 12;
  const zoneFormat = getDateTimeFormatter(locale, { timeZoneName: 'short' });

  return {
    hours: numberFormat.format(displayHours),
    minutes: numberFormat.format(date.getMinutes()),
    seconds: numberFormat.format(date.getSeconds()),
    meridiem: rawHours >= 12 ? 'PM' : 'AM',
    zoneLabel: zoneFormat.formatToParts(date).find((part) => part.type === 'timeZoneName')?.value ?? 'Local',
  };
}

export function formatDateLabel(date, locale, format) {
  if (format === 'hidden') return null;

  const options = {
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    compact: { year: 'numeric', month: '2-digit', day: '2-digit' },
    weekday: { weekday: 'long' },
  }[format];

  return getDateTimeFormatter(locale, options).format(date);
}

export function formatWorldTime(date, timeZone, is24Hour, locale) {
  return getDateTimeFormatter(locale, { hour: '2-digit', minute: '2-digit', hour12: !is24Hour, timeZone }).format(date);
}

function getDateKey(date, timeZone) {
  const parts = getDateTimeFormatter('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getWorldDayOffset(date, timeZone) {
  const localDay = getDateKey(date);
  const worldDay = getDateKey(date, timeZone);
  const localDate = new Date(`${localDay}T00:00:00Z`);
  const worldDate = new Date(`${worldDay}T00:00:00Z`);
  return Math.round((worldDate - localDate) / 86400000);
}

export function formatWorldDate(date, timeZone, locale) {
  return getDateTimeFormatter(locale, { month: 'short', day: 'numeric', timeZone }).format(date);
}
