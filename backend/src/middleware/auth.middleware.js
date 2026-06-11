// ── Middleware de autenticación (JWT) ───────────────────────
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No autenticado' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido' })
  }
}
