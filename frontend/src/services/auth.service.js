import api from '../lib/api'
export const cambiarPassword = (actual, nueva) => api.patch('/auth/me/password', { actual, nueva }).then(r => r.data)
