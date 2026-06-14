// ── Rutas de valuación ──────────────────────────────────────────
import { Router } from 'express'
import * as ctrl from './valuacion.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { creaValuacion, operaValuacion } from '../../middleware/rbac.middleware.js'
import { validate } from '../../middleware/validate.middleware.js'

const router = Router()
router.use(authMiddleware)
router.get('/', ctrl.listar)
router.get('/:id', ctrl.obtener)
router.post('/', creaValuacion, validate({ inmueble_id: { required: true } }), ctrl.crear)
router.patch('/:id/estado', operaValuacion,
  validate({ estado: { required: true, enum: ['revisada','firmada','descartada','calculada'] } }), ctrl.cambiarEst)
export default router
