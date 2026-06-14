import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as inmS from '../../services/inmuebles.service.js'
import * as valS from '../../services/valuacion.service.js'
import { zonas as zonasS } from '../../services/mercado.service.js'
import Spinner from '../../components/ui/Spinner.jsx'

const TIPOS = ['casa','departamento','terreno','local','oficina']
const CONSERVA = ['nuevo','bueno','regular','remodelar']
const IMAGENES_PRESETEADAS = {
  casa: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
  departamento: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
  terreno: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
  local: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
  oficina: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
}
const vacio = { tipo:'departamento', zona_id:'', superficie_m2:'', construccion_m2:'', recamaras:2, banos:1, estacionamientos:1, antiguedad_anios:0, estado_conserva:'bueno', imagen_url:'' }

export default function Inmuebles () {
  const navigate = useNavigate()
  const [lista, setLista] = useState(null)
  const [zonas, setZonas] = useState([])
  const [form, setForm] = useState(vacio)
  const [abrir, setAbrir] = useState(false)
  const [error, setError] = useState('')

  const cargar = () => inmS.listar().then(setLista)
  useEffect(() => { cargar(); zonasS().then((z) => { setZonas(z); setForm(f => ({ ...f, zona_id: z[0]?.id || '' })) }) }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault(); setError('')
    try {
      const num = ['superficie_m2','construccion_m2','recamaras','banos','estacionamientos','antiguedad_anios']
      const body = { ...form }; num.forEach(k => body[k] = Number(body[k]))
      if (!body.imagen_url) {
        delete body.imagen_url
      }
      await inmS.crear(body); setAbrir(false); setForm({ ...vacio, zona_id: zonas[0]?.id }); cargar()
    } catch (err) { setError(err.response?.data?.message || 'No se pudo guardar') }
  }

  const valuar = async (id) => {
    try { const v = await valS.crear(id); navigate(`/valuaciones/${v.id}`) }
    catch (err) { alert(err.response?.data?.message || 'No se pudo valuar') }
  }

  if (!lista) return <Spinner />
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inmuebles</h1>
        <button className="btn-primary" onClick={() => setAbrir(!abrir)}>{abrir ? 'Cerrar' : 'Nuevo inmueble'}</button>
      </div>

      {abrir && (
        <form onSubmit={guardar} className="card grid sm:grid-cols-3 gap-4">
          {error && <div className="sm:col-span-3 rounded bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
          <div><label className="label">Tipo</label>
            <select className="input" value={form.tipo} onChange={set('tipo')}>{TIPOS.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="label">Zona</label>
            <select className="input" value={form.zona_id} onChange={set('zona_id')}>{zonas.map(z => <option key={z.id} value={z.id}>{z.colonia}</option>)}</select></div>
          <div><label className="label">Estado</label>
            <select className="input" value={form.estado_conserva} onChange={set('estado_conserva')}>{CONSERVA.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Terreno (m²)</label><input className="input" type="number" value={form.superficie_m2} onChange={set('superficie_m2')} /></div>
          <div><label className="label">Construcción (m²)</label><input className="input" type="number" value={form.construccion_m2} onChange={set('construccion_m2')} /></div>
          <div><label className="label">Antigüedad (años)</label><input className="input" type="number" value={form.antiguedad_anios} onChange={set('antiguedad_anios')} /></div>
          <div><label className="label">Recámaras</label><input className="input" type="number" value={form.recamaras} onChange={set('recamaras')} /></div>
          <div><label className="label">Baños</label><input className="input" type="number" value={form.banos} onChange={set('banos')} /></div>
          <div><label className="label">Estacionamientos</label><input className="input" type="number" value={form.estacionamientos} onChange={set('estacionamientos')} /></div>
          <div className="sm:col-span-3"><label className="label">URL de Foto (Opcional)</label>
            <input className="input" type="text" placeholder="https://ejemplo.com/foto.jpg" value={form.imagen_url} onChange={set('imagen_url')} /></div>
          <div className="sm:col-span-3"><button className="btn-primary">Guardar inmueble</button></div>
        </form>
      )}

      {!lista.length ? <p className="text-sm text-slate-400">No hay inmuebles. Registra el primero.</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lista.map((i) => (
            <div key={i.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                  src={i.imagen_url || IMAGENES_PRESETEADAS[i.tipo] || IMAGENES_PRESETEADAS.casa} 
                  alt={i.tipo} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase text-brand shadow-sm tracking-wider">
                  {i.tipo}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-ink truncate capitalize">{i.tipo} en {i.zona?.colonia || '-'}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                    {i.zona ? `${i.zona.municipio}, ${i.zona.estado}` : '-'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">📏</span>
                      <span>{i.construccion_m2} m² const.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">🛏️</span>
                      <span>{i.recamaras} {i.recamaras === 1 ? 'rec' : 'recs'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">🚿</span>
                      <span>{i.banos} {i.banos === 1 ? 'baño' : 'baños'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">🚗</span>
                      <span>{i.estacionamientos || 0} {i.estacionamientos === 1 ? 'estac' : 'estacs'}</span>
                    </div>
                  </div>
                </div>
                
                <button className="btn-valor w-full mt-5" onClick={() => valuar(i.id)}>
                  Valuar inmueble
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

