export const MAX_ICS_FILE_SIZE_BYTES = 1024 * 1024;

/**
 * @typedef {Object} CalendarEvent
 * @property {string} title
 * @property {Date} start
 * @property {Date | null} end
 */

export class IcsImportError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function hasValidDateParts(year, month, day, hour, minute, second) {
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  )
    return false;
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getTimeZoneOffset(timestamp, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    numberingSystem: "latn",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)]),
  );
  return (
    Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second,
    ) - timestamp
  );
}

function parseIcsDate(property) {
  if (!property) return null;
  const match = property.value.match(
    /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/,
  );
  if (!match) return null;

  const [, year, month, day, hour = "00", minute = "00", second = "00", utc] =
    match;
  const values = [
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  ];
  if (!hasValidDateParts(...values)) return null;
  if (property.value.length === 8)
    return new Date(values[0], values[1] - 1, values[2]);
  if (utc)
    return new Date(
      Date.UTC(
        values[0],
        values[1] - 1,
        values[2],
        values[3],
        values[4],
        values[5],
      ),
    );

  const timeZoneMatch = property.parameters.match(
    /(?:^|;)TZID=(?:"([^"]+)"|([^;]+))/i,
  );
  const timeZone = timeZoneMatch?.[1] ?? timeZoneMatch?.[2];
  if (!timeZone)
    return new Date(
      values[0],
      values[1] - 1,
      values[2],
      values[3],
      values[4],
      values[5],
    );

  try {
    const wallTime = Date.UTC(
      values[0],
      values[1] - 1,
      values[2],
      values[3],
      values[4],
      values[5],
    );
    let timestamp = wallTime - getTimeZoneOffset(wallTime, timeZone);
    timestamp = wallTime - getTimeZoneOffset(timestamp, timeZone);
    return new Date(timestamp);
  } catch {
    return null;
  }
}

function getProperty(lines, name) {
  const line = lines.find((entry) =>
    new RegExp(`^${name}(?:;|:)`, "i").test(entry),
  );
  if (!line) return null;
  const separator = line.indexOf(":");
  return {
    parameters: line.slice(name.length, separator),
    value: line.slice(separator + 1).trim(),
  };
}

function unescapeIcsText(value) {
  return value.replace(/\\([\\,;nN])/g, (_match, character) =>
    character.toLowerCase() === "n" ? "\n" : character,
  );
}

/**
 * Parses a bounded, untrusted ICS string and returns upcoming events.
 * @param {unknown} text
 * @returns {CalendarEvent[]}
 */
export function parseIcsEvents(text) {
  if (
    typeof text !== "string" ||
    text.length > MAX_ICS_FILE_SIZE_BYTES ||
    !/(?:^|\r?\n)BEGIN:VCALENDAR(?:\r?\n|$)/i.test(text) ||
    !/(?:^|\r?\n)END:VCALENDAR(?:\r?\n|$)/i.test(text)
  ) {
    throw new IcsImportError("invalid");
  }

  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const eventBlocks = [
    ...unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/gi),
  ];
  if (!eventBlocks.length) throw new IcsImportError("invalid");
  if (eventBlocks.some((match) => /^RECURRENCE-ID(?:;|:)/im.test(match[1]))) {
    throw new IcsImportError("unsupported");
  }

  const events = eventBlocks
    .map((match) => {
      const lines = match[1].split(/\r?\n/);
      const startProperty = getProperty(lines, "DTSTART");
      const start = parseIcsDate(startProperty);
      const end = parseIcsDate(getProperty(lines, "DTEND"));
      const allDayEnd =
        startProperty?.value.length === 8 && start
          ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
          : null;
      const title = getProperty(lines, "SUMMARY")?.value;
      return {
        title: title ? unescapeIcsText(title) : "Calendar event",
        start,
        end: end ?? allDayEnd,
        rule: getProperty(lines, "RRULE")?.value ?? null,
      };
    })
    .filter((event) => event.start)
    .flatMap(expandRecurringEvent)
    .sort((a, b) => a.start - b.start);
  if (!events.length) throw new IcsImportError("invalid");

  const now = new Date();
  return events
    .filter((event) => event.start >= now || event.end >= now)
    .slice(0, 50);
}

function recurrenceParts(rule) {
  if (!rule) return null;
  const values = Object.fromEntries(
    rule.split(";").map((part) => {
      const [key, value] = part.split("=", 2);
      return [key?.toUpperCase(), value];
    }),
  );
  if (
    !values.FREQ ||
    !["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(values.FREQ)
  )
    return null;
  const interval = Number(values.INTERVAL ?? 1);
  const count = Number(values.COUNT ?? 0);
  const until = values.UNTIL
    ? parseIcsDate({ parameters: "", value: values.UNTIL })
    : null;
  if (
    !Number.isInteger(interval) ||
    interval < 1 ||
    (values.COUNT && (!Number.isInteger(count) || count < 1))
  )
    return null;
  return {
    byday: values.BYDAY?.split(",").map((day) => day.slice(-2)) ?? null,
    count,
    freq: values.FREQ,
    interval,
    until,
  };
}

function isRecurrenceDate(date, start, rule) {
  const day = 24 * 60 * 60 * 1000;
  const dayDifference = Math.floor(
    (new Date(date.getFullYear(), date.getMonth(), date.getDate()) -
      new Date(start.getFullYear(), start.getMonth(), start.getDate())) /
      day,
  );
  if (dayDifference < 0) return false;
  if (rule.freq === "DAILY") return dayDifference % rule.interval === 0;
  if (rule.freq === "WEEKLY") {
    const weekday = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()];
    const allowedDays = rule.byday ?? [
      ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][start.getDay()],
    ];
    return (
      Math.floor(dayDifference / 7) % rule.interval === 0 &&
      allowedDays.includes(weekday)
    );
  }
  if (date.getDate() !== start.getDate()) return false;
  if (rule.freq === "MONTHLY") {
    const months =
      (date.getFullYear() - start.getFullYear()) * 12 +
      date.getMonth() -
      start.getMonth();
    return months >= 0 && months % rule.interval === 0;
  }
  return (
    date.getMonth() === start.getMonth() &&
    date.getFullYear() >= start.getFullYear() &&
    (date.getFullYear() - start.getFullYear()) % rule.interval === 0
  );
}

function expandRecurringEvent(event) {
  const rule = recurrenceParts(event.rule);
  const baseEvent = { end: event.end, start: event.start, title: event.title };
  if (!event.rule) return [baseEvent];
  if (!rule) throw new IcsImportError("unsupported");

  const duration = event.end
    ? event.end.getTime() - event.start.getTime()
    : null;
  const horizon = new Date();
  horizon.setFullYear(horizon.getFullYear() + 1);
  const occurrences = [];
  const cursor = new Date(event.start);
  let generated = 0;
  let scannedDays = 0;
  while (cursor <= horizon && scannedDays++ < 3700) {
    if (rule.until && cursor > rule.until) break;
    if (isRecurrenceDate(cursor, event.start, rule)) {
      occurrences.push({
        end: duration === null ? null : new Date(cursor.getTime() + duration),
        start: new Date(cursor),
        title: event.title,
      });
      generated += 1;
      if (rule.count && generated >= rule.count) break;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return occurrences;
}

/**
 * Backwards-compatible convenience API for callers that need only the next event.
 * @param {unknown} text
 * @returns {CalendarEvent | null}
 */
export function parseIcs(text) {
  return parseIcsEvents(text)[0] ?? null;
}
