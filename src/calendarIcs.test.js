import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseIcs } from './calendarIcs.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('parseIcs', () => {
  it('unfolds content lines and interprets TZID date-times', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T12:00:00Z'));

    const event = parseIcs([
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'SUMMARY:Design ',
      ' review',
      'DTSTART;TZID=America/New_York:20260817T093000',
      'DTEND;TZID=America/New_York:20260817T103000',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n'));

    expect(event).toMatchObject({ title: 'Design review' });
    expect(event.start.toISOString()).toBe('2026-08-17T13:30:00.000Z');
    expect(event.end.toISOString()).toBe('2026-08-17T14:30:00.000Z');
  });

  it('supports all-day DTSTART values', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 17, 12));

    const event = parseIcs(`BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Holiday
DTSTART;VALUE=DATE:20260818
DTEND;VALUE=DATE:20260819
END:VEVENT
END:VCALENDAR`);

    expect(event.start).toEqual(new Date(2026, 7, 18));
    expect(event.end).toEqual(new Date(2026, 7, 19));
  });

  it('unescapes text values in event titles', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T12:00:00Z'));

    const event = parseIcs(`BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Meeting\\, project\\; planning\\nRoom A
DTSTART:20260817T130000Z
END:VEVENT
END:VCALENDAR`);

    expect(event.title).toBe('Meeting, project; planning\nRoom A');
  });

  it('returns the current event and ignores historical events when none remain', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T12:00:00Z'));

    const current = parseIcs(`BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Finished
DTSTART:20260817T080000Z
DTEND:20260817T090000Z
END:VEVENT
BEGIN:VEVENT
SUMMARY:In progress
DTSTART:20260817T110000Z
DTEND:20260817T130000Z
END:VEVENT
END:VCALENDAR`);
    const history = parseIcs(`BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Finished
DTSTART:20260817T080000Z
DTEND:20260817T090000Z
END:VEVENT
END:VCALENDAR`);

    expect(current).toMatchObject({ title: 'In progress' });
    expect(history).toBeNull();
  });
});
