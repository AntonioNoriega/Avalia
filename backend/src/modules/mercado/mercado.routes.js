// ── Rutas de mercado ────────────────────────────────────────────
import { Router } from 'express'
import * as ctrl from './mercado.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { gestionMercado } from '../../middleware/rbac.middleware.js'
import { validate } from '../../middleware/validate.middleware.js'

const TIPOS = ['casa','departamento','terreno','local','oficina']
const nuevoComparable = {
  tipo: { required: true, enum: TIPOS },
  zona_id: { required: true },
  construccion_m2: { required: true, type: 'number', min: 1 },
  precio: { required: true, type: 'number', min: 1 },
}

const router = Router()
router.use(authMiddleware)
router.get('/comparables', ctrl.listar)
router.get('/zonas', ctrl.zonas)
router.get('/zonas/:id/stats', ctrl.statsZona)
router.post('/comparables', gestionMercado, validate(nuevoComparable), ctrl.crear)
export default router
