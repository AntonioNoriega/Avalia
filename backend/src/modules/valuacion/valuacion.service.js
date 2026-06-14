// ── Servicio de valuación (orquesta el motor + persistencia) ────
import { supabaseAdmin } from '../../config/supabase.js'
import { calcularValuacion } from './valuacion.engine.js'

const MIN_COMPARABLES = 3

async function cargarInmueble (id) {
  const { data, error } = await supabaseAdmin
    .from('inmuebles').select('*, zona:zonas(*)').eq('id', id).single()
  if (error || !data) throw { status: 404, message: 'Inmueble no encontrado' }
  return data
}

async function buscarComparables (inmueble) {
  // 1) mismo tipo + misma zona
  let { data } = await supabaseAdmin.from('comparables_mercado')
    .select('*').eq('tipo', inmueble.tipo).eq('zona_id', inmueble.zona_id).limit(40)
  // 2) fallback: mismo tipo (cualquier zona) si hay pocos
  if (!data || data.length < MIN_COMPARABLES) {
    const r = await supabaseAdmin.from('comparables_mercado')
      .select('*').eq('tipo', inmueble.tipo).limit(40)
    data = r.data || []
  }
  return data
}

export const crearValuacion = async (user, inmuebleId) => {
  const inmueble = await cargarInmueble(inmuebleId)
  if (user.rol === 'cliente' && inmueble.usuario_id !== user.id)
    throw { status: 403, message: 'No autorizado sobre este inmueble' }

  const comparables = await buscarComparables(inmueble)
  const calc = calcularValuacion(inmueble, comparables)
  if (!calc) throw { status: 422, message: 'No hay comparables de mercado para este inmueble' }

  const { data: val, error } = await supabaseAdmin.from('valuaciones').insert({
    inmueble_id: inmueble.id,
    valuador_id: user.rol === 'cliente' ? null : user.id,
    estado: 'calculada',
    valor_estimado: calc.valor_estimado,
    valor_min: calc.valor_min,
    valor_max: calc.valor_max,
    confianza: calc.confianza,
    num_comparables: calc.num_comparables,
    metodo: 'comparativo_mercado',
  }).select().single()
  if (error) throw { status: 400, message: error.message }

  const detalle = calc.detalle.map((d) => ({ ...d, valuacion_id: val.id }))
  await supabaseAdmin.from('valuacion_comparables').insert(detalle)

  return { ...val, precio_m2_ponderado: calc.precio_m2_ponderado }
}

export const obtenerValuacion = async (user, id) => {
  const { data: val, error } = await supabaseAdmin.from('valuaciones')
    .select('*, inmueble:inmuebles(*, zona:zonas(*))').eq('id', id).single()
  if (error || !val) throw { status: 404, message: 'Valuación no encontrada' }
  if (user.rol === 'cliente' && val.inmueble.usuario_id !== user.id)
    throw { status: 403, message: 'No autorizado' }

  const { data: comps } = await supabaseAdmin.from('valuacion_comparables')
    .select('*, comparable:comparables_mercado(*)').eq('valuacion_id', id)
  return { ...val, comparables: comps || [] }
}

export const listarValuaciones = async (user) => {
  let q = supabaseAdmin.from('valuaciones')
    .select('*, inmueble:inmuebles(id, tipo, usuario_id, zona:zonas(colonia))')
    .order('created_at', { ascending: false }).limit(100)
  const { data, error } = await q
  if (error) throw { status: 500, message: error.message }
  if (user.rol === 'cliente')
    return (data || []).filter((v) => v.inmueble?.usuario_id === user.id)
  return data
}

const TRANSICIONES = {
  borrador: ['calculada', 'descartada'],
  calculada: ['revisada', 'descartada'],
  revisada: ['firmada', 'descartada'],
  firmada: [],
  descartada: [],
}

export const cambiarEstado = async (user, id, nuevoEstado) => {
  const { data: val } = await supabaseAdmin.from('valuaciones').select('estado').eq('id', id).single()
  if (!val) throw { status: 404, message: 'Valuación no encontrada' }
  if (!TRANSICIONES[val.estado]?.includes(nuevoEstado))
    throw { status: 400, message: `Transición inválida: ${val.estado} → ${nuevoEstado}` }
  const { data, error } = await supabaseAdmin.from('valuaciones')
    .update({ estado: nuevoEstado, valuador_id: user.id }).eq('id', id).select().single()
  if (error) throw { status: 400, message: error.message }
  return data
}
