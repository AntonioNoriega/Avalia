// ── Servicio de mercado (comparables) ───────────────────────────
import { supabaseAdmin } from '../../config/supabase.js'

export const listarComparables = async ({ tipo, zona_id, limit = 100 }) => {
  let q = supabaseAdmin.from('comparables_mercado')
    .select('*, zona:zonas(*)').order('fecha_operacion', { ascending: false }).limit(Number(limit))
  if (tipo) q = q.eq('tipo', tipo)
  if (zona_id) q = q.eq('zona_id', zona_id)
  const { data, error } = await q
  if (error) throw { status: 500, message: error.message }
  return data
}

export const crearComparable = async (body) => {
  const { data, error } = await supabaseAdmin.from('comparables_mercado')
    .insert({ ...body, origen: body.origen || 'manual' }).select().single()
  if (error) throw { status: 400, message: error.message }
  return data
}

export const listarZonas = async () => {
  const { data, error } = await supabaseAdmin.from('zonas').select('*').order('colonia')
  if (error) throw { status: 500, message: error.message }
  return data
}

// Estadísticas de mercado por zona (usa la vista v_mercado_zona)
export const statsZona = async (zonaId, tipo) => {
  let q = supabaseAdmin.from('v_mercado_zona').select('*').eq('zona_id', zonaId)
  if (tipo) q = q.eq('tipo', tipo)
  const { data, error } = await q
  if (error) throw { status: 500, message: error.message }
  return data
}
