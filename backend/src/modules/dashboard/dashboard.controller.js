import { stats } from './dashboard.service.js'
export const getStats = async (req, res, next) => { try { res.json(await stats(req.user)) } catch (e) { next(e) } }
