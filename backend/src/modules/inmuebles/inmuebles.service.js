// ── Servicio de inmuebles ───────────────────────────────────────
import { supabaseAdmin } from '../../config/supabase.js'

const SEL = '*, zona:zonas(*)'

// admin/valuador ven todos; cliente solo los suyos
export const listarInmuebles = async (user) => {
  let q = supabaseAdmin.from('inmuebles').select(SEL).order('created_at', { ascending: false })
  if (user.rol === 'cliente') q = q.eq('usuario_id', user.id)
  const { data, error } = await q
  if (error) throw { status: 500, message: error.message }
  return data
}

export const obtenerInmueble = async (user, id) => {
  const { data, error } = await supabaseAdmin.from('inmuebles').select(SEL).eq('id', id).single()
  if (error || !data) throw { status: 404, message: 'Inmueble no encontrado' }
  if (user.rol === 'cliente' && data.usuario_id !== user.id)
    throw { status: 403, message: 'No autorizado' }
  return data
}

export const crearInmueble = async (user, body) => {
  const payload = { ...body, usuario_id: body.usuario_id || user.id }
  const { data, error } = await supabaseAdmin.from('inmuebles').insert(payload).select(SEL).single()
  if (error) throw { status: 400, message: error.message }
  return data
}

export const actualizarInmueble = async (user, id, body) => {
  await obtenerInmueble(user, id) // valida existencia y permiso
  const { data, error } = await supabaseAdmin.from('inmuebles').update(body).eq('id', id).select(SEL).single()
  if (error) throw { status: 400, message: error.message }
  return data
}

export const eliminarInmueble = async (user, id) => {
  await obtenerInmueble(user, id)
  const { error } = await supabaseAdmin.from('inmuebles').delete().eq('id', id)
  if (error) throw { status: 400, message: error.message }
  return { message: 'Inmueble eliminado' }
}
