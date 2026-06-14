// ── Controlador de inmuebles ────────────────────────────────────
import * as svc from './inmuebles.service.js'

export const listar     = async (req, res, next) => { try { res.json(await svc.listarInmuebles(req.user)) } catch (e) { next(e) } }
export const obtener    = async (req, res, next) => { try { res.json(await svc.obtenerInmueble(req.user, req.params.id)) } catch (e) { next(e) } }
export const crear      = async (req, res, next) => { try { res.status(201).json(await svc.crearInmueble(req.user, req.body)) } catch (e) { next(e) } }
export const actualizar = async (req, res, next) => { try { res.json(await svc.actualizarInmueble(req.user, req.params.id, req.body)) } catch (e) { next(e) } }
export const eliminar   = async (req, res, next) => { try { res.json(await svc.eliminarInmueble(req.user, req.params.id)) } catch (e) { next(e) } }
