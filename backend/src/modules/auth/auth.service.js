// ── Servicio de autenticación ───────────────────────────────
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../../config/supabase.js'

export const loginService = async (email, password) => {
  const { data: usuario } = await supabaseAdmin
    .from('usuarios').select('*').eq('email', email).single()
  if (!usuario || !(await bcrypt.compare(password, usuario.password_hash)))
    throw { status: 401, message: 'Credenciales inválidas' }
  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h' })
  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } }
}
