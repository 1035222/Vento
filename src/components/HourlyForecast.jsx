import { Droplet } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "16px",
};

export default function HourlyForecast({ hourly, toDisplay }) {
  const now = new Date();
  const startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
  const slice = (arr) => arr.slice(startIndex, startIndex + 8);

  const times = slice(hourly.time);
  const temps = slice(hourly.temperature_2m);
  const precip = slice(hourly.precipitation_probability);

  return (
    <div style={{ ...glass, padding: "1rem", display: "flex", gap: "1.5rem", overflowX: "auto" }}>
      {times.map((t, i) => (
        <div key={t} style={{ textAlign: "center", color: "white", minWidth: "50px" }}>
          <p style={{ fontSize: "0.8rem", opacity: 0.8, margin: 0 }}>
            {new Date(t).getHours()}:00
          </p>
          <p style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "0.3rem 0" }}>
            {toDisplay(temps[i])}°
          </p>
          <p style={{ fontSize: "0.75rem", opacity: 0.7, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <Droplet size={11} /> {precip[i]}%
          </p>
        </div>
      ))}
    </div>
  );
}