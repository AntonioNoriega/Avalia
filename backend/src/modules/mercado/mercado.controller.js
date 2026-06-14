// ── Controlador de mercado ──────────────────────────────────────
import * as svc from './mercado.service.js'

export const listar    = async (req, res, next) => { try { res.json(await svc.listarComparables(req.query)) } catch (e) { next(e) } }
export const crear     = async (req, res, next) => { try { res.status(201).json(await svc.crearComparable(req.body)) } catch (e) { next(e) } }
export const zonas     = async (req, res, next) => { try { res.json(await svc.listarZonas()) } catch (e) { next(e) } }
export const statsZona = async (req, res, next) => { try { res.json(await svc.statsZona(req.params.id, req.query.tipo)) } catch (e) { next(e) } }
