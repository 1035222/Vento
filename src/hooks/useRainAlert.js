import { useEffect, useRef, useState } from "react";

const THRESHOLD = 60; // % de probabilidad de lluvia a partir del cual avisamos
const CHECK_WINDOW_HOURS = 2; // revisa si va a llover dentro de las próximas 2 horas

export function useRainAlert(hourly, locationName) {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const lastNotifiedRef = useRef(null);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") setAlertsEnabled(true);
  };

  const toggleAlerts = () => {
    if (permission !== "granted") {
      requestPermission();
    } else {
      setAlertsEnabled((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!alertsEnabled || permission !== "granted" || !hourly) return;

    const checkRain = () => {
      const now = new Date();
      const startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
      const window = hourly.precipitation_probability.slice(startIndex, startIndex + CHECK_WINDOW_HOURS);
      const maxProb = Math.max(...window, 0);

      if (maxProb >= THRESHOLD) {
        const todayKey = `${locationName}-${now.toDateString()}-${now.getHours()}`;
        if (lastNotifiedRef.current === todayKey) return; // ya avisamos en esta hora, no repetir

        new Notification(`☔ Va a llover en ${locationName}`, {
          body: `Probabilidad de lluvia: ${maxProb}% en las próximas ${CHECK_WINDOW_HOURS} horas.`,
          icon: "/favicon.svg",
        });
        lastNotifiedRef.current = todayKey;
      }
    };

    checkRain(); // revisa apenas se activa
    const interval = setInterval(checkRain, 15 * 60 * 1000); // y cada 15 minutos mientras la app esté abierta
    return () => clearInterval(interval);
  }, [alertsEnabled, permission, hourly, locationName]);

  return { permission, alertsEnabled, toggleAlerts };
}