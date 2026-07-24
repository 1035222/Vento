import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { X, CloudRain, Loader2, Crosshair } from "lucide-react";
import { getWeather, getWeatherForPoints } from "../api/weather";
import RainHeatLayer from "./RainHeatLayer";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(37,99,235,0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const MIN_ZOOM_FOR_ZONES = 6; // por debajo de esto, el área es demasiado grande para ser precisa

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToUser({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 9);
    }
  }, [position]);
  return null;
}

function ZoneUpdater({ onMove }) {
  const map = useMap();
  useEffect(() => {
    onMove(map.getBounds(), map.getZoom());
  }, []);
  useMapEvents({
    moveend() {
      onMove(map.getBounds(), map.getZoom());
    },
  });
  return null;
}

// La densidad de la cuadrícula se adapta al zoom: más cerca = más puntos = más precisión
function buildGridFromBounds(bounds, zoom) {
  const divisions = zoom >= 10 ? 10 : zoom >= 8 ? 8 : 6;
  const north = bounds.getNorth();
  const south = bounds.getSouth();
  const east = bounds.getEast();
  const west = bounds.getWest();

  const latStep = (north - south) / divisions;
  const lonStep = (east - west) / divisions;

  const points = [];
  for (let i = 0; i <= divisions; i++) {
    for (let j = 0; j <= divisions; j++) {
      points.push({ lat: south + i * latStep, lon: west + j * lonStep });
    }
  }
  return points;
}

export default function WeatherMap({ center, onConfirmLocation, onClose }) {
  const [radarFrame, setRadarFrame] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marker, setMarker] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [zoomTooLow, setZoomTooLow] = useState(false);
  const [mapCenter, setMapCenter] = useState(center);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchRadar = () => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        const frames = data.radar?.past || [];
        if (frames.length > 0) {
          const latest = frames[frames.length - 1];
          setRadarFrame(latest.path);
          setLastUpdate(new Date(latest.time * 1000));
        }
      })
      .catch(() => setRadarFrame(null));
  };

  const fetchZonesForBounds = useCallback((bounds, zoom) => {
    if (zoom < MIN_ZOOM_FOR_ZONES) {
      setZoomTooLow(true);
      setZones([]);
      return;
    }
    setZoomTooLow(false);

    const thisRequestId = ++requestIdRef.current;
    const points = buildGridFromBounds(bounds, zoom);
    setZonesLoading(true);

    getWeatherForPoints(points)
      .then((results) => {
        // Descarta la respuesta si ya se hizo un movimiento más reciente del mapa
        if (thisRequestId !== requestIdRef.current) return;
        const merged = points
          .map((p, i) => ({ ...p, precipitation: results[i]?.current?.precipitation ?? 0 }))
          .filter((p) => p.precipitation > 0);
        setZones(merged);
      })
      .catch(() => {
        if (thisRequestId === requestIdRef.current) setZones([]);
      })
      .finally(() => {
        if (thisRequestId === requestIdRef.current) setZonesLoading(false);
      });
  }, []);

  const handleMapMove = useCallback(
    (bounds, zoom) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchZonesForBounds(bounds, zoom), 700);
    },
    [fetchZonesForBounds]
  );

  useEffect(() => {
    fetchRadar();
    const radarInterval = setInterval(fetchRadar, 5 * 60 * 1000);
    return () => clearInterval(radarInterval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(p);
        setMapCenter(p);
      },
      () => {}
    );
  }, []);

  const handlePick = async (lat, lng) => {
    setMarker([lat, lng]);
    setPointData(null);
    setLoadingPoint(true);
    try {
      const data = await getWeather(lat, lng);
      setPointData(data.current);
    } catch {
      setPointData(null);
    } finally {
      setLoadingPoint(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#000" }}>
      <style>{`
        .dark-tiles .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .dark-tiles .leaflet-tile-pane .radar-layer {
          filter: none;
        }
      `}</style>

      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "1rem", right: "1rem", zIndex: 1001,
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "50%", width: "40px", height: "40px", color: "white",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <X size={20} />
      </button>

      {userPos && (
        <button
          onClick={() => setMapCenter([...userPos])}
          title="Ir a mi ubicación"
          style={{
            position: "absolute", bottom: "1.5rem", right: "1rem", zIndex: 1001,
            background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "50%", width: "44px", height: "44px", color: "white",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Crosshair size={20} />
        </button>
      )}

      <div
        style={{
          position: "absolute", top: "1rem", left: "1rem", zIndex: 1001,
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "10px", padding: "0.5rem 1rem", color: "white", fontSize: "0.85rem",
          display: "flex", alignItems: "center", gap: "8px",
        }}
      >
        <span style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: zonesLoading ? "#facc15" : "#22c55e",
          boxShadow: zonesLoading ? "0 0 6px #facc15" : "0 0 6px #22c55e",
          flexShrink: 0,
        }} />
        {zonesLoading ? "Actualizando zonas..." : "Radar en vivo"}
        {lastUpdate && !zonesLoading && (
          <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>
            · {lastUpdate.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      <div
        style={{
          position: "absolute", top: "3.2rem", left: "1rem", zIndex: 1001,
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "10px", padding: "0.5rem 1rem", color: "white", fontSize: "0.85rem",
          maxWidth: "220px",
        }}
      >
        {zoomTooLow
          ? "Acércate más para ver zonas de lluvia precisas"
          : "Toca cualquier punto para ver el detalle"}
      </div>

      <div
        style={{
          position: "absolute", bottom: "1.5rem", left: "1rem", zIndex: 1001,
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "10px", padding: "0.6rem 0.9rem", color: "white", fontSize: "0.75rem",
        }}
      >
        <p style={{ margin: "0 0 4px 0", opacity: 0.8 }}>Intensidad de lluvia</p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "12px", height: "12px", background: "#3ac4f2", display: "inline-block", borderRadius: "2px" }} />
          Ligera
          <span style={{ width: "12px", height: "12px", background: "#1a5fb4", display: "inline-block", borderRadius: "2px", marginLeft: "8px" }} />
          Moderada
          <span style={{ width: "12px", height: "12px", background: "#7c2d9c", display: "inline-block", borderRadius: "2px", marginLeft: "8px" }} />
          Fuerte
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={7}
        minZoom={3}
        maxZoom={13}
        style={{ width: "100%", height: "100%" }}
        className="dark-tiles"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains="abc"
          maxZoom={19}
          attribution='&copy; OpenStreetMap contributors'
        />
        {radarFrame && (
          <TileLayer
            key={radarFrame}
            url={`https://tilecache.rainviewer.com${radarFrame}/256/{z}/{x}/{y}/2/1_1.png`}
            opacity={0.6}
            maxNativeZoom={7}
            maxZoom={13}
            className="radar-layer"
          />
        )}

        {!zoomTooLow && <RainHeatLayer zones={zones} />}

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        )}

        {marker && (
          <Marker position={marker}>
            <Popup>
              {loadingPoint && (
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Loader2 size={14} /> Cargando...
                </span>
              )}
              {pointData && (
                <div style={{ minWidth: "140px" }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    {Math.round(pointData.temperature_2m)}°C
                  </p>
                  {pointData.precipitation > 0 ? (
                    <p style={{ margin: "4px 0", color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CloudRain size={14} /> Lloviendo ({pointData.precipitation} mm)
                    </p>
                  ) : (
                    <p style={{ margin: "4px 0", opacity: 0.7 }}>Sin lluvia ahora</p>
                  )}
                  <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
                    Humedad {pointData.relative_humidity_2m}% · Viento {pointData.wind_speed_10m} km/h
                  </p>
                  <button
                    onClick={() => onConfirmLocation(marker[0], marker[1])}
                    style={{
                      marginTop: "8px", width: "100%", padding: "6px", border: "none",
                      borderRadius: "6px", background: "#2563eb", color: "white", cursor: "pointer",
                    }}
                  >
                    Ver clima completo aquí
                  </button>
                </div>
              )}
            </Popup>
          </Marker>
        )}

        <ClickHandler onPick={handlePick} />
        <FlyToUser position={userPos} />
        <ZoneUpdater onMove={handleMapMove} />
      </MapContainer>
    </div>
  );
}