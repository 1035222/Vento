import { Bell, BellOff, BellRing } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "20px",
};

export default function AlertToggle({ permission, alertsEnabled, onToggle }) {
  const denied = permission === "denied";

  const icon = denied ? <BellOff size={14} /> : alertsEnabled ? <BellRing size={14} /> : <Bell size={14} />;
  const label = denied ? "Bloqueadas" : alertsEnabled ? "Alertas ON" : "Alertas";

  return (
    <button
      onClick={onToggle}
      disabled={denied}
      title={
        denied
          ? "Activa las notificaciones desde la configuración del navegador"
          : "Avisarte cuando esté por llover"
      }
      style={{
        ...glass,
        color: "white",
        padding: "0.3rem 0.8rem",
        fontSize: "0.85rem",
        cursor: denied ? "not-allowed" : "pointer",
        opacity: denied ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      {icon} {label}
    </button>
  );
}