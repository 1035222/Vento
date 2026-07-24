import { Droplet } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "16px",
};

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function DailyForecast({ daily, toDisplay }) {
  return (
    <div style={{ ...glass, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {daily.time.map((date, i) => (
        <div
          key={date}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            fontSize: "0.95rem",
          }}
        >
          <span>{i === 0 ? "Hoy" : dayNames[new Date(date).getDay()]}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <Droplet size={12} /> {daily.precipitation_probability_max[i]}%
          </span>
          <span>
            {toDisplay(daily.temperature_2m_min[i])}° / {toDisplay(daily.temperature_2m_max[i])}°
          </span>
        </div>
      ))}
    </div>
  );
}