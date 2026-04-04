import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atv_access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for handling token refresh or errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem('atv_refresh')
      if (refresh) {
        try {
          const resp = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, { refresh })
          localStorage.setItem('atv_access', resp.data.access)
          api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access}`
          return api(originalRequest)
        } catch (err) {
          localStorage.removeItem('atv_access')
          localStorage.removeItem('atv_refresh')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
