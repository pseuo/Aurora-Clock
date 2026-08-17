import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DeskTools } from './DeskTools.jsx';

const labels = {
  addAlarm: 'Add local reminder',
  alarm: 'Alarm',
  alarmTime: 'Reminder time',
  countdown: 'Countdown',
  noAlarms: 'No reminders',
  pomodoro: 'Pomodoro',
  reset: 'Reset',
  soundHint: 'Sound reminders play while this page is open.',
  start: 'Start',
  stop: 'Stop',
};

describe('DeskTools timing', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('calculates countdown remaining time from its end timestamp', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
    render(<DeskTools labels={labels} />);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 4));
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByText('04:55')).toBeInTheDocument();
  });

  it('fires a missed alarm occurrence once', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 59, 30));
    const AudioContext = vi.fn(function AudioContextMock() {
      const gain = { connect: vi.fn() };
      return {
        createGain: () => gain,
        createOscillator: () => ({ connect: () => gain, frequency: { value: 0 }, start: vi.fn(), stop: vi.fn() }),
        currentTime: 0,
        destination: {},
      };
    });
    vi.stubGlobal('AudioContext', AudioContext);
    render(<DeskTools labels={labels} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Alarm' }));
    fireEvent.change(screen.getByLabelText('Reminder time'), { target: { value: '10:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add local reminder' }));
    vi.setSystemTime(new Date(2026, 0, 1, 10, 1, 0));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));

    expect(AudioContext).toHaveBeenCalledTimes(1);
  });
});
