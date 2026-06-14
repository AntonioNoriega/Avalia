// ════════════════════════════════════════════════════════════════
//  Motor de valuación (enfoque comparativo de mercado)
//  Puro: recibe inmueble + comparables y devuelve el cálculo.
// ════════════════════════════════════════════════════════════════

const SCORE_CONSERVA = { nuevo: 1.0, bueno: 0.95, regular: 0.88, remodelar: 0.78 }

// Factor de ajuste de un comparable respecto al inmueble objetivo.
// >1 cuando el objetivo vale más que el comparable.
export function factorAjuste (inmueble, comp) {
  const fConserva = (SCORE_CONSERVA[inmueble.estado_conserva] ?? 0.95) /
                    (SCORE_CONSERVA[comp.estado_conserva] ?? 0.95)
  const fAntig = (1 - (inmueble.antiguedad_anios || 0) * 0.004) /
                 (1 - (comp.antiguedad_anios || 0) * 0.004)
  const fRec = 1 + (((inmueble.recamaras || 0) - (comp.recamaras || 0)) * 0.02)
  const fBan = 1 + (((inmueble.banos || 0) - (comp.banos || 0)) * 0.015)
  let f = fConserva * fAntig * fRec * fBan
  return Math.max(0.7, Math.min(1.4, f)) // acotado
}

// Peso de un comparable: más reciente y más parecido en tamaño => más peso.
function pesoComparable (inmueble, comp) {
  const dias = Math.max(0, (Date.now() - new Date(comp.fecha_operacion).getTime()) / 864e5)
  const pRecencia = Math.exp(-dias / 365) // decae ~1 año
  const difTam = Math.abs((comp.construccion_m2 || 1) - (inmueble.construccion_m2 || 1)) /
                 (inmueble.construccion_m2 || 1)
  const pTam = 1 / (1 + difTam)
  return pRecencia * pTam
}

function stddev (arr, mean) {
  if (arr.length < 2) return 0
  const v = arr.reduce((s, x) => s + (x - mean) ** 2, 0) / (arr.length - 1)
  return Math.sqrt(v)
}

// Calcula la valuación. Devuelve null si no hay comparables suficientes.
export function calcularValuacion (inmueble, comparables) {
  if (!comparables || comparables.length === 0) return null

  const detalle = comparables.map((c) => {
    const factor = factorAjuste(inmueble, c)
    const pm2Ajustado = Number(c.precio_m2) * factor
    const peso = pesoComparable(inmueble, c)
    return { comparable_id: c.id, precio_m2_ajustado: pm2Ajustado, peso, factor_ajuste: factor }
  })

  const sumaPesos = detalle.reduce((s, d) => s + d.peso, 0) || 1
  const pm2Ponderado = detalle.reduce((s, d) => s + d.precio_m2_ajustado * d.peso, 0) / sumaPesos

  const ajustados = detalle.map((d) => d.precio_m2_ajustado)
  const mediaSimple = ajustados.reduce((s, x) => s + x, 0) / ajustados.length
  const desv = stddev(ajustados, mediaSimple)
  const cv = mediaSimple ? desv / mediaSimple : 1 // coef. de variación

  const construccion = Number(inmueble.construccion_m2) || 0
  const estimado = pm2Ponderado * construccion
  const min = Math.max(0, (pm2Ponderado - desv) * construccion)
  const max = (pm2Ponderado + desv) * construccion

  let confianza = 'baja'
  if (comparables.length >= 6 && cv < 0.15) confianza = 'alta'
  else if (comparables.length >= 3 && cv < 0.30) confianza = 'media'

  return {
    valor_estimado: Math.round(estimado),
    valor_min: Math.round(min),
    valor_max: Math.round(max),
    confianza,
    num_comparables: comparables.length,
    precio_m2_ponderado: Math.round(pm2Ponderado),
    detalle: detalle.map((d) => ({
      ...d,
      precio_m2_ajustado: Math.round(d.precio_m2_ajustado),
      peso: Number(d.peso.toFixed(4)),
      factor_ajuste: Number(d.factor_ajuste.toFixed(4)),
    })),
  }
}
