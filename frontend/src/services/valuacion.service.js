import api from '../lib/api'
export const listar   = () => api.get('/valuacion').then(r => r.data)
export const obtener  = (id) => api.get(`/valuacion/${id}`).then(r => r.data)
export const crear    = (inmueble_id) => api.post('/valuacion', { inmueble_id }).then(r => r.data)
export const cambiarEstado = (id, estado) => api.patch(`/valuacion/${id}/estado`, { estado }).then(r => r.data)
export const pdfUrl   = (id) => `${import.meta.env.VITE_API_URL || '/api'}/reportes/valuacion/${id}/pdf`
