import { describe, expect, it } from 'vitest';
import { formatDateLabel, formatWorldTime, getClockParts, getWorldDayOffset } from './clockTime.js';

describe('clock time helpers', () => {
  it('formats midnight in 12-hour and 24-hour modes', () => {
    const date = new Date(2026, 7, 17, 0, 5, 9);

    expect(getClockParts(date, true, 'en-US')).toMatchObject({ hours: '00', minutes: '05', seconds: '09', meridiem: 'AM' });
    expect(getClockParts(date, false, 'en-US')).toMatchObject({ hours: '12', minutes: '05', seconds: '09', meridiem: 'AM' });
  });

  it('supports date visibility and world timezone formatting', () => {
    const date = new Date('2026-08-17T12:30:00Z');

    expect(formatDateLabel(date, 'en-US', 'hidden')).toBeNull();
    expect(formatDateLabel(date, 'en-US', 'weekday')).toBe('Monday');
    expect(formatWorldTime(date, 'Asia/Tokyo', true, 'en-US')).toMatch(/21:30/);
    expect(getWorldDayOffset(date, Intl.DateTimeFormat().resolvedOptions().timeZone)).toBe(0);
  });
});
