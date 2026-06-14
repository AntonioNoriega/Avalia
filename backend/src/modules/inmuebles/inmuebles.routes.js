// ── Rutas de inmuebles ──────────────────────────────────────────
import { Router } from 'express'
import * as ctrl from './inmuebles.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { creaValuacion } from '../../middleware/rbac.middleware.js'
import { validate } from '../../middleware/validate.middleware.js'

const TIPOS = ['casa','departamento','terreno','local','oficina']
const nuevoInmueble = {
  tipo: { required: true, enum: TIPOS },
  zona_id: { required: true },
  superficie_m2: { required: true, type: 'number', min: 1 },
  construccion_m2: { required: true, type: 'number', min: 0 },
}

const router = Router()
router.use(authMiddleware)
router.get('/', ctrl.listar)
router.get('/:id', ctrl.obtener)
router.post('/', creaValuacion, validate(nuevoInmueble), ctrl.crear)
router.put('/:id', creaValuacion, ctrl.actualizar)
router.delete('/:id', creaValuacion, ctrl.eliminar)
export default router
