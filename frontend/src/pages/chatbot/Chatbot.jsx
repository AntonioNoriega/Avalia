import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { enviar } from '../../services/chatbot.service.js'
import { fmtMXN } from '../../lib/format.js'

export default function Chatbot () {
  const [mensajes, setMensajes] = useState([
    { rol: 'bot', texto: 'Hola, soy el asistente de Avalia. Describe tu inmueble y te doy un estimado. Ej: "departamento de 80 m² en Costa Azul, 2 recámaras, 5 años".' },
  ])
  const [texto, setTexto] = useState('')
  const [sesion, setSesion] = useState(null)
  const [busy, setBusy] = useState(false)
  const fin = useRef(null)
  useEffect(() => { fin.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensajes])

  const mandar = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    const mio = texto; setTexto('')
    setMensajes(m => [...m, { rol: 'user', texto: mio }]); setBusy(true)
    try {
      const r = await enviar(mio, sesion)
      setSesion(r.sesion_id)
      setMensajes(m => [...m, { rol: 'bot', texto: r.respuesta, resultado: r.resultado }])
    } catch {
      setMensajes(m => [...m, { rol: 'bot', texto: 'Ocurrió un error procesando tu mensaje.' }])
    } finally { setBusy(false) }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[75vh]">
      <h1 className="text-2xl font-semibold mb-4">Asistente de valuación</h1>
      <div className="flex-1 card overflow-y-auto space-y-3">
        {mensajes.map((m, i) => (
          <div key={i} className={`flex ${m.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.rol === 'user' ? 'bg-brand text-white' : 'bg-slate-100 text-ink'}`}>
              {m.texto}
              {m.resultado && (
                <div className="mt-2 text-xs bg-white rounded-lg p-2 text-ink">
                  <p className="font-semibold text-brand text-base">{fmtMXN(m.resultado.valor_estimado)}</p>
                  <p>Rango {fmtMXN(m.resultado.valor_min)}–{fmtMXN(m.resultado.valor_max)} · confianza {m.resultado.confianza}</p>
                  <Link to="/inmuebles" className="text-brand">Registrar inmueble →</Link>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={fin} />
      </div>
      <form onSubmit={mandar} className="mt-3 flex gap-2">
        <input className="input" placeholder="Describe tu inmueble…" value={texto} onChange={e => setTexto(e.target.value)} />
        <button className="btn-primary" disabled={busy}>{busy ? '…' : 'Enviar'}</button>
      </form>
    </div>
  )
}
