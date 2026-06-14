import { Link } from 'react-router-dom'
import Logo from '../../components/ui/Logo.jsx'
export default function NotFound () {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <Logo size={40} />
      <h1 className="text-6xl font-display font-bold text-brand mt-6">404</h1>
      <p className="text-slate-500 mt-2">La página que buscas no existe.</p>
      <Link to="/" className="btn-primary mt-6">Volver al inicio</Link>
    </div>
  )
}
