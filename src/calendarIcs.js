function getTimeZoneOffset(timestamp, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    numberingSystem: 'latn',
    second: '2-digit',
    timeZone,
    year: 'numeric',
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, Number(value)]));
  return Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute, values.second) - timestamp;
}

function parseIcsDate(property) {
  if (!property) return null;
  const match = property.value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!match) return null;

  const [, year, month, day, hour = '00', minute = '00', second = '00', utc] = match;
  const values = [Number(year), Number(month), Number(day), Number(hour), Number(minute), Number(second)];
  if (property.value.length === 8) return new Date(values[0], values[1] - 1, values[2]);
  if (utc) return new Date(Date.UTC(values[0], values[1] - 1, values[2], values[3], values[4], values[5]));

  const timeZoneMatch = property.parameters.match(/(?:^|;)TZID=(?:"([^"]+)"|([^;]+))/i);
  const timeZone = timeZoneMatch?.[1] ?? timeZoneMatch?.[2];
  if (!timeZone) return new Date(values[0], values[1] - 1, values[2], values[3], values[4], values[5]);

  try {
    const wallTime = Date.UTC(values[0], values[1] - 1, values[2], values[3], values[4], values[5]);
    let timestamp = wallTime - getTimeZoneOffset(wallTime, timeZone);
    timestamp = wallTime - getTimeZoneOffset(timestamp, timeZone);
    return new Date(timestamp);
  } catch {
    return null;
  }
}

function getProperty(lines, name) {
  const line = lines.find((entry) => new RegExp(`^${name}(?:;|:)`, 'i').test(entry));
  if (!line) return null;
  const separator = line.indexOf(':');
  return { parameters: line.slice(name.length, separator), value: line.slice(separator + 1).trim() };
}

function unescapeIcsText(value) {
  return value.replace(/\\([\\,;nN])/g, (_match, character) => (character.toLowerCase() === 'n' ? '\n' : character));
}

export function parseIcs(text) {
  const unfolded = text.replace(/\r?\n[ \t]/g, '');
  const events = [...unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)].map((match) => {
    const lines = match[1].split(/\r?\n/);
    const startProperty = getProperty(lines, 'DTSTART');
    const start = parseIcsDate(startProperty);
    const end = parseIcsDate(getProperty(lines, 'DTEND'));
    const allDayEnd = startProperty?.value.length === 8 && start
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
      : null;
    const title = getProperty(lines, 'SUMMARY')?.value;
    return { title: title ? unescapeIcsText(title) : 'Calendar event', start, end: end ?? allDayEnd };
  }).filter((event) => event.start).sort((a, b) => a.start - b.start);
  const now = new Date();
  return events.find((event) => event.start >= now || event.end >= now) ?? null;
}
