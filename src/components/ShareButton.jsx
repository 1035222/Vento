import { useState } from "react";
import { toPng } from "html-to-image";
import { Share2, Loader2 } from "lucide-react";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "20px",
};

export default function ShareButton({ cardRef, cityName }) {
  const [generating, setGenerating] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `vento-${cityName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generando la tarjeta:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={generating}
      style={{
        ...glass,
        color: "white",
        padding: "0.3rem 0.8rem",
        fontSize: "0.85rem",
        cursor: generating ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      {generating ? <Loader2 size={14} className="spin" /> : <Share2 size={14} />}
      Compartir
    </button>
  );
}