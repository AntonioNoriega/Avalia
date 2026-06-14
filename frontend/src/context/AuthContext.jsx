import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider ({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('avalia_token')
    if (!token) { setCargando(false); return }
    api.get('/auth/me').then(({ data }) => setUsuario(data.usuario))
      .catch(() => localStorage.removeItem('avalia_token'))
      .finally(() => setCargando(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('avalia_token', data.token)
    setUsuario(data.usuario)
    return data.usuario
  }
  const logout = () => { localStorage.removeItem('avalia_token'); setUsuario(null) }

  return <AuthCtx.Provider value={{ usuario, cargando, login, logout }}>{children}</AuthCtx.Provider>
}
