import { forwardRef } from "react";
import { getWeatherLabel } from "../utils/weatherCodes";

const gradients = {
  "clear-day": "linear-gradient(160deg, #4a90d9, #a8d8f0)",
  "clear-night": "linear-gradient(160deg, #0b1026, #2c3e6b)",
  "cloudy-day": "linear-gradient(160deg, #7f8fa4, #c9d3dc)",
  "cloudy-night": "linear-gradient(160deg, #1c1f2e, #3a3f55)",
  fog: "linear-gradient(160deg, #9aa5ab, #d6dcdf)",
  rain: "linear-gradient(160deg, #3a4a5c, #5c7186)",
  snow: "linear-gradient(160deg, #7c8a9c, #dfe6ec)",
  storm: "linear-gradient(160deg, #232838, #3d4356)",
};

const ShareCard = forwardRef(({ state, cityName, country, temp, code, unit }, ref) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <div
        ref={ref}
        style={{
          width: "360px",
          height: "640px",
          background: gradients[state] || gradients["clear-day"],
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2.5rem 2rem",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.3rem", margin: 0, fontWeight: 500 }}>
            {cityName}{country ? `, ${country}` : ""}
          </p>
          <p style={{ fontSize: "0.9rem", opacity: 0.8, margin: "0.3rem 0 0 0" }}>
            {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "6.5rem", margin: 0, fontWeight: 200, lineHeight: 1 }}>
            {Math.round(temp)}°{unit}
          </p>
          <p style={{ fontSize: "1.3rem", margin: "0.5rem 0 0 0", opacity: 0.9 }}>
            {getWeatherLabel(code)}
          </p>
        </div>

        <div style={{ textAlign: "center", opacity: 0.6, fontSize: "0.85rem" }}>
          Vento — el clima como nunca lo habías visto
        </div>
      </div>
    </div>
  );
});

export default ShareCard;