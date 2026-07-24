import { Sunrise, Sunset } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "16px",
};

function uvLabel(uv) {
  if (uv <= 2) return "Bajo";
  if (uv <= 5) return "Moderado";
  if (uv <= 7) return "Alto";
  if (uv <= 10) return "Muy alto";
  return "Extremo";
}

export default function SunArc({ sunrise, sunset, uvIndex }) {
  const now = new Date();
  const rise = new Date(sunrise);
  const set = new Date(sunset);

  const total = set - rise;
  const elapsed = now - rise;
  const progress = Math.min(Math.max(elapsed / total, 0), 1);

  const angle = 180 - progress * 180;
  const rad = (angle * Math.PI) / 180;
  const cx = 100 + 80 * Math.cos(rad);
  const cy = 90 - 80 * Math.sin(rad);

  const formatTime = (d) =>
    d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ ...glass, padding: "1rem", color: "white" }}>
      <svg viewBox="0 0 200 100" width="100%" height="90">
        <path d="M20 90 A80 80 0 0 1 180 90" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
        {now >= rise && now <= set && (
          <circle cx={cx} cy={cy} r="6" fill="#FFD35C" />
        )}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Sunrise size={14} /> {formatTime(rise)}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Sunset size={14} /> {formatTime(set)}
        </span>
      </div>
      <div style={{ textAlign: "center", marginTop: "0.6rem", fontSize: "0.85rem", opacity: 0.9 }}>
        Índice UV: {Math.round(uvIndex)} · {uvLabel(uvIndex)}
      </div>
    </div>
  );
}