import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Spinner from '../ui/Spinner.jsx'

export default function ProtectedRoute ({ children, roles }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <Spinner />
  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />
  return children
}
