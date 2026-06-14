// ── Rutas de autenticación ──────────────────────────────────────
import { Router } from 'express'
import { login, me, cambiarPassword } from './auth.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { validate } from '../../middleware/validate.middleware.js'

const router = Router()
router.post('/login', validate({ email: { required: true }, password: { required: true } }), login)
router.get('/me', authMiddleware, me)
router.patch('/me/password', authMiddleware,
  validate({ actual: { required: true }, nueva: { required: true } }), cambiarPassword)
export default router
