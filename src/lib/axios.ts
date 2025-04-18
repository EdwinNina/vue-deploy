import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const apiAuthenticationUrl = import.meta.env.VITE_API_AUTHENTICATION_URL

const apiAuthenticationService = axios.create({
   baseURL: `${apiAuthenticationUrl}/api`
})

apiAuthenticationService.interceptors.request.use( response => {
   const store = useAuthStore()
   if(store.isAuthenticated) {
      const token = store.access_token
      console.log(token)
      response.headers.Authorization = `Bearer ${token}`
   }

   return response
})

export default apiAuthenticationService