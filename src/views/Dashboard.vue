<script setup lang="ts">
    import { useAuthStore } from '../stores/auth';
    import apiAuthenticationService from '../lib/axios';
    import apiBackendService from '../lib/backend-config';

    const authStore = useAuthStore()
    const navigation = authStore.navigationMenu

    const logout = async() => {
        try {
            await apiAuthenticationService.post('/auth/system-logout', {
                systemId: authStore.getSystemId
            })
        } catch (error) {
            console.log(error)
        } finally {
            authStore.clearAuth()
            window.close()
        }
    }

    const getDepartamentos = async() => {
        try {
            const response = await apiBackendService.get('departamentos')
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getDatosIniciales = async() => {
        try {
            const response = await apiBackendService.get('denuncias/datos-iniciales')
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getDatosFiltro = async() => {
        try {
            const response = await apiBackendService.get('denuncias/datos-filtro')
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }
</script>

<template>
    <div>
        <header>
            <button @click="logout">Cerrar Session</button>
        </header>
        <main class="buttonContainer">
            <button @click="getDepartamentos">Ver departamentos</button>
            <button @click="getDatosIniciales">Datos Iniciales</button>
            <button @click="getDatosFiltro">Datos Filtro</button>
        </main>
        <pre>
            {{ navigation }}
        </pre>
    </div>
</template>

<style scoped>
    .buttonContainer {
        display: flex;
        margin: 10px 0px;
        justify-content: center;
        gap: 1rem;
    }
    .buttonContainer button {
        border: none;
        border-radius: 5px;
        width: auto;
        height: 30px;
        cursor: pointer;
    }
</style>