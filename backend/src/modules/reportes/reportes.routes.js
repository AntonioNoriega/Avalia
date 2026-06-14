import { Router } from 'express'
import { valuacionPdf } from './reportes.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
const router = Router()
router.get('/valuacion/:id/pdf', authMiddleware, valuacionPdf)
export default router
