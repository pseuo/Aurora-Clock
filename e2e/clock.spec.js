import { expect, test } from "@playwright/test";

const preferences = {
  version: 5,
  display: {
    hourMode: "24",
    language: "en",
    dateFormat: "full",
    worldClockVisible: true,
    selectedWorldCities: ["tokyo", "london", "new-york"],
    maxWorldClocks: 6,
    displayMode: "balanced",
  },
  visual: {
    themeMode: "auto",
    backgroundIntensity: "normal",
    auroraMotion: "static",
    desktopMode: false,
    autoShift: true,
    wideLayout: false,
  },
  data: { weatherEnabled: false, weatherLocation: null },
};

async function loadClock(page, overrides = {}) {
  const nextPreferences = {
    ...preferences,
    ...overrides,
    display: { ...preferences.display, ...overrides.display },
    visual: { ...preferences.visual, ...overrides.visual },
    data: { ...preferences.data, ...overrides.data },
  };
  await page.addInitScript((savedPreferences) => {
    if (!window.localStorage.getItem("time-preferences")) {
      window.localStorage.setItem(
        "time-preferences",
        JSON.stringify(savedPreferences),
      );
    }
  }, nextPreferences);
  await page.goto("/");
}

test("persists the selected presentation mode after reload", async ({
  page,
}) => {
  await loadClock(page);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Minimal large type" }).click();
  await expect(
    page.getByRole("button", { name: "Minimal large type" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(
    page.getByRole("button", { name: "Minimal large type" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("requests fullscreen from the time settings", async ({ page }) => {
  await page.addInitScript(() => {
    window.__fullscreenRequested = false;
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      writable: true,
      value: async () => {
        window.__fullscreenRequested = true;
      },
    });
  });
  await loadClock(page);
  await expect(
    page.locator('section[aria-label="World clocks"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Time" }).click();
  await page.getByRole("button", { name: "Toggle fullscreen" }).click();

  await expect
    .poll(() => page.evaluate(() => window.__fullscreenRequested))
    .toBe(true);
});

test("loads the cached application shell while offline", async ({
  context,
  page,
}) => {
  await loadClock(page);
  await page.waitForFunction(() => navigator.serviceWorker?.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker?.controller);
  await context.setOffline(true);
  await page.reload();

  await expect(
    page.getByRole("heading", { name: "Aurora Clock" }),
  ).toBeAttached();
});

test("shows the update prompt when the service worker signals an update", async ({
  page,
}) => {
  await loadClock(page);
  await page.evaluate(() =>
    window.dispatchEvent(new CustomEvent("app-update-ready")),
  );
  await expect(
    page.getByText("New version is ready. Refresh to update"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
});

test("exports and validates imported preferences", async ({ page }) => {
  await loadClock(page);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "App", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "aurora-clock-preferences.json",
  );

  await page.locator('textarea[aria-label="Migration code"]').fill("invalid");
  await page.locator("button").filter({ hasText: "Import JSON" }).click();
  await expect(
    page.getByText("This migration code is invalid. Check it and try again."),
  ).toBeVisible();

  await page.locator('input[accept="application/json,.json"]').setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from("{ invalid json"),
  });
  await expect(
    page.getByText(
      "This JSON file is invalid. Choose a preference export file.",
    ),
  ).toBeVisible();

  await page.locator('input[accept="application/json,.json"]').setInputFiles({
    name: "preferences.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        ...preferences,
        display: { ...preferences.display, language: "zh" },
      }),
    ),
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(window.localStorage.getItem("time-preferences")).display
            .language,
      ),
    )
    .toBe("zh");
  await expect(
    page.getByText(
      "Your current preferences were backed up and the import was restored.",
    ),
  ).toBeVisible();
});

test("confirms resetting preferences and reports the result", async ({
  page,
}) => {
  await loadClock(page, { display: { hourMode: "12" } });
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "App", exact: true }).click();
  await page.getByRole("button", { name: "Reset defaults" }).click();

  await expect(
    page.getByRole("alertdialog", { name: "Restore default preferences?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Restore defaults" }).click();
  await expect(page.getByText("Default preferences restored.")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(window.localStorage.getItem("time-preferences")).display
            .hourMode,
      ),
    )
    .toBe("24");
});

test("keeps controls usable on phone portrait and landscape", async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await loadClock(page);
    await expect(page.getByRole("button", { name: "Settings" })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    await page.getByRole("button", { name: "Settings" }).click();
    await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
    await page.getByRole("button", { name: "Close settings" }).click();
  }
});

test("uses the static performance mode when reduced motion is enabled", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await loadClock(page);
  await page.getByRole("button", { name: "Settings" }).click();

  const settings = page.getByRole("dialog", { name: "Settings" });
  await expect(settings).toContainText("Performance · Aurora static");
  await expect(settings).toContainText("reduced motion preference");
});

test("loads weather after location access is authorized", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["geolocation"], {
    origin: "http://127.0.0.1:4173",
  });
  await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 });
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        current: {
          apparent_temperature: 21,
          temperature_2m: 22,
          time: "2026-08-18T12:00",
          weather_code: 0,
        },
        hourly: {
          precipitation_probability: [0],
          time: ["2026-08-18T12:00"],
        },
      }),
    }),
  );
  await loadClock(page);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: /Weather atmosphere/ }).click();
  await page.getByRole("button", { name: "Enable weather atmosphere" }).click();

  await expect(page.getByText("Clear 22°C").first()).toBeVisible();
});
