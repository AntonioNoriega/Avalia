export const fmtMXN = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-MX')
export const ROLES = {
  admin: 'Administrador', valuador: 'Valuador',
  analista_mercado: 'Analista de mercado', cliente: 'Cliente',
}
export const ROL_COLOR = {
  admin:            'bg-purple-100 text-purple-700',
  valuador:         'bg-blue-100 text-blue-700',
  analista_mercado: 'bg-amber-100 text-amber-700',
  cliente:          'bg-green-100 text-green-700',
}
