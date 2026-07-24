import { Umbrella, Sun, Snowflake, Shirt, Wind, Check } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "16px",
};

const iconMap = {
  umbrella: { Icon: Umbrella, label: "Sombrilla" },
  sun: { Icon: Sun, label: "Protector solar" },
  cold: { Icon: Snowflake, label: "Chaqueta" },
  light: { Icon: Shirt, label: "Ropa ligera" },
  wind: { Icon: Wind, label: "Cortavientos" },
  normal: { Icon: Check, label: "Sin sorpresas hoy" },
};

export default function DayInsight({ items, summary }) {
  return (
    <div style={{ ...glass, padding: "1rem", color: "white" }}>
      <p style={{ margin: "0 0 0.8rem 0", fontSize: "0.9rem", lineHeight: 1.5 }}>{summary}</p>
      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
        {items.map((key) => {
          const { Icon, label } = iconMap[key];
          return (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(255,255,255,0.12)",
                borderRadius: "10px",
                padding: "0.4rem 0.7rem",
                fontSize: "0.8rem",
              }}
            >
              <Icon size={14} /> {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}