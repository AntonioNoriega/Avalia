// ── Controlador de autenticación ────────────────────────────
import { loginService } from './auth.service.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const data = await loginService(email, password)
    res.json(data)
  } catch (err) { next(err) }
}

export const me = (req, res) => res.json({ user: req.user })
