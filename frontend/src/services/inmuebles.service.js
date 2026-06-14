import api from '../lib/api'
export const listar   = () => api.get('/inmuebles').then(r => r.data)
export const obtener  = (id) => api.get(`/inmuebles/${id}`).then(r => r.data)
export const crear    = (body) => api.post('/inmuebles', body).then(r => r.data)
export const eliminar = (id) => api.delete(`/inmuebles/${id}`).then(r => r.data)
