import axios from 'axios' 
import { ACCESS_TOKEN } from './constants'

const api = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL
    }
) //new instance with custom config

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.log(error)
        return Promise.reject(error)
    }
) //sets request headers

export default api