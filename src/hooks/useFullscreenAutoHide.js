import { useEffect, useState } from 'react';

export function useFullscreenAutoHide() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      window.setTimeout(() => setIsUiHidden(false), 0);
      return undefined;
    }

    let hideTimer = window.setTimeout(() => setIsUiHidden(true), 2000);
    const reveal = () => {
      setIsUiHidden((hidden) => (hidden ? false : hidden));
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setIsUiHidden(true), 2000);
    };

    window.addEventListener('mousemove', reveal, { passive: true });
    window.addEventListener('touchstart', reveal, { passive: true });
    window.addEventListener('keydown', reveal);
    document.addEventListener('focusin', reveal);
    return () => {
      window.clearTimeout(hideTimer);
      window.removeEventListener('mousemove', reveal);
      window.removeEventListener('touchstart', reveal);
      window.removeEventListener('keydown', reveal);
      document.removeEventListener('focusin', reveal);
    };
  }, [isFullscreen]);

  return isUiHidden;
}
