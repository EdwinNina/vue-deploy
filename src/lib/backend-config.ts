import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const apiBackendUrl = import.meta.env.VITE_API_BACKEND_URL

const apiBackendService = axios.create({
   baseURL: `${apiBackendUrl}/api`
})

apiBackendService.interceptors.request.use( response => {
   const store = useAuthStore()
   if(store.isAuthenticated) {
      const token = store.access_token
      console.log(token)
      response.headers.Authorization = `Bearer ${token}`
   }

   return response
})

export default apiBackendService