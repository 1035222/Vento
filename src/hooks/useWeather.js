import { useState, useEffect, useCallback } from "react";
import { getCoordinates, getWeather, getCityFromCoords } from "../api/weather";

export function useWeather(initialCity = "Medellin") {
  const [city, setCity] = useState(initialCity);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCoordinates(cityName);
      const data = await getWeather(coords.latitude, coords.longitude);
      setLocation(coords);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCityFromCoords(latitude, longitude);
      const data = await getWeather(latitude, longitude);
      setLocation(coords);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización no disponible en este navegador");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => setError("No se pudo obtener tu ubicación")
    );
  }, [fetchWeatherByCoords]);

  useEffect(() => {
    fetchWeather(city);
  }, [city, fetchWeather]);

 return { city, setCity, location, weather, loading, error, useMyLocation, fetchWeatherByCoords };
}