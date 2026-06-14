// ── Servicio de chatbot ─────────────────────────────────────────
import { supabaseAdmin } from '../../config/supabase.js'
import { calcularValuacion } from '../valuacion/valuacion.engine.js'
import { parseInmueble, resolverZona } from './chatbot.parser.js'

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-MX')

async function asegurarSesion (userId, sesionId) {
  if (sesionId) return sesionId
  const { data } = await supabaseAdmin.from('chat_sesiones').insert({ usuario_id: userId }).select('id').single()
  return data.id
}

async function guardarMensaje (sesionId, rol, texto, valuacionId = null) {
  await supabaseAdmin.from('chat_mensajes').insert({ sesion_id: sesionId, rol, texto, valuacion_id: valuacionId })
}

export const procesarMensaje = async (user, sesionId, texto) => {
  sesionId = await asegurarSesion(user.id, sesionId)
  await guardarMensaje(sesionId, 'user', texto)

  const datos = parseInmueble(texto)
  const { data: zonas } = await supabaseAdmin.from('zonas').select('*')
  const zona = resolverZona(texto, zonas || [])

  const faltan = []
  if (!datos.tipo) faltan.push('el tipo (casa, departamento, terreno…)')
  if (!datos.construccion_m2) faltan.push('los metros de construcción (ej. 80 m²)')
  if (!zona) faltan.push('la zona/colonia')

  let respuesta, resultado = null
  if (faltan.length) {
    respuesta = `Para estimar el valor necesito ${faltan.join(', ')}. ` +
      `Por ejemplo: "departamento de 80 m² en ${(zonas?.[0]?.colonia) || 'la colonia X'}, 2 recámaras".`
  } else {
    const inmueble = {
      tipo: datos.tipo, zona_id: zona.id, construccion_m2: datos.construccion_m2,
      superficie_m2: datos.construccion_m2, recamaras: datos.recamaras || 2,
      banos: datos.banos || 1, estacionamientos: datos.estacionamientos || 1,
      antiguedad_anios: datos.antiguedad_anios || 0, estado_conserva: datos.estado_conserva || 'bueno',
    }
    let { data: comps } = await supabaseAdmin.from('comparables_mercado')
      .select('*').eq('tipo', inmueble.tipo).eq('zona_id', zona.id).limit(40)
    if (!comps || comps.length < 3) {
      const r = await supabaseAdmin.from('comparables_mercado').select('*').eq('tipo', inmueble.tipo).limit(40)
      comps = r.data || []
    }
    const calc = calcularValuacion(inmueble, comps)
    if (!calc) {
      respuesta = 'Aún no tengo comparables de mercado para ese tipo de inmueble en esa zona.'
    } else {
      resultado = calc
      respuesta = `Estimo un valor de ${fmt(calc.valor_estimado)} ` +
        `(rango ${fmt(calc.valor_min)} – ${fmt(calc.valor_max)}), confianza ${calc.confianza}, ` +
        `con base en ${calc.num_comparables} comparables de ${zona.colonia}. ` +
        `¿Quieres registrar el inmueble para guardar esta valuación o ajustar algún dato?`
    }
  }

  await guardarMensaje(sesionId, 'bot', respuesta)
  return { sesion_id: sesionId, respuesta, datos_detectados: { ...datos, zona: zona?.colonia }, resultado }
}

export const historial = async (user) => {
  const { data } = await supabaseAdmin.from('chat_sesiones')
    .select('id, created_at, mensajes:chat_mensajes(rol, texto, created_at)')
    .eq('usuario_id', user.id).order('created_at', { ascending: false }).limit(20)
  return data || []
}
