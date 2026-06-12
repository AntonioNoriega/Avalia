// ── Rutas de inmuebles ──────────────────────────────────────
import { Router } from 'express'
import { listar, crear } from './inmuebles.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()
router.use(authMiddleware)
router.get('/', listar)
router.post('/', crear)
export default router
