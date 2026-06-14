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

  const cargar = (z) => {
    merS.comparables({ zona_id: z, limit: 60 }).then(setComps)
    if (z) merS.statsZona(z).then(setStats)
  }
  useEffect(() => { merS.zonas().then((zs) => { setZonas(zs); const z = zs[0]?.id || ''; setZona(z); cargar(z) }) }, [])
  const cambiarZona = (e) => { setZona(e.target.value); cargar(e.target.value) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mercado</h1>
        <select className="input w-56" value={zona} onChange={cambiarZona}>{zonas.map(z => <option key={z.id} value={z.id}>{z.colonia}</option>)}</select>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.tipo} className="card">
            <p className="text-sm text-slate-500 capitalize">{s.tipo}</p>
            <p className="text-2xl font-semibold mt-1">{fmtMXN(s.precio_m2_prom)}<span className="text-sm text-slate-400"> /m²</span></p>
            <p className="text-xs text-slate-400 mt-1">{s.n} comparables · mediana {fmtMXN(s.precio_m2_mediana)}</p>
          </div>
        ))}
      </div>

      {!comps ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <p className="text-sm font-medium mb-3">Comparables {gestiona && <span className="text-xs text-slate-400">(puedes administrarlos)</span>}</p>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-400"><th className="py-2">Tipo</th><th>Const.</th><th>Precio</th><th>Precio/m²</th><th>Fecha</th></tr></thead>
            <tbody>{comps.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="py-2 capitalize">{c.tipo}</td><td>{c.construccion_m2} m²</td>
                <td className="font-medium">{fmtMXN(c.precio)}</td><td>{fmtMXN(c.precio_m2)}</td>
                <td className="text-slate-500">{c.fecha_operacion}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
