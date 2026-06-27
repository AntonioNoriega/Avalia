import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import * as valS from '../../services/valuacion.service.js'
import { fmtMXN } from '../../lib/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Badge from '../../components/ui/Badge.jsx'

const COL_CONF = { alta: '#2E9E6B', media: '#F2A93B', baja: '#E2574C' }

export default function ValuacionDetalle () {
  const { id } = useParams()
  const { usuario } = useAuth()
  const [v, setV] = useState(null)
  const [descargando, setDescargando] = useState(false)
  const cargar = () => valS.obtener(id).then(setV)
  useEffect(() => { cargar() }, [id])
  if (!v) return <Spinner />

  const data = (v.comparables || []).map((c, i) => ({ name: `#${i + 1}`, pm2: c.precio_m2_ajustado }))
  const opera = ['admin','valuador'].includes(usuario?.rol)

  const transicionar = async (estado) => { await valS.cambiarEstado(id, estado); cargar() }

  const descargarPdf = async () => {
    setDescargando(true)
    try {
      const token = localStorage.getItem('avalia_token')
      const url = valS.pdfUrl(id)
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Error al generar el PDF')
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `valuacion-avalia-${id.slice(0,8)}.pdf`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      alert('No se pudo descargar el PDF: ' + err.message)
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Valuación</h1>
        <button className="btn-ghost" onClick={descargarPdf} disabled={descargando}>
          {descargando ? 'Generando...' : '⬇ Exportar PDF'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <p className="text-sm text-slate-500">Valor estimado</p>
          <p className="text-4xl font-semibold text-brand mt-1">{fmtMXN(v.valor_estimado)}</p>
          <p className="text-sm text-slate-500 mt-1">Rango {fmtMXN(v.valor_min)} – {fmtMXN(v.valor_max)}</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge value={v.confianza} /> <Badge value={v.estado} />
          </div>
          <p className="text-xs text-slate-400 mt-3">{v.num_comparables} comparables · {v.metodo}</p>
          <div className="mt-4 text-sm text-slate-600 space-y-1">
            <p className="font-medium text-ink capitalize">{v.inmueble?.tipo}</p>
            <p>{v.inmueble?.zona?.colonia}, {v.inmueble?.zona?.municipio}</p>
            <p>{v.inmueble?.construccion_m2} m² · {v.inmueble?.recamaras} rec · {v.inmueble?.banos} baños</p>
          </div>
          {opera && v.estado !== 'firmada' && v.estado !== 'descartada' && (
            <div className="mt-4 flex flex-wrap gap-2">
              {v.estado === 'calculada' && <button className="btn-primary" onClick={() => transicionar('revisada')}>Marcar revisada</button>}
              {v.estado === 'revisada' && <button className="btn-valor" onClick={() => transicionar('firmada')}>Firmar</button>}
              <button className="btn-ghost" onClick={() => transicionar('descartada')}>Descartar</button>
            </div>
          )}
          {!opera && v.estado !== 'firmada' && v.estado !== 'descartada' && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700">
              <p className="font-semibold mb-0.5">⏳ En espera de revisión</p>
              <p>Un valuador de Avalia revisará y firmará tu valuación. Recibirás confirmación cuando esté aprobada.</p>
            </div>
          )}
          {v.estado === 'firmada' && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-xs text-green-700">
              <p className="font-semibold">✅ Valuación oficial firmada</p>
              <p className="mt-0.5">Esta valuación fue revisada y aprobada por un valuador certificado de Avalia.</p>
            </div>
          )}
        </div>

        <div className="card lg:col-span-2">
          <p className="text-sm font-medium mb-3">Precio/m² ajustado de los comparables</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(n) => `$${(n/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(n) => fmtMXN(n)} />
              <ReferenceLine y={data.length ? data.reduce((s,d)=>s+d.pm2,0)/data.length : 0} stroke={COL_CONF[v.confianza]} strokeDasharray="4 4" />
              <Bar dataKey="pm2" fill="#1E4D8C" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparables Utilizados */}
      <div className="card">
        <h2 className="text-lg font-semibold text-ink mb-1">Comparables de Mercado Utilizados</h2>
        <p className="text-xs text-slate-500 mb-4">Estas son las propiedades en venta tomadas como referencia y sus factores de ajuste aplicados.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(v.comparables || []).map((c, i) => {
            const comp = c.comparable || {}
            return (
              <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-slate-100 overflow-hidden">
                  <img 
                    src={comp.imagen_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'} 
                    alt={comp.tipo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand text-white shadow">
                      Referencia #{i + 1}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-900/60 text-white backdrop-blur-sm shadow">
                      {comp.tipo}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-lg font-bold text-ink">{fmtMXN(comp.precio)}</p>
                      <p className="text-[10px] text-slate-400">{comp.construccion_m2} m² · {comp.recamaras}rec · {comp.banos}ba</p>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 capitalize flex justify-between">
                      <span>Conservación: {comp.estado_conserva}</span>
                      <span>{comp.antiguedad_anios === 0 ? 'Nvo.' : `${comp.antiguedad_anios} años`}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precio / m² orig:</span>
                      <span className="font-medium text-slate-600">{fmtMXN(comp.precio_m2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Factor de ajuste:</span>
                      <span className="font-semibold text-amber-600">{c.factor_ajuste}x</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1 font-medium">
                      <span className="text-slate-500">Precio / m² ajustado:</span>
                      <span className="font-bold text-brand">{fmtMXN(c.precio_m2_ajustado)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Peso en valuación</span>
                    <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">{(c.peso * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
