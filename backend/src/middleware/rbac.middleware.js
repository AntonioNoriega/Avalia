// ── Control de acceso por rol (RBAC) ────────────────────────────
export const rbac = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' })
  if (!roles.includes(req.user.rol))
    return res.status(403).json({ message: 'No autorizado para esta acción' })
  next()
}

// Helpers por combinación de roles (pensados por función, no por jerarquía)
export const soloAdmin      = rbac('admin')
export const gestionMercado = rbac('admin', 'analista_mercado')
export const operaValuacion = rbac('admin', 'valuador')
export const creaValuacion  = rbac('admin', 'valuador', 'cliente')
export const todos          = rbac('admin', 'valuador', 'analista_mercado', 'cliente')
