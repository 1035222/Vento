import { Volume2, VolumeX } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "20px",
};

export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? "Silenciar sonido ambiente" : "Activar sonido ambiente"}
      style={{
        ...glass,
        color: "white",
        padding: "0.3rem 0.8rem",
        fontSize: "0.85rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      {enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      Sonido
    </button>
  );
}