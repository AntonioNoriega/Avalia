import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import Login from './pages/auth/Login.jsx'
import NotFound from './pages/auth/NotFound.jsx'
import Perfil from './pages/auth/Perfil.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Inmuebles from './pages/inmuebles/Inmuebles.jsx'
import Valuaciones from './pages/valuacion/Valuaciones.jsx'
import ValuacionDetalle from './pages/valuacion/ValuacionDetalle.jsx'
import Mercado from './pages/mercado/Mercado.jsx'
import Chatbot from './pages/chatbot/Chatbot.jsx'

export default function App () {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="inmuebles" element={<Inmuebles />} />
        <Route path="valuaciones" element={<Valuaciones />} />
        <Route path="valuaciones/:id" element={<ValuacionDetalle />} />
        <Route path="mercado" element={<Mercado />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
