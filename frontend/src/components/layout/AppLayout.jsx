import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES, ROL_COLOR } from '../../lib/format.js'
import Logo from '../ui/Logo.jsx'
import {
  HomeIcon, BuildingOffice2Icon, CalculatorIcon, ChartBarIcon,
  ChatBubbleLeftRightIcon, UserIcon, ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

const NAV = [
  { to: '/', label: 'Inicio', icon: HomeIcon, end: true },
  { to: '/inmuebles', label: 'Inmuebles', icon: BuildingOffice2Icon, roles: ['admin','valuador','cliente'] },
  { to: '/valuaciones', label: 'Valuaciones', icon: CalculatorIcon },
  { to: '/mercado', label: 'Mercado', icon: ChartBarIcon },
  { to: '/chatbot', label: 'Asistente', icon: ChatBubbleLeftRightIcon },
]

export default function AppLayout () {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const salir = () => { logout(); navigate('/login') }
  const items = NAV.filter((n) => !n.roles || n.roles.includes(usuario?.rol))

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100">
          <Logo />
          <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROL_COLOR[usuario?.rol] || 'bg-slate-100 text-slate-500'}`}>
            {ROLES[usuario?.rol]}
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <n.icon className="h-5 w-5" /> {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={salir} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100">
          <ArrowRightOnRectangleIcon className="h-5 w-5" /> Salir
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-end px-6 gap-4">
          <NavLink to="/perfil" className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand">
            <UserIcon className="h-5 w-5" />
            <span className="font-medium">{usuario?.nombre}</span>
            <span className="text-xs text-slate-400">· {ROLES[usuario?.rol]}</span>
          </NavLink>
        </header>
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  )
}
