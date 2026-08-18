import { useCallback, useEffect, useState } from "react";

function isStandalonePwa() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function useAppLifecycle({ installInstalledLabel, onAppInstalled }) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(() => isStandalonePwa());
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isStandalonePwa()) return undefined;

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsPwaInstalled(true);
      onAppInstalled(installInstalledLabel);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [installInstalledLabel, onAppInstalled]);

  useEffect(() => {
    const handleAppUpdateReady = () => setUpdateReady(true);
    window.addEventListener("app-update-ready", handleAppUpdateReady);
    return () =>
      window.removeEventListener("app-update-ready", handleAppUpdateReady);
  }, []);

  const install = useCallback(async () => {
    if (!installPrompt) return false;
    await installPrompt.prompt();
    setInstallPrompt(null);
    return true;
  }, [installPrompt]);

  return {
    install,
    isOnline,
    isPwaInstalled,
    pwaInstallStatus: isPwaInstalled
      ? "installInstalled"
      : installPrompt
        ? "installAvailable"
        : "installUnsupported",
    updateReady,
  };
}
