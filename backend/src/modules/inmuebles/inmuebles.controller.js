// ── Controlador de inmuebles ────────────────────────────────
import { listarInmuebles, crearInmueble } from './inmuebles.service.js'

export const listar = async (req, res, next) => {
  try { res.json(await listarInmuebles(req.user.id)) } catch (e) { next(e) }
}
export const crear = async (req, res, next) => {
  try { res.status(201).json(await crearInmueble(req.user.id, req.body)) } catch (e) { next(e) }
}
