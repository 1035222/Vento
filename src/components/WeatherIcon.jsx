import { motion } from "framer-motion";

export default function WeatherIcon({ state, size = 90 }) {
  const common = { width: size, height: size };

  if (state === "clear-day") {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={common}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="20" fill="#FFD35C" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <rect
                key={i}
                x="48"
                y="8"
                width="4"
                height="14"
                rx="2"
                fill="#FFD35C"
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
        </svg>
      </motion.div>
    );
  }

  if (state === "clear-night") {
    return (
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={common}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path
            d="M65 20a30 30 0 1 0 15 55A35 35 0 0 1 65 20Z"
            fill="#E8EEF5"
          />
        </svg>
      </motion.div>
    );
  }

  if (state === "cloudy-day" || state === "cloudy-night" || state === "fog") {
    return (
      <motion.div
        animate={{ x: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={common}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <ellipse cx="45" cy="55" rx="30" ry="20" fill="#DCE4EC" />
          <ellipse cx="65" cy="45" rx="22" ry="18" fill="#EDF1F5" />
        </svg>
      </motion.div>
    );
  }

  if (state === "rain") {
    return (
      <div style={{ ...common, position: "relative" }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <ellipse cx="50" cy="42" rx="30" ry="20" fill="#B5C4D6" />
        </svg>
        <div style={{ position: "absolute", inset: 0, top: "45%" }}>
          {[20, 40, 60, 80].map((x, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 20], opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
              style={{
                position: "absolute",
                left: `${x}%`,
                width: "2px",
                height: "12px",
                background: "#7FA8D9",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (state === "storm") {
    return (
      <div style={{ ...common, position: "relative" }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <ellipse cx="50" cy="42" rx="30" ry="20" fill="#8B96A8" />
        </svg>
        <motion.svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        >
          <polygon points="52,50 42,70 50,70 45,90 65,62 55,62 60,50" fill="#FFD35C" />
        </motion.svg>
      </div>
    );
  }

  if (state === "snow") {
    return (
      <div style={{ ...common, position: "relative" }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <ellipse cx="50" cy="42" rx="30" ry="20" fill="#DCE4EC" />
        </svg>
        {[20, 40, 60, 80].map((x, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, 25], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: "50%",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "white",
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}