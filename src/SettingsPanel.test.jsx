import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { copy } from './clockConfig.js';
import { SettingsPanel } from './SettingsPanel.jsx';

const preferences = {
  display: { dateFormat: 'full', displayMode: 'balanced', hourMode: '24', language: 'en', maxWorldClocks: 6, selectedWorldCities: ['tokyo'], worldClockVisible: true },
  visual: { auroraMotion: 'dynamic', autoShift: true, backgroundIntensity: 'normal', desktopMode: false, themeMode: 'auto', wideLayout: false },
  data: { weatherEnabled: false },
};

function TestPanel({ onPreferenceChange = vi.fn(), performanceMode = false, performanceReasons = [], weather = { status: 'idle', labelKey: 'weatherIdle', temp: null, atmosphere: 'clear' }, weatherEnabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  return <SettingsPanel is24Hour isOnline isOpen={isOpen} labels={copy.en} onClose={() => setIsOpen(false)} onInstall={vi.fn()} onPreferenceChange={onPreferenceChange} onToggle={() => setIsOpen((open) => !open)} performanceMode={performanceMode} performanceReasons={performanceReasons} preferences={{ ...preferences, data: { weatherEnabled } }} pwaInstallStatus="installAvailable" weather={weather} />;
}

describe('SettingsPanel', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('applies a setting change', async () => {
    const onPreferenceChange = vi.fn();
    render(<TestPanel onPreferenceChange={onPreferenceChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    const dialog = await screen.findByRole('dialog', { name: 'Settings' });
    fireEvent.click(dialog.querySelector('.setting-row-button'));
    expect(onPreferenceChange).toHaveBeenCalledWith({ visual: { desktopMode: true } }, 'Desktop mode enabled');
  });

  it('shows active low-performance reasons in appearance settings', async () => {
    render(<TestPanel performanceMode performanceReasons={['reducedMotion']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));

    const dialog = await screen.findByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveTextContent('Performance · Aurora static');
    expect(dialog).toHaveTextContent('reduced motion preference');
  });

  it('traps focus in the modal and restores it after closing', async () => {
    render(<TestPanel />);
    const trigger = screen.getByRole('button', { name: 'Settings' });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Settings' });
    const buttons = dialog.querySelectorAll('button:not([disabled])');
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    await waitFor(() => expect(first).toHaveFocus());
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    last.focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(first).toHaveFocus();

    fireEvent.click(first);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('offers manual city setup after location is denied', async () => {
    const onPreferenceChange = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ name: 'Shanghai', country: 'China', latitude: 31.2, longitude: 121.5 }] }),
    }));
    render(<TestPanel onPreferenceChange={onPreferenceChange} weatherEnabled weather={{ status: 'denied', labelKey: 'locationDenied', temp: null, atmosphere: 'clear' }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(await screen.findByRole('button', { name: /Weather atmosphere/i }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Set city manually' }), { target: { value: 'Shanghai' } });
    fireEvent.click(screen.getByRole('button', { name: 'Use this city' }));

    await waitFor(() => expect(onPreferenceChange).toHaveBeenCalledWith(
      { data: { weatherLocation: { latitude: 31.2, longitude: 121.5, name: 'Shanghai, China' } } },
      'Switched to manual city',
    ));
  });
});
