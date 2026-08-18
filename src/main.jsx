import React from "react";
import { createRoot } from "react-dom/client";
import { Clock } from "./Clock.jsx";
import "./tailwind.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Clock />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(new URL("sw.js", window.location.href))
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              window.dispatchEvent(new CustomEvent("app-update-ready"));
            }
          });
        });
      })
      .catch(() => {
        // PWA support is progressive; the app remains fully usable without a service worker.
      });

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "APP_UPDATE_READY") {
        window.dispatchEvent(new CustomEvent("app-update-ready"));
      }
    });
  });
}
