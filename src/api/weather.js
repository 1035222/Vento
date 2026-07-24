const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Convierte el nombre de una ciudad en coordenadas
export async function getCoordinates(city) {
  const response = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=es&format=json`
  );
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Ciudad no encontrada");
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}

// Convierte coordenadas en nombre de ciudad (geocoding inverso vía Nominatim/OpenStreetMap)
export async function getCityFromCoords(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`
    );
    const data = await response.json();

    const name =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      "Mi ubicación";
    const country = data.address?.country || "";

    return { latitude, longitude, name, country };
  } catch {
    return { latitude, longitude, name: "Mi ubicación", country: "" };
  }
}

// Trae el clima actual, por horas y por días
export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day",
    hourly: "temperature_2m,precipitation_probability,weather_code,is_day,apparent_temperature,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) throw new Error("Error al consultar el clima");

  return response.json();
}
// Trae precipitación actual de varios puntos a la vez (para zonas de lluvia en el mapa)
export async function getWeatherForPoints(points) {
  const params = new URLSearchParams({
    latitude: points.map((p) => p.lat).join(","),
    longitude: points.map((p) => p.lon).join(","),
    current: "precipitation,weather_code",
    timezone: "auto",
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) throw new Error("Error al consultar zonas");

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}