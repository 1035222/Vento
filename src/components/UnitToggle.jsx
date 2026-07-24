const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "20px",
};

export default function UnitToggle({ unit, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        ...glass,
        color: "white",
        border: "1px solid rgba(255,255,255,0.25)",
        padding: "0.3rem 0.8rem",
        fontSize: "0.85rem",
        cursor: "pointer",
        alignSelf: "center",
      }}
    >
      °C / °F: <strong>{unit}</strong>
    </button>
  );
}