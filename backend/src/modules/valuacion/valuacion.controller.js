// ── Controlador de valuación ────────────────────────────────────
import * as svc from './valuacion.service.js'

export const crear       = async (req, res, next) => { try { res.status(201).json(await svc.crearValuacion(req.user, req.body.inmueble_id)) } catch (e) { next(e) } }
export const obtener     = async (req, res, next) => { try { res.json(await svc.obtenerValuacion(req.user, req.params.id)) } catch (e) { next(e) } }
export const listar      = async (req, res, next) => { try { res.json(await svc.listarValuaciones(req.user)) } catch (e) { next(e) } }
export const cambiarEst  = async (req, res, next) => { try { res.json(await svc.cambiarEstado(req.user, req.params.id, req.body.estado)) } catch (e) { next(e) } }
