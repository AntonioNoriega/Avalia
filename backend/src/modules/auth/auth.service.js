// ── Servicio de autenticación ───────────────────────────────────
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../../config/supabase.js'

const TOKEN_TTL = '8h'

export const loginService = async (email, password) => {
  const { data: usuario } = await supabaseAdmin
    .from('usuarios').select('*').eq('email', email).eq('activo', true).single()

  if (!usuario || !(await bcrypt.compare(password, usuario.password_hash)))
    throw { status: 401, message: 'Credenciales inválidas' }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
    process.env.JWT_SECRET, { expiresIn: TOKEN_TTL }
  )
  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } }
}

export const cambiarPasswordService = async (userId, actual, nueva) => {
  if (!nueva || nueva.length < 8)
    throw { status: 400, message: 'La nueva contraseña debe tener al menos 8 caracteres' }

  const { data: usuario } = await supabaseAdmin
    .from('usuarios').select('password_hash').eq('id', userId).single()
  if (!usuario || !(await bcrypt.compare(actual, usuario.password_hash)))
    throw { status: 401, message: 'La contraseña actual no es correcta' }

  const password_hash = await bcrypt.hash(nueva, 12)
  await supabaseAdmin.from('usuarios').update({ password_hash }).eq('id', userId)
  return { message: 'Contraseña actualizada' }
}
