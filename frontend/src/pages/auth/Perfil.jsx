import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES } from '../../lib/format.js'
import { cambiarPassword } from '../../services/auth.service.js'

export default function Perfil () {
  const { usuario } = useAuth()
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault(); setMsg(null)
    try { await cambiarPassword(actual, nueva); setMsg({ ok: true, t: 'Contraseña actualizada' }); setActual(''); setNueva('') }
    catch (err) { setMsg({ ok: false, t: err.response?.data?.message || 'Error' }) }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Mi perfil</h1>
      <div className="card mb-6">
        <p className="text-sm text-slate-500">Nombre</p>
        <p className="font-medium">{usuario?.nombre}</p>
        <p className="text-sm text-slate-500 mt-3">Correo</p>
        <p className="font-medium">{usuario?.email}</p>
        <p className="text-sm text-slate-500 mt-3">Rol</p>
        <p className="font-medium">{ROLES[usuario?.rol]}</p>
      </div>
      <form onSubmit={submit} className="card">
        <h2 className="font-medium mb-4">Cambiar contraseña</h2>
        {msg && <div className={`mb-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{msg.t}</div>}
        <label className="label">Contraseña actual</label>
        <input className="input mb-3" type="password" value={actual} onChange={e => setActual(e.target.value)} />
        <label className="label">Nueva contraseña (mín. 8)</label>
        <input className="input mb-4" type="password" value={nueva} onChange={e => setNueva(e.target.value)} />
        <button className="btn-primary">Actualizar</button>
      </form>
    </div>
  )
}
