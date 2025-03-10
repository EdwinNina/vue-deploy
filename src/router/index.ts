import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/initialize',
      name: 'auth-initialize',
      component: () => import('@/views/AuthInitializer.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/Unauthorized.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/Error.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: (to) => {
        // Si hay un parámetro auth, redirigir a initialize
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('auth')) {
          return { path: '/auth/initialize', query: { auth: urlParams.get('auth') } }
        }
        return '/dashboard'
      }
    }
  ],
})

const validateAccess = async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  // Si la ruta no requiere autenticación
  if (!to.meta.requiresAuth) return true

  // Si ya está autenticado, permitir acceso
  if (authStore.isAuthenticated) return true

  // Verificar si hay datos de autenticación en la URL
  const urlParams = new URLSearchParams(window.location.search)
  const authData = urlParams.get('auth')

  if (authData) return true

  const loaded = await authStore.loadPersistedData()

  return loaded
}

router.beforeEach(async (to, from, next) => {
  try {
    if (!to.meta.requiresAuth) {
      next()
      return
    }

    const canAccess = await validateAccess(to)
    
    if (canAccess) {
      next()
    } else {
      if (to.path !== '/unauthorized') {
        next('/unauthorized')
      } else {
        next()
      }
    }
  } catch (error) {
    console.error('Navigation error:', error)
    if (to.path !== '/unauthorized') {
      next('/unauthorized')
    } else {
      next()
    }
  }
})

export default router