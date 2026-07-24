// Genera recomendación de vestimenta basada en datos reales del día
export function getClothingItems({ tempMin, tempMax, uvMax, maxWind, rainProbMax }) {
  const items = [];
  if (rainProbMax >= 40) items.push("umbrella");
  if (uvMax >= 6) items.push("sun");
  if (tempMin < 15) items.push("cold");
  if (tempMax > 28) items.push("light");
  if (maxWind >= 25) items.push("wind");
  if (items.length === 0) items.push("normal");
  return items;
}

// Construye un resumen del día en texto, basado únicamente en los valores reales del pronóstico
export function getDaySummary({ next24, daily }) {
  const tempMax = Math.round(daily.temperature_2m_max[0]);
  const tempMin = Math.round(daily.temperature_2m_min[0]);
  const uv = Math.round(daily.uv_index_max[0]);

  const rainIdx = next24.precip.findIndex((p) => p >= 50);
  let rainPhrase;

  if (rainIdx !== -1) {
    const rainTime = new Date(next24.time[rainIdx]);
    const hour = rainTime.getHours();
    const label = hour === 0 ? "12 a.m." : hour < 12 ? `${hour} a.m.` : hour === 12 ? "12 p.m." : `${hour - 12} p.m.`;
    rainPhrase = ` Probabilidad de lluvia alta (${next24.precip[rainIdx]}%) desde las ${label} — lleva sombrilla.`;
  } else {
    const maxRain = Math.max(...next24.precip, 0);
    rainPhrase = maxRain >= 20
      ? ` Posibilidad baja de lluvia (${maxRain}%).`
      : " Sin lluvia prevista en las próximas 24 horas.";
  }

  let uvPhrase = "";
  if (uv >= 8) uvPhrase = ` Índice UV extremo (${uv}) — evita el sol del mediodía.`;
  else if (uv >= 6) uvPhrase = ` Índice UV alto (${uv}) — usa protector solar.`;

  return `Hoy entre ${tempMin}° y ${tempMax}°.${rainPhrase}${uvPhrase}`;
}