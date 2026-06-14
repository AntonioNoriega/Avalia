import api from '../lib/api'
export const stats = () => api.get('/dashboard/stats').then(r => r.data)
