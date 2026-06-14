import * as svc from './chatbot.service.js'
export const mensaje   = async (req, res, next) => { try { res.json(await svc.procesarMensaje(req.user, req.body.sesion_id, req.body.texto)) } catch (e) { next(e) } }
export const historial = async (req, res, next) => { try { res.json(await svc.historial(req.user)) } catch (e) { next(e) } }
