import { generarReporteValuacion } from './reportes.service.js'
export const valuacionPdf = async (req, res, next) => {
  try {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="valuacion-${req.params.id}.pdf"`)
    await generarReporteValuacion(req.user, req.params.id, res)
  } catch (e) { next(e) }
}
