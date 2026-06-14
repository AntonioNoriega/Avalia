// ── Validación simple de body por esquema ───────────────────────
// schema: { campo: { required, type, min, max, enum } }
export const validate = (schema) => (req, res, next) => {
  const errores = []
  for (const [campo, regla] of Object.entries(schema)) {
    const v = req.body[campo]
    if (regla.required && (v === undefined || v === null || v === ''))
      { errores.push(`${campo} es obligatorio`); continue }
    if (v === undefined || v === null || v === '') continue
    if (regla.type === 'number' && isNaN(Number(v))) errores.push(`${campo} debe ser numérico`)
    if (regla.type === 'string' && typeof v !== 'string') errores.push(`${campo} debe ser texto`)
    if (regla.min !== undefined && Number(v) < regla.min) errores.push(`${campo} debe ser ≥ ${regla.min}`)
    if (regla.max !== undefined && Number(v) > regla.max) errores.push(`${campo} debe ser ≤ ${regla.max}`)
    if (regla.enum && !regla.enum.includes(v)) errores.push(`${campo} inválido (${regla.enum.join(', ')})`)
  }
  if (errores.length) return res.status(400).json({ message: 'Validación fallida', errores })
  next()
}
