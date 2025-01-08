import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/unauthorized',
      component: () => import('@/views/Unauthorized.vue')
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  console.log(1)
  if (!to.meta.requiresAuth) return next()
    console.log(2)
  if (authStore.isAuthenticated) return next()
    console.log(3)
  
  console.log(4)
  const urlParams = new URLSearchParams(window.location.search)
  console.log(5)
  const authParam = urlParams.get('auth')
  console.log(6)

  if (!authParam) return next('/unauthorized')
  console.log(7)

  try {
    console.log(8)
    await authStore.initializeFromParams(authParam!)
    console.log(9)
    window.history.replaceState({}, document.title, window.location.pathname)
    return next()
  } catch (error) {
    return next('/unauthorized')
  }
})

export default router