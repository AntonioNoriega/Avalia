import { useEffect, useState } from 'react'
import * as merS from '../../services/mercado.service.js'
import { fmtMXN } from '../../lib/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

export default function Mercado () {
  const { usuario } = useAuth()
  const gestiona = ['admin','analista_mercado'].includes(usuario?.rol)
  const [zonas, setZonas] = useState([])
  const [zona, setZona] = useState('')
  const [comps, setComps] = useState(null)
  const [stats, setStats] = useState([])
  const [vista, setVista] = useState('mosaico') // 'mosaico' o 'tabla'

  const cargar = (z) => {
    merS.comparables({ zona_id: z, limit: 60 }).then(setComps)
    if (z) merS.statsZona(z).then(setStats)
  }
  useEffect(() => { merS.zonas().then((zs) => { setZonas(zs); const z = zs[0]?.id || ''; setZona(z); cargar(z) }) }, [])
  const cambiarZona = (e) => { setZona(e.target.value); cargar(e.target.value) }

  const zonaSel = zonas.find(z => z.id === zona)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Mercado Inmobiliario</h1>
          <p className="text-sm text-slate-500 mt-1">Explora propiedades en venta y estadísticas de la zona</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setVista('mosaico')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${vista === 'mosaico' ? 'bg-white shadow text-brand' : 'text-slate-600 hover:text-ink'}`}
            >
              Mosaico
            </button>
            <button 
              onClick={() => setVista('tabla')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${vista === 'tabla' ? 'bg-white shadow text-brand' : 'text-slate-600 hover:text-ink'}`}
            >
              Tabla
            </button>
          </div>
          <select className="input w-56 bg-white shadow-sm" value={zona} onChange={cambiarZona}>
            {zonas.map(z => <option key={z.id} value={z.id}>{z.colonia} ({z.municipio})</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.tipo} className="card relative overflow-hidden group hover:shadow-md transition duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.tipo}</p>
            <p className="text-2xl font-bold text-brand mt-1">{fmtMXN(s.precio_m2_prom)}<span className="text-xs text-slate-400 font-normal"> / m² prom</span></p>
            <p className="text-xs text-slate-500 mt-1.5">
              <span className="font-semibold text-slate-700">{s.n}</span> comparables registrados
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Mediana: {fmtMXN(s.precio_m2_mediana)} / m²</p>
          </div>
        ))}
      </div>

      {!comps ? <Spinner /> : (
        vista === 'mosaico' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Propiedades en el mercado ({comps.length})</p>
              {gestiona && <span className="text-xs text-slate-400 font-normal bg-slate-100 border px-2 py-0.5 rounded-full">Modo de edición activo</span>}
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comps.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img 
                      src={c.imagen_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'} 
                      alt={c.tipo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-brand/90 text-white backdrop-blur-sm shadow-sm">
                        {c.tipo}
                      </span>
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded text-white backdrop-blur-sm shadow-sm ${
                        c.estado_conserva === 'nuevo' ? 'bg-emerald-600/90' :
                        c.estado_conserva === 'bueno' ? 'bg-blue-600/90' :
                        c.estado_conserva === 'regular' ? 'bg-amber-600/90' : 'bg-red-600/90'
                      }`}>
                        {c.estado_conserva}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900/60 text-white backdrop-blur-sm shadow-sm">
                      {c.fecha_operacion}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-xl font-bold text-ink">{fmtMXN(c.precio)}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 capitalize font-medium">Col. {zonaSel?.colonia || 'Costa Azul'}</p>
                      
                      <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 my-3 text-center">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Construcción</p>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5">{c.construccion_m2} m²</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Distribución</p>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5">{c.recamaras} rec · {c.banos} bañ</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Antigüedad</p>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5">{c.antiguedad_anios === 0 ? 'Nva.' : `${c.antiguedad_anios}a`}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Precio / m²</span>
                      <span className="font-semibold text-slate-600">{fmtMXN(c.precio_m2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">Comparables registrados ({comps.length})</p>
              {gestiona && <span className="text-xs text-slate-400 font-normal">Modo de edición activo</span>}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-200">
                  <th className="py-2.5 font-semibold">Propiedad</th>
                  <th className="py-2.5 font-semibold">Const. / Terreno</th>
                  <th className="py-2.5 font-semibold">Distribución</th>
                  <th className="py-2.5 font-semibold">Conservación</th>
                  <th className="py-2.5 font-semibold">Precio</th>
                  <th className="py-2.5 font-semibold">Precio/m²</th>
                  <th className="py-2.5 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {comps.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 capitalize font-medium flex items-center gap-2">
                      <img 
                        src={c.imagen_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=80&q=80'} 
                        alt="" 
                        className="w-10 h-10 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=80&q=80';
                        }}
                      />
                      {c.tipo}
                    </td>
                    <td className="py-3 text-slate-600">{c.construccion_m2} m² / {c.superficie_m2} m²</td>
                    <td className="py-3 text-slate-600">{c.recamaras} rec · {c.banos} bañ · {c.estacionamientos} est</td>
                    <td className="py-3 text-slate-600 capitalize">{c.estado_conserva}</td>
                    <td className="py-3 font-semibold text-brand">{fmtMXN(c.precio)}</td>
                    <td className="py-3 text-slate-500">{fmtMXN(c.precio_m2)}</td>
                    <td className="py-3 text-slate-500">{c.fecha_operacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
