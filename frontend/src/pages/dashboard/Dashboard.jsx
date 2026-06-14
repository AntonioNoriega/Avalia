import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { stats } from '../../services/dashboard.service.js'
import { fmtMXN } from '../../lib/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Badge from '../../components/ui/Badge.jsx'

function Kpi ({ label, value }) {
  return <div className="card"><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-semibold mt-1">{value}</p></div>
}
function TablaValuaciones ({ rows }) {
  if (!rows?.length) return <p className="text-sm text-slate-400">Sin valuaciones aún.</p>
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-slate-400">
          <th className="py-2">Inmueble</th><th>Valor</th><th>Confianza</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {rows.map((v) => (
            <tr key={v.id} className="border-t border-slate-100">
              <td className="py-2">{v.inmueble?.tipo} · {v.inmueble?.zona?.colonia || '-'}</td>
              <td className="font-medium">{fmtMXN(v.valor_estimado)}</td>
              <td><Badge value={v.confianza} /></td>
              <td><Badge value={v.estado} /></td>
              <td><Link to={`/valuaciones/${v.id}`} className="text-brand text-xs">Ver</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Dashboard () {
  const { usuario } = useAuth()
  const [data, setData] = useState(null)
  useEffect(() => { stats().then(setData).catch(() => setData({})) }, [])
  if (!data) return <Spinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Hola, {usuario?.nombre.split(' ')[0]} 👋</h1>

      {data.rol === 'admin' && (<>
        <div className="grid sm:grid-cols-4 gap-4">
          <Kpi label="Valuaciones" value={data.kpis.valuaciones} />
          <Kpi label="Inmuebles" value={data.kpis.inmuebles} />
          <Kpi label="Comparables" value={data.kpis.comparables} />
          <Kpi label="Usuarios" value={data.kpis.usuarios} />
        </div>
        <h2 className="font-medium">Valuaciones recientes</h2>
        <TablaValuaciones rows={data.recientes} />
      </>)}

      {data.rol === 'valuador' && (<>
        <div className="grid sm:grid-cols-2 gap-4">
          <Kpi label="Por revisar / firmar" value={data.kpis.porRevisar} />
          <Kpi label="Firmadas" value={data.kpis.firmadas} />
        </div>
        <h2 className="font-medium">Cola de revisión</h2>
        <TablaValuaciones rows={data.cola} />
      </>)}

      {data.rol === 'analista_mercado' && (<>
        <div className="grid sm:grid-cols-2 gap-4">
          <Kpi label="Comparables" value={data.kpis.comparables} />
          <Kpi label="Zonas con datos" value={data.kpis.zonas} />
        </div>
        <Link to="/mercado" className="btn-primary w-fit">Gestionar mercado</Link>
      </>)}

      {data.rol === 'cliente' && (<>
        <div className="grid sm:grid-cols-2 gap-4">
          <Kpi label="Mis inmuebles" value={data.kpis.inmuebles} />
          <Kpi label="Mis valuaciones" value={data.kpis.valuaciones} />
        </div>
        <div className="flex gap-3">
          <Link to="/inmuebles" className="btn-primary">Registrar inmueble</Link>
          <Link to="/chatbot" className="btn-ghost">Preguntar al asistente</Link>
        </div>
        <h2 className="font-medium">Mis valuaciones</h2>
        <TablaValuaciones rows={data.valuaciones} />
      </>)}
    </div>
  )
}
