import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listar } from '../../services/valuacion.service.js'
import { fmtMXN } from '../../lib/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Badge from '../../components/ui/Badge.jsx'

const FLUJO = [
  { estado: 'calculada',  label: '1. Calculada',  desc: 'El sistema estimó el valor', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { estado: 'revisada',   label: '2. En revisión', desc: 'Un valuador la está revisando', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { estado: 'firmada',    label: '3. Firmada ✓',   desc: 'Valuación aprobada y oficial', color: 'bg-green-50 border-green-200 text-green-700' },
]

export default function Valuaciones () {
  const { usuario } = useAuth()
  const [rows, setRows] = useState(null)
  useEffect(() => { listar().then(setRows).catch(() => setRows([])) }, [])
  if (!rows) return <Spinner />

  const esCliente = usuario?.rol === 'cliente'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Valuaciones</h1>

      {esCliente && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">¿Cómo funciona el proceso?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {FLUJO.map((f, i) => (
              <div key={f.estado} className={`flex-1 rounded-lg border px-4 py-3 ${f.color}`}>
                <p className="text-xs font-bold">{f.label}</p>
                <p className="text-xs mt-0.5 opacity-80">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            💡 Tus valuaciones en estado <strong>Calculada</strong> están esperando ser revisadas por un valuador de Avalia.
          </p>
        </div>
      )}

      {!rows.length ? <p className="text-sm text-slate-400">No hay valuaciones todavía.</p> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-400"><th className="py-2">Inmueble</th><th>Valor</th><th>Rango</th><th>Confianza</th><th>Estado</th><th></th></tr></thead>
            <tbody>{rows.map((v) => (
              <tr key={v.id} className="border-t border-slate-100">
                <td className="py-2">{v.inmueble?.tipo} · {v.inmueble?.zona?.colonia || '-'}</td>
                <td className="font-medium">{fmtMXN(v.valor_estimado)}</td>
                <td className="text-slate-500">{fmtMXN(v.valor_min)}–{fmtMXN(v.valor_max)}</td>
                <td><Badge value={v.confianza} /></td>
                <td><Badge value={v.estado} /></td>
                <td><Link to={`/valuaciones/${v.id}`} className="text-brand text-xs">Ver</Link></td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
