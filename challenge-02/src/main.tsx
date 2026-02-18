import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/* Registro del Service Worker (PWA)
   - Comprobamos si el navegador soporta service workers
   - Registramos el archivo estático `service-worker.js` desde `public/`
   - Esto permite estrategias de cache definidas en el service worker
*/
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker registrado"))
      .catch((err) => console.log("Error registrando Service Worker:", err));
  });
}
