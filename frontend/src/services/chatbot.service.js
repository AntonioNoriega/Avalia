import api from '../lib/api'
export const enviar    = (texto, sesion_id) => api.post('/chatbot/mensaje', { texto, sesion_id }).then(r => r.data)
export const historial = () => api.get('/chatbot/sesiones').then(r => r.data)
