<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">
            Acceso No Autorizado
        </h2>
        <p class="text-gray-600 mb-4">
            No tiene permisos para acceder a este sistema o su sesión ha expirado.
        </p>
        <button 
            @click="redirectToSigap" 
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Volver a SIGAP
        </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    const redirectToSigap = () => {
        window.location.href = import.meta.env.VITE_SIGAP_URL
    }
</script>