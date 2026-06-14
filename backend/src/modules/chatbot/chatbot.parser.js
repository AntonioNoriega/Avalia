// ── Parser de intención en español (sin dependencias externas) ──
const TIPOS = {
  casa: 'casa', departamento: 'departamento', depa: 'departamento', depto: 'departamento',
  terreno: 'terreno', lote: 'terreno', local: 'local', oficina: 'oficina',
}
const CONSERVA = {
  nuevo: 'nuevo', nueva: 'nuevo', bueno: 'bueno', buen: 'bueno',
  regular: 'regular', remodelar: 'remodelar', viejo: 'remodelar',
}

export function parseInmueble (texto) {
  const t = (texto || '').toLowerCase()
  const out = {}

  for (const [k, v] of Object.entries(TIPOS)) if (t.includes(k)) { out.tipo = v; break }
  for (const [k, v] of Object.entries(CONSERVA)) if (t.includes(k)) { out.estado_conserva = v; break }

  const num = (re) => { const m = t.match(re); return m ? Number(m[1]) : undefined }
  out.construccion_m2 = num(/(\d{2,4})\s*(?:m2|m²|metros)/)
  out.recamaras       = num(/(\d{1,2})\s*(?:rec[aá]maras?|cuartos?|habitaciones?)/)
  out.banos           = num(/(\d{1,2})\s*ba[nñ]os?/)
  out.antiguedad_anios= num(/(\d{1,2})\s*a[nñ]os?/)
  out.estacionamientos= num(/(\d{1,2})\s*(?:estacionamientos?|cajones?|cocheras?)/)

  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k])
  return out
}

// Resuelve la zona por coincidencia de nombre de colonia.
export function resolverZona (texto, zonas) {
  const t = (texto || '').toLowerCase()
  return zonas.find((z) => t.includes(z.colonia.toLowerCase())) || null
}
