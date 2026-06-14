// ── Servicio de dashboard (payload por rol) ─────────────────────
import { supabaseAdmin } from '../../config/supabase.js'

const count = async (tabla, filtro) => {
  let q = supabaseAdmin.from(tabla).select('*', { count: 'exact', head: true })
  if (filtro) q = filtro(q)
  const { count: c } = await q
  return c || 0
}

async function statsAdmin () {
  const [valuaciones, inmuebles, comparables, usuarios] = await Promise.all([
    count('valuaciones'), count('inmuebles'), count('comparables_mercado'), count('usuarios'),
  ])
  const { data: recientes } = await supabaseAdmin.from('valuaciones')
    .select('id, valor_estimado, confianza, estado, created_at, inmueble:inmuebles(tipo, zona:zonas(colonia))')
    .order('created_at', { ascending: false }).limit(8)
  const { data: mercado } = await supabaseAdmin.from('v_mercado_zona')
    .select('zona_id, tipo, precio_m2_prom, n')
  return { kpis: { valuaciones, inmuebles, comparables, usuarios }, recientes: recientes || [], mercado: mercado || [] }
}

async function statsValuador () {
  const porRevisar = await count('valuaciones', (q) => q.in('estado', ['calculada', 'revisada']))
  const firmadas = await count('valuaciones', (q) => q.eq('estado', 'firmada'))
  const { data: cola } = await supabaseAdmin.from('valuaciones')
    .select('id, valor_estimado, confianza, estado, created_at, inmueble:inmuebles(tipo, zona:zonas(colonia))')
    .in('estado', ['calculada', 'revisada']).order('created_at', { ascending: false }).limit(10)
  return { kpis: { porRevisar, firmadas }, cola: cola || [] }
}

async function statsAnalista () {
  const comparables = await count('comparables_mercado')
  const { data: zonas } = await supabaseAdmin.from('v_mercado_zona')
    .select('zona_id, tipo, n, precio_m2_prom')
  return { kpis: { comparables, zonas: (zonas || []).length }, mercado: zonas || [] }
}

async function statsCliente (userId) {
  const inmuebles = await count('inmuebles', (q) => q.eq('usuario_id', userId))
  const { data: misInmuebles } = await supabaseAdmin.from('inmuebles')
    .select('id').eq('usuario_id', userId)
  const ids = (misInmuebles || []).map((i) => i.id)
  let valuaciones = []
  if (ids.length) {
    const { data } = await supabaseAdmin.from('valuaciones')
      .select('id, valor_estimado, confianza, estado, created_at, inmueble:inmuebles(tipo, zona:zonas(colonia))')
      .in('inmueble_id', ids).order('created_at', { ascending: false }).limit(10)
    valuaciones = data || []
  }
  return { kpis: { inmuebles, valuaciones: valuaciones.length }, valuaciones }
}

export const stats = async (user) => {
  if (user.rol === 'cliente')          return { rol: user.rol, ...(await statsCliente(user.id)) }
  if (user.rol === 'valuador')         return { rol: user.rol, ...(await statsValuador()) }
  if (user.rol === 'analista_mercado') return { rol: user.rol, ...(await statsAnalista()) }
  return { rol: user.rol, ...(await statsAdmin()) }
}
