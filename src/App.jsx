import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Map as MapIcon } from "lucide-react";
import { useWeather } from "./hooks/useWeather";
import { useAmbientSound } from "./hooks/useAmbientSound";
import { useRainAlert } from "./hooks/useRainAlert";
import { getWeatherState } from "./utils/weatherCodes";
import { celsiusToFahrenheit } from "./utils/convertTemp";
import { getClothingItems, getDaySummary } from "./utils/dayInsight";
import WeatherBackground from "./components/WeatherBackground";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import WeatherIcon from "./components/WeatherIcon";
import SunArc from "./components/SunArc";
import UnitToggle from "./components/UnitToggle";
import WeatherMap from "./components/WeatherMap";
import TimeScrubber from "./components/TimeScrubber";
import SoundToggle from "./components/SoundToggle";
import AlertToggle from "./components/AlertToggle";
import ShareCard from "./components/ShareCard";
import ShareButton from "./components/ShareButton";
import DayInsight from "./components/DayInsight";

function App() {
  const { location, weather, loading, error, setCity, useMyLocation } = useWeather("Medellin");
  const [unit, setUnit] = useState("C");
  const [showMap, setShowMap] = useState(false);
  const [scrubIndex, setScrubIndex] = useState(0);
  const shareCardRef = useRef(null);

  if (error) return <p style={{ padding: "2rem", color: "white" }}>Error: {error}</p>;

  const next24 = useMemo(() => {
    if (!weather) return null;
    const now = new Date();
    const startIndex = weather.hourly.time.findIndex((t) => new Date(t) >= now);
    const end = startIndex + 24;
    return {
      time: weather.hourly.time.slice(startIndex, end),
      temp: weather.hourly.temperature_2m.slice(startIndex, end),
      code: weather.hourly.weather_code.slice(startIndex, end),
      isDay: weather.hourly.is_day.slice(startIndex, end),
      apparent: weather.hourly.apparent_temperature.slice(startIndex, end),
      wind: weather.hourly.wind_speed_10m.slice(startIndex, end),
      precip: weather.hourly.precipitation_probability.slice(startIndex, end),
    };
  }, [weather]);

  useMemo(() => setScrubIndex(0), [location?.name]);

  const isNow = scrubIndex === 0;
  const displayCode = !loading && weather && next24 ? (isNow ? weather.current.weather_code : next24.code[scrubIndex]) : 0;
  const displayIsDay = !loading && weather && next24 ? (isNow ? weather.current.is_day === 1 : next24.isDay[scrubIndex] === 1) : true;
  const state = !loading && weather && next24 ? getWeatherState(displayCode, displayIsDay) : "clear-day";

  const { enabled: soundEnabled, toggle: toggleSound } = useAmbientSound(state);
  const { permission, alertsEnabled, toggleAlerts } = useRainAlert(weather?.hourly, location?.name);

  if (loading || !weather || !next24) {
    return (
      <WeatherBackground state="clear-day">
        <p style={{ padding: "2rem", color: "white", textAlign: "center" }}>Cargando...</p>
      </WeatherBackground>
    );
  }

  const displayTemp = isNow ? weather.current.temperature_2m : next24.temp[scrubIndex];
  const displayApparent = isNow ? weather.current.apparent_temperature : next24.apparent[scrubIndex];
  const displayWind = isNow ? weather.current.wind_speed_10m : next24.wind[scrubIndex];

  const toDisplay = (celsius) =>
    unit === "C" ? Math.round(celsius) : Math.round(celsiusToFahrenheit(celsius));

  const handleMapPick = () => setShowMap(false);

  const clothingItems = getClothingItems({
    tempMin: weather.daily.temperature_2m_min[0],
    tempMax: weather.daily.temperature_2m_max[0],
    uvMax: weather.daily.uv_index_max[0],
    maxWind: Math.max(...next24.wind),
    rainProbMax: Math.max(...next24.precip, 0),
  });

  const daySummary = getDaySummary({ next24, daily: weather.daily });

  return (
    <WeatherBackground state={state}>
      <div
        style={{
          padding: "1.5rem",
          maxWidth: "480px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <SearchBar onSearch={setCity} onLocate={useMyLocation} />

        <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <UnitToggle unit={unit} onToggle={() => setUnit(unit === "C" ? "F" : "C")} />
          <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
          <AlertToggle permission={permission} alertsEnabled={alertsEnabled} onToggle={toggleAlerts} />
          <ShareButton cardRef={shareCardRef} cityName={location.name} />
          <button
            onClick={() => setShowMap(true)}
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "20px",
              color: "white",
              padding: "0.3rem 0.8rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MapIcon size={14} /> Mapa
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
          >
            <div style={{ textAlign: "center" }}>
              <h1 style={{ margin: 0, fontWeight: 400 }}>{location.name}, {location.country}</h1>
              <motion.div
                key={scrubIndex}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <WeatherIcon state={state} />
              </motion.div>
              <motion.p
                key={`t-${scrubIndex}`}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: "4rem", margin: "0.5rem 0", fontWeight: 200 }}
              >
                {toDisplay(displayTemp)}°{unit}
              </motion.p>
              <p style={{ opacity: 0.8, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                Sensación {toDisplay(displayApparent)}°{unit} · <Wind size={14} /> {displayWind} km/h
              </p>
            </div>

            <DayInsight items={clothingItems} summary={daySummary} />

            <TimeScrubber times={next24.time} index={scrubIndex} onChange={setScrubIndex} />

            <SunArc
              sunrise={weather.daily.sunrise[0]}
              sunset={weather.daily.sunset[0]}
              uvIndex={weather.daily.uv_index_max[0]}
            />

            <HourlyForecast hourly={weather.hourly} toDisplay={toDisplay} />
            <DailyForecast daily={weather.daily} toDisplay={toDisplay} />
          </motion.div>
        </AnimatePresence>
      </div>

      {showMap && location && (
        <WeatherMap
          center={[location.latitude, location.longitude]}
          onConfirmLocation={handleMapPick}
          onClose={() => setShowMap(false)}
        />
      )}

      <ShareCard
        ref={shareCardRef}
        state={state}
        cityName={location.name}
        country={location.country}
        temp={displayTemp}
        code={displayCode}
        unit={unit}
      />
    </WeatherBackground>
  );
}

export default App;