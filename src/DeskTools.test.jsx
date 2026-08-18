import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DeskTools } from "./DeskTools.jsx";

const labels = {
  addAlarm: "Add local reminder",
  alarm: "Alarm",
  alarmTime: "Reminder time",
  advanceNotice: "Advance notice",
  advanceNoticeMinutes: (minutes) =>
    minutes ? `${minutes} minutes early` : "On time",
  countdown: "Countdown",
  noAlarms: "No reminders",
  pomodoro: "Pomodoro",
  reset: "Reset",
  reminderDate: "Date",
  reminderDue: "Reminder due",
  reminderName: "Reminder name",
  reminderNamePlaceholder: "For example: Drink water",
  reminderRepeat: "Repeat",
  reminderRepeatLabels: {
    daily: "Daily",
    weekdays: "Weekdays",
    once: "One time",
  },
  snooze: "Snooze",
  snoozeMinutes: (minutes) => `In ${minutes} minutes`,
  snoozeNow: "Snooze reminder",
  soundHint: "Sound reminders play while this page is open.",
  start: "Start",
  stop: "Stop",
};

describe("DeskTools timing", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("calculates countdown remaining time from its end timestamp", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
    render(<DeskTools labels={labels} />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 4));
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByText("04:55")).toBeInTheDocument();
  });

  it("restores a running countdown from its absolute end time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
    render(
      <DeskTools
        countdown={{
          endsAt: new Date(2026, 0, 1, 12, 25, 0).getTime(),
          mode: "pomodoro",
          paused: false,
          remainingSeconds: 25 * 60,
        }}
        labels={labels}
      />,
    );

    expect(screen.getByRole("tab", { name: "Pomodoro" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    vi.setSystemTime(new Date(2026, 0, 1, 12, 5, 0));
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByText("19:59")).toBeInTheDocument();
  });

  it("reports pause state and remaining time to persistent storage", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
    const onCountdownChange = vi.fn();
    const countdown = {
      endsAt: null,
      mode: "countdown",
      paused: true,
      remainingSeconds: 5 * 60,
    };
    const { rerender } = render(
      <DeskTools
        countdown={countdown}
        labels={labels}
        onCountdownChange={onCountdownChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    const runningCountdown = onCountdownChange.mock.calls[0][0];
    expect(runningCountdown).toMatchObject({
      endsAt: new Date(2026, 0, 1, 12, 5, 0).getTime(),
      mode: "countdown",
      paused: false,
      remainingSeconds: 5 * 60,
    });

    rerender(
      <DeskTools
        countdown={runningCountdown}
        labels={labels}
        onCountdownChange={onCountdownChange}
      />,
    );
    vi.setSystemTime(new Date(2026, 0, 1, 12, 1, 0));
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));

    expect(onCountdownChange).toHaveBeenLastCalledWith({
      endsAt: null,
      mode: "countdown",
      paused: true,
      remainingSeconds: 4 * 60,
    });
  });

  it("fires a missed alarm occurrence once", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 59, 30));
    const AudioContext = vi.fn(function AudioContextMock() {
      const gain = { connect: vi.fn() };
      return {
        createGain: () => gain,
        createOscillator: () => ({
          connect: () => gain,
          frequency: { value: 0 },
          start: vi.fn(),
          stop: vi.fn(),
        }),
        currentTime: 0,
        destination: {},
      };
    });
    vi.stubGlobal("AudioContext", AudioContext);
    render(<DeskTools labels={labels} />);

    fireEvent.click(screen.getByRole("tab", { name: "Alarm" }));
    fireEvent.change(screen.getByLabelText("Reminder time"), {
      target: { value: "10:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add local reminder" }));
    vi.setSystemTime(new Date(2026, 0, 1, 10, 1, 0));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));

    expect(AudioContext).toHaveBeenCalledTimes(1);
  });

  it("uses arrow keys to select associated tab panels", () => {
    render(<DeskTools labels={labels} />);
    const countdown = screen.getByRole("tab", { name: "Countdown" });

    expect(countdown).toHaveAttribute(
      "aria-controls",
      "desk-tool-panel-countdown",
    );
    fireEvent.keyDown(countdown, { key: "ArrowRight" });

    const pomodoro = screen.getByRole("tab", { name: "Pomodoro" });
    expect(pomodoro).toHaveFocus();
    expect(pomodoro).toHaveAttribute("aria-selected", "true");
    expect(document.getElementById("desk-tool-panel-pomodoro")).toHaveAttribute(
      "aria-labelledby",
      "desk-tool-tab-pomodoro",
    );
  });

  it("stores names, one-time dates, and notification options for reminders", () => {
    const onAlarmsChange = vi.fn();
    render(
      <DeskTools alarms={[]} labels={labels} onAlarmsChange={onAlarmsChange} />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Alarm" }));
    fireEvent.change(screen.getByLabelText("Reminder name"), {
      target: { value: "Project handoff" },
    });
    fireEvent.change(screen.getByLabelText("Reminder time"), {
      target: { value: "10:00" },
    });
    fireEvent.change(screen.getByLabelText("Repeat"), {
      target: { value: "once" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-01-02" },
    });
    fireEvent.change(screen.getByLabelText("Advance notice"), {
      target: { value: "15" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add local reminder" }));

    expect(onAlarmsChange).toHaveBeenLastCalledWith([
      expect.objectContaining({
        advanceMinutes: 15,
        date: "2026-01-02",
        name: "Project handoff",
        repeat: "once",
        snoozeMinutes: 10,
      }),
    ]);
  });
});
