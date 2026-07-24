import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function RainHeatLayer({ zones }) {
  const map = useMap();

  useEffect(() => {
    if (!zones || zones.length === 0) return;

    const points = zones.map((z) => [z.lat, z.lon, Math.min(z.precipitation / 5, 1)]);

    const heat = L.heatLayer(points, {
      radius: 45,
      blur: 35,
      maxZoom: 10,
      minOpacity: 0.35,
      gradient: {
        0.1: "#3ac4f2",
        0.4: "#1a5fb4",
        0.7: "#5b2d91",
        1.0: "#7c2d9c",
      },
    });

    heat.addTo(map);
    return () => map.removeLayer(heat);
  }, [zones, map]);

  return null;
}