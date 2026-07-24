// Referencia: https://open-meteo.com/en/docs (WMO Weather codes)
export function getWeatherState(code, isDay) {
  if (code === 0) return isDay ? "clear-day" : "clear-night";
  if (code >= 1 && code <= 3) return isDay ? "cloudy-day" : "cloudy-night";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 95) return "storm";
  return isDay ? "clear-day" : "clear-night";
}
export function getWeatherLabel(code) {
  if (code === 0) return "Despejado";
  if (code >= 1 && code <= 3) return "Nublado";
  if (code === 45 || code === 48) return "Niebla";
  if (code >= 51 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "Nieve";
  if (code >= 80 && code <= 82) return "Lluvia";
  if (code >= 95) return "Tormenta";
  return "Despejado";
}