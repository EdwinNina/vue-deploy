<script setup lang="ts">
    import { useAuthStore } from '../stores/auth';
    import apiGatewayService from '../lib/axios';
    import axios from 'axios'

    const authStore = useAuthStore()
    const navigation = authStore.navigationMenu
    const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL

    const logout = async() => {
        const logoutService = await axios.create({
            baseURL: apiGatewayUrl
        })
        try {
            await logoutService.post('/auth/system-logout', {
                id: authStore.getSystemId
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
            const response = await apiGatewayService.get('departamentos')
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
    }
    .buttonContainer button {
        border: none;
        border-radius: 5px;
        width: auto;
        height: 30px;
    }
</style>