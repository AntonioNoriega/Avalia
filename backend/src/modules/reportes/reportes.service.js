// ── Servicio de reportes PDF (pdfkit) ───────────────────────────
import PDFDocument from 'pdfkit'
import { obtenerValuacion } from '../valuacion/valuacion.service.js'

const BLUE = '#1E4D8C', INK = '#0F172A', GRAY = '#64748B'
const COLOR_CONF = { alta: '#2E9E6B', media: '#F2A93B', baja: '#E2574C' }
const fmt = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-MX')

// Genera el PDF de una valuación y lo escribe en el stream (res).
export const generarReporteValuacion = async (user, id, stream) => {
  const val = await obtenerValuacion(user, id)
  const inm = val.inmueble || {}
  const zona = inm.zona || {}
  const doc = new PDFDocument({ size: 'LETTER', margin: 50 })
  doc.pipe(stream)

  // Header de marca
  doc.rect(0, 0, doc.page.width, 70).fill(BLUE)
  doc.fillColor('#FFFFFF').fontSize(22).text('Avalia', 50, 24)
  doc.fontSize(10).fillColor('#DCE6F4').text('Reporte de valuación', 50, 50)
  doc.moveDown(3)

  // Datos del inmueble
  doc.fillColor(INK).fontSize(14).text('Inmueble', 50, 100)
  doc.fontSize(10).fillColor(GRAY)
  doc.text(`Tipo: ${inm.tipo || '-'}    Zona: ${zona.colonia || '-'}, ${zona.municipio || ''}`)
  doc.text(`Construcción: ${inm.construccion_m2 || '-'} m²    Terreno: ${inm.superficie_m2 || '-'} m²`)
  doc.text(`Recámaras: ${inm.recamaras ?? '-'}    Baños: ${inm.banos ?? '-'}    Antigüedad: ${inm.antiguedad_anios ?? '-'} años`)

  // Resultado
  doc.moveDown(1.2)
  doc.fillColor(INK).fontSize(14).text('Valor estimado')
  doc.fillColor(BLUE).fontSize(30).text(fmt(val.valor_estimado))
  doc.fillColor(GRAY).fontSize(11).text(`Rango: ${fmt(val.valor_min)} — ${fmt(val.valor_max)}`)

  const cConf = COLOR_CONF[val.confianza] || GRAY
  const y = doc.y + 8
  doc.roundedRect(50, y, 160, 24, 12).fill(cConf)
  doc.fillColor('#FFFFFF').fontSize(11).text(`Confianza ${val.confianza || '-'}`, 62, y + 7)
  doc.fillColor(GRAY).fontSize(10).text(`${val.num_comparables} comparables · método ${val.metodo}`, 230, y + 7)

  // Tabla de comparables
  doc.moveDown(3)
  doc.fillColor(INK).fontSize(13).text('Comparables utilizados')
  doc.moveDown(0.5)
  const cols = [50, 230, 330, 430]
  doc.fontSize(9).fillColor('#FFFFFF')
  const hy = doc.y
  doc.rect(50, hy, 500, 18).fill(BLUE)
  doc.fillColor('#FFFFFF')
  doc.text('Comparable', cols[0] + 6, hy + 5)
  doc.text('Precio/m² aj.', cols[1] + 6, hy + 5)
  doc.text('Peso', cols[2] + 6, hy + 5)
  doc.text('Factor', cols[3] + 6, hy + 5)
  let ry = hy + 18
  ;(val.comparables || []).slice(0, 18).forEach((c, i) => {
    if (i % 2 === 0) { doc.rect(50, ry, 500, 16).fill('#F1F5F9') }
    doc.fillColor(INK).fontSize(9)
    doc.text((c.comparable_id || '').slice(0, 8), cols[0] + 6, ry + 4)
    doc.text(fmt(c.precio_m2_ajustado), cols[1] + 6, ry + 4)
    doc.text(String(c.peso), cols[2] + 6, ry + 4)
    doc.text(String(c.factor_ajuste), cols[3] + 6, ry + 4)
    ry += 16
  })

  // Footer
  doc.fontSize(8).fillColor(GRAY)
    .text('Avalia · Estimación automatizada. No constituye un avalúo pericial con validez oficial.',
      50, doc.page.height - 60, { width: 500, align: 'center' })

  doc.end()
}
