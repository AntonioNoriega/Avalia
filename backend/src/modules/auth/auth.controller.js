// ── Controlador de autenticación ────────────────────────────────
import { loginService, cambiarPasswordService } from './auth.service.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    res.json(await loginService(email, password))
  } catch (err) { next(err) }
}

export const me = (req, res) => res.json({ usuario: req.user })

export const cambiarPassword = async (req, res, next) => {
  try {
    const { actual, nueva } = req.body
    res.json(await cambiarPasswordService(req.user.id, actual, nueva))
  } catch (err) { next(err) }
}
