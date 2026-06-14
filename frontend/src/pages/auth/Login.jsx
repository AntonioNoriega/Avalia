import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Logo from '../../components/ui/Logo.jsx'

export default function Login () {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@avalia.mx')
  const [password, setPassword] = useState('Avalia2026')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true)
    try { await login(email, password); navigate('/') }
    catch (err) { setError(err.response?.data?.message || 'No se pudo iniciar sesión') }
    finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-brand text-white p-12">
        <Logo size={48} light />
        <h1 className="font-display text-4xl font-semibold mt-8">Conoce el valor de tu propiedad en segundos.</h1>
        <p className="mt-4 text-blue-100">Valuación automatizada con datos de mercado y un asistente que te explica el resultado.</p>
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="lg:hidden mb-6"><Logo size={36} /></div>
          <h2 className="text-2xl font-semibold text-ink">Iniciar sesión</h2>
          <p className="text-sm text-slate-500 mb-6">Accede a tu panel de Avalia.</p>
          {error && <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
          <label className="label">Correo</label>
          <input className="input mb-4" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          <label className="label">Contraseña</label>
          <input className="input mb-6" value={password} onChange={e => setPassword(e.target.value)} type="password" />
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
          <p className="text-xs text-slate-400 mt-4">Demo: admin@avalia.mx · Avalia2026</p>
        </form>
      </div>
    </div>
  )
}
