const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "16px",
};

export default function TimeScrubber({ times, index, onChange }) {
  const label =
    index === 0
      ? "Ahora"
      : new Date(times[index]).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ ...glass, padding: "1rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem", fontSize: "0.85rem" }}>
        <span style={{ opacity: 0.7 }}>Próximas 24 horas</span>
        <strong>{label}</strong>
      </div>
      <input
        type="range"
        min={0}
        max={times.length - 1}
        step={1}
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#4a90d9", cursor: "pointer" }}
      />
    </div>
  );
}