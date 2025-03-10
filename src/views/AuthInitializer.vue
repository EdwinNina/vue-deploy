<script setup lang="ts">
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '../stores/auth';

    const router = useRouter()
    const authStore = useAuthStore()

    onMounted(async() => {
        const urlParams = new URLSearchParams(window.location.search)
        const encodedData = urlParams.get('auth')

        if (encodedData) {
            try {
                const authData = JSON.parse(atob(encodedData))
                await authStore.initializeAuth(authData)

                window.history.replaceState({}, document.title, window.location.pathname);
                router.push('/dashboard');
            } catch (error) {
                console.error('Authentication initialization failed:', error);
                router.push('/error')
            }
        } else {
            authStore.loadPersistedData();

            if (!authStore.isAuthenticated) {
                window.location.href = import.meta.env.VITE_SIGAP_URL
            } else {
                router.push('/dashboard')
            }
        }
    })
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">
                Iniciando SIIPOL
                </h2>
                <p class="text-gray-600">
                Por favor espere mientras configuramos su acceso...
                </p>
                <!-- Aquí puedes agregar un spinner o animación de carga -->
                <div class="mt-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
                </div>
            </div>
        </div>
    </div>
</template>