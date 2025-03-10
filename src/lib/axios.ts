import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL
const systemPrefix = import.meta.env.VITE_SYSTEM_PREFIX

const apiGatewayService = axios.create({
   baseURL: `${apiGatewayUrl}/${systemPrefix}/api`
})

apiGatewayService.interceptors.request.use( response => {
   const store = useAuthStore()
   if(store.isAuthenticated) {
    const token = store.tokens?.access_token
    response.headers.Authorization = `Bearer ${token}`
   }

   return response
})

export default apiGatewayService