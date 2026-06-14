// ── Avalia API · punto de entrada ───────────────────────────────
import express from 'express'
import cors from 'cors'

import authRoutes      from './modules/auth/auth.routes.js'
import inmueblesRoutes from './modules/inmuebles/inmuebles.routes.js'
import mercadoRoutes   from './modules/mercado/mercado.routes.js'
import valuacionRoutes from './modules/valuacion/valuacion.routes.js'
import chatbotRoutes   from './modules/chatbot/chatbot.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import reportesRoutes  from './modules/reportes/reportes.routes.js'
import { errorHandler, notFound } from './middleware/error.middleware.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'avalia-api' }))

app.use('/api/auth', authRoutes)
app.use('/api/inmuebles', inmueblesRoutes)
app.use('/api/mercado', mercadoRoutes)
app.use('/api/valuacion', valuacionRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reportes', reportesRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`✓ Avalia API escuchando en http://localhost:${PORT}`))
