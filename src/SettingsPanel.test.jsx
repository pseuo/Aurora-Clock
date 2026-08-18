import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { copy } from "./clockConfig.js";
import { SettingsPanel } from "./SettingsPanel.jsx";

const preferences = {
  display: {
    dateFormat: "full",
    displayMode: "balanced",
    hourMode: "24",
    language: "en",
    maxWorldClocks: 6,
    selectedWorldCities: ["tokyo"],
    worldClockVisible: true,
  },
  visual: {
    auroraMotion: "dynamic",
    autoShift: true,
    backgroundIntensity: "normal",
    desktopMode: false,
    themeMode: "auto",
    wideLayout: false,
  },
  data: { weatherEnabled: false },
};

function TestPanel({
  onImportPreferences = vi.fn(() => true),
  onPreferenceChange = vi.fn(),
  onResetPreferences = vi.fn(),
  performanceMode = false,
  performanceReasons = [],
  weather = {
    status: "idle",
    labelKey: "weatherIdle",
    temp: null,
    atmosphere: "clear",
  },
  weatherEnabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    endsAt: null,
    mode: "countdown",
    paused: true,
    remainingSeconds: 5 * 60,
  });
  const handlePreferenceChange = (changes, ...args) => {
    if (changes.data?.countdown) setCountdown(changes.data.countdown);
    onPreferenceChange(changes, ...args);
  };
  return (
    <SettingsPanel
      is24Hour
      isOnline
      isOpen={isOpen}
      labels={copy.en}
      onClose={() => setIsOpen(false)}
      onInstall={vi.fn()}
      onImportPreferences={onImportPreferences}
      onPreferenceChange={handlePreferenceChange}
      onResetPreferences={onResetPreferences}
      onToggle={() => setIsOpen((open) => !open)}
      performanceMode={performanceMode}
      performanceReasons={performanceReasons}
      preferences={{
        ...preferences,
        data: { countdown, weatherEnabled },
      }}
      pwaInstallStatus="installAvailable"
      weather={weather}
    />
  );
}

describe("SettingsPanel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("applies a setting change", async () => {
    const onPreferenceChange = vi.fn();
    render(<TestPanel onPreferenceChange={onPreferenceChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    fireEvent.click(dialog.querySelector(".setting-row-button"));
    expect(onPreferenceChange).toHaveBeenCalledWith(
      { visual: { desktopMode: true } },
      "Desktop mode enabled",
    );
  });

  it("offers to hide world clocks when they are visible", async () => {
    render(<TestPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.click(screen.getByRole("button", { name: /World clocks/ }));

    expect(
      screen.getByRole("button", { name: /Hide world clocks/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows active low-performance reasons in appearance settings", async () => {
    render(
      <TestPanel performanceMode performanceReasons={["reducedMotion"]} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));

    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveTextContent("Performance · Aurora static");
    expect(dialog).toHaveTextContent("reduced motion preference");
  });

  it("traps focus in the modal and restores it after closing", async () => {
    render(<TestPanel />);
    const trigger = screen.getByRole("button", { name: "Settings" });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    const buttons = [
      ...dialog.querySelectorAll("button:not([disabled])"),
    ].filter((button) => !button.closest("[hidden]"));
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    await waitFor(() => expect(first).toHaveFocus());
    expect(dialog).toHaveAttribute("aria-modal", "true");

    last.focus();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(first).toHaveFocus();

    fireEvent.click(first);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("offers manual city setup after location is denied", async () => {
    const onPreferenceChange = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              name: "Shanghai",
              country: "China",
              latitude: 31.2,
              longitude: 121.5,
            },
          ],
        }),
      }),
    );
    render(
      <TestPanel
        onPreferenceChange={onPreferenceChange}
        weatherEnabled
        weather={{
          status: "denied",
          labelKey: "locationDenied",
          temp: null,
          atmosphere: "clear",
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.click(
      await screen.findByRole("button", { name: /Weather atmosphere/i }),
    );
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Set city manually" }),
      { target: { value: "Shanghai" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Use this city" }));

    await waitFor(() =>
      expect(onPreferenceChange).toHaveBeenCalledWith(
        {
          data: {
            weatherLocation: {
              latitude: 31.2,
              longitude: 121.5,
              name: "Shanghai, China",
            },
          },
        },
        "Switched to manual city",
      ),
    );
  });

  it("keeps desktop tools running while switching sections and closing settings", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
    render(<TestPanel />);
    const settingsButton = document.querySelector(
      'button[aria-controls="settings-panel"]',
    );
    fireEvent.click(settingsButton);
    fireEvent.click(screen.getByRole("button", { name: /Desk tools/ }));
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    fireEvent.click(screen.getByRole("button", { name: /Appearance/ }));
    fireEvent.click(settingsButton);

    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 4));
    act(() => vi.advanceTimersByTime(1000));

    fireEvent.click(settingsButton);
    fireEvent.click(screen.getByRole("button", { name: /Desk tools/ }));
    expect(screen.getByText("04:55")).toBeInTheDocument();
  });

  it("requires confirmation before restoring default preferences", async () => {
    const onResetPreferences = vi.fn();
    render(<TestPanel onResetPreferences={onResetPreferences} />);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.click(screen.getByRole("button", { name: "App" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset defaults" }));

    expect(
      screen.getByRole("alertdialog", { name: "Restore default preferences?" }),
    ).toBeInTheDocument();
    expect(onResetPreferences).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Restore defaults" }));
    expect(onResetPreferences).toHaveBeenCalledOnce();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Default preferences restored.",
    );
  });
});
