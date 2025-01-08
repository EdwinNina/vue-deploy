<template>
    <div>
        <pre>
            {{ JSON.stringify(modules) }}
        </pre>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '../stores/auth';

    const authStore = useAuthStore()
    const modules = authStore.getModules()
    console.log(authStore.tokens?.access_token)
</script>