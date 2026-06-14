import { Router } from 'express'
import * as ctrl from './chatbot.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { validate } from '../../middleware/validate.middleware.js'
const router = Router()
router.use(authMiddleware)
router.post('/mensaje', validate({ texto: { required: true } }), ctrl.mensaje)
router.get('/sesiones', ctrl.historial)
export default router
