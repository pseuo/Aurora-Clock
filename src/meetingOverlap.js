import { formatWorldTime } from './clockTime.js';

function localMinutes(date, formatter) {
  const parts = Object.fromEntries(formatter.formatToParts(date).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, Number(value)]));
  return parts.hour * 60 + parts.minute;
}

export function overlapFor(date, first, second, locale) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const firstFormatter = new Intl.DateTimeFormat('en-US', { timeZone: first.timeZone, hour: '2-digit', hourCycle: 'h23', minute: '2-digit' });
  const secondFormatter = new Intl.DateTimeFormat('en-US', { timeZone: second.timeZone, hour: '2-digit', hourCycle: 'h23', minute: '2-digit' });
  const matches = [];
  for (let minute = 0; minute < 24 * 60; minute += 15) {
    const candidate = new Date(start.getTime() + minute * 60 * 1000);
    const firstMinutes = localMinutes(candidate, firstFormatter);
    const secondMinutes = localMinutes(candidate, secondFormatter);
    if (firstMinutes >= 9 * 60 && firstMinutes < 18 * 60 && secondMinutes >= 9 * 60 && secondMinutes < 18 * 60) matches.push(candidate);
  }
  if (!matches.length) return '无工作时间重叠';
  return `${formatWorldTime(matches[0], first.timeZone, true, locale)} – ${formatWorldTime(new Date(matches.at(-1).getTime() + 15 * 60 * 1000), first.timeZone, true, locale)}`;
}
