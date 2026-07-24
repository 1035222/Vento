import { motion } from "framer-motion";

const gradients = {
  "clear-day": "linear-gradient(to bottom, #4a90d9, #a8d8f0)",
  "clear-night": "linear-gradient(to bottom, #0b1026, #2c3e6b)",
  "cloudy-day": "linear-gradient(to bottom, #7f8fa4, #c9d3dc)",
  "cloudy-night": "linear-gradient(to bottom, #1c1f2e, #3a3f55)",
  fog: "linear-gradient(to bottom, #9aa5ab, #d6dcdf)",
  rain: "linear-gradient(to bottom, #3a4a5c, #5c7186)",
  snow: "linear-gradient(to bottom, #7c8a9c, #dfe6ec)",
  storm: "linear-gradient(to bottom, #232838, #3d4356)",
};

export default function WeatherBackground({ state, children }) {
  const isRain = state === "rain" || state === "storm";
  const isNight = state.includes("night");

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: gradients[state] || gradients["clear-day"],
        position: "relative",
        overflow: "hidden",
        transition: "background 1.5s ease",
      }}
    >
      {/* Estrellas de noche */}
      {isNight &&
        Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              position: "absolute",
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              width: "2px",
              height: "2px",
              background: "white",
              borderRadius: "50%",
            }}
          />
        ))}

      {/* Nubes moviéndose */}
      {state.includes("cloudy") &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ x: ["-20%", "120%"] }}
            transition={{
              duration: 40 + i * 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: `${10 + i * 15}%`,
              width: "180px",
              height: "60px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "50px",
              filter: "blur(4px)",
            }}
          />
        ))}

      {/* Lluvia */}
      {isRain &&
        Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: "100vh", opacity: [0, 1, 0] }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              width: "1px",
              height: "20px",
              background: "rgba(255,255,255,0.5)",
            }}
          />
        ))}

      {/* Contenido real (temperatura, hora, etc) va encima */}
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
    </div>
  );
}