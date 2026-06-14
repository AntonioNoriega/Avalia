const MAP = {
  alta:  'bg-emerald-100 text-emerald-700',
  media: 'bg-amber-100 text-amber-700',
  baja:  'bg-red-100 text-red-700',
  borrador: 'bg-slate-100 text-slate-600',
  calculada: 'bg-blue-100 text-blue-700',
  revisada: 'bg-indigo-100 text-indigo-700',
  firmada: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
}
export default function Badge ({ value }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${MAP[value] || 'bg-slate-100 text-slate-600'}`}>{value}</span>
}
