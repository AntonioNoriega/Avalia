import api from '../lib/api'
export const comparables = (params) => api.get('/mercado/comparables', { params }).then(r => r.data)
export const zonas       = () => api.get('/mercado/zonas').then(r => r.data)
export const statsZona   = (id, tipo) => api.get(`/mercado/zonas/${id}/stats`, { params: { tipo } }).then(r => r.data)
export const crearComparable = (body) => api.post('/mercado/comparables', body).then(r => r.data)
