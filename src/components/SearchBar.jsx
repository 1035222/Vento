import { useState } from "react";
import { Search, MapPin } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "16px",
};

export default function SearchBar({ onSearch, onLocate }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ ...glass, padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar ciudad..."
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "white",
          fontSize: "1rem",
          flex: 1,
        }}
      />
      <button
        type="button"
        onClick={onLocate}
        title="Usar mi ubicación"
        style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", display: "flex" }}
      >
        <MapPin size={18} strokeWidth={1.8} />
      </button>
      <button
        type="submit"
        style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", display: "flex" }}
      >
        <Search size={18} strokeWidth={1.8} />
      </button>
    </form>
  );
}