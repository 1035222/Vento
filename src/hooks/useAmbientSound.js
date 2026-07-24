import { useRef, useState, useCallback, useEffect } from "react";

function createNoiseBuffer(context, seconds = 3) {
  const bufferSize = context.sampleRate * seconds;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// Perfil de sonido según el tipo de clima: filtro, volumen y "ráfagas"
function getSoundProfile(state) {
  if (state === "storm") return { filterType: "bandpass", freq: 1200, Q: 0.6, gain: 0.32, gustSpeed: 0.15, gustDepth: 0.08 };
  if (state === "rain") return { filterType: "bandpass", freq: 1500, Q: 0.5, gain: 0.26, gustSpeed: 0.1, gustDepth: 0.05 };
  if (state === "cloudy-day" || state === "cloudy-night" || state === "fog") return { filterType: "lowpass", freq: 500, Q: 0.4, gain: 0.13, gustSpeed: 0.06, gustDepth: 0.06 };
  if (state === "snow") return { filterType: "lowpass", freq: 350, Q: 0.3, gain: 0.09, gustSpeed: 0.04, gustDepth: 0.03 };
  if (state === "clear-night") return { filterType: "lowpass", freq: 250, Q: 0.3, gain: 0.05, gustSpeed: 0.03, gustDepth: 0.02 };
  return { filterType: "lowpass", freq: 300, Q: 0.3, gain: 0.07, gustSpeed: 0.05, gustDepth: 0.03 }; // clear-day
}

export function useAmbientSound(state) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef(null);
  const sourceRef = useRef(null);
  const filterRef = useRef(null);
  const gainRef = useRef(null);
  const lfoRef = useRef(null);
  const lfoGainRef = useRef(null);

  const stopEngine = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch {}
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (lfoRef.current) {
      try { lfoRef.current.stop(); } catch {}
      lfoRef.current.disconnect();
      lfoRef.current = null;
    }
  }, []);

  const applyProfile = useCallback((currentState, fadeIn = false) => {
    const ctx = ctxRef.current;
    if (!ctx || !filterRef.current || !gainRef.current || !lfoRef.current || !lfoGainRef.current) return;

    const profile = getSoundProfile(currentState);
    const now = ctx.currentTime;

    filterRef.current.type = profile.filterType;
    filterRef.current.frequency.setTargetAtTime(profile.freq, now, 1.5);
    filterRef.current.Q.setTargetAtTime(profile.Q, now, 1.5);

    if (fadeIn) {
      gainRef.current.gain.setTargetAtTime(0, now, 0.05);
      gainRef.current.gain.setTargetAtTime(profile.gain, now + 0.1, 1.2);
    } else {
      gainRef.current.gain.setTargetAtTime(profile.gain, now, 1.5);
    }

    lfoRef.current.frequency.setTargetAtTime(profile.gustSpeed, now, 1);
    lfoGainRef.current.gain.setTargetAtTime(profile.gustDepth * profile.gain, now, 1);
  }, []);

  const startEngine = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    gain.gain.value = 0;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    lfo.start();

    sourceRef.current = noise;
    filterRef.current = filter;
    gainRef.current = gain;
    lfoRef.current = lfo;
    lfoGainRef.current = lfoGain;

    applyProfile(state, true);
  }, [state, applyProfile]);

  const toggle = useCallback(() => {
    if (!enabled) {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (ctxRef.current.state === "suspended") {
        ctxRef.current.resume();
      }
      startEngine();
      setEnabled(true);
    } else {
      const ctx = ctxRef.current;
      if (gainRef.current && ctx) {
        gainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      }
      setTimeout(() => stopEngine(), 500);
      setEnabled(false);
    }
  }, [enabled, startEngine, stopEngine]);

  // Ajusta el sonido suavemente cuando cambia el clima, sin cortar el audio
  useEffect(() => {
    if (enabled) applyProfile(state, false);
  }, [state, enabled, applyProfile]);

  useEffect(() => stopEngine, [stopEngine]);

  return { enabled, toggle };
}