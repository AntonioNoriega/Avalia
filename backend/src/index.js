// ── Avalia API · punto de entrada ───────────────────────────
import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'avalia-api' }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Avalia API escuchando en :${PORT}`))
