import { defineStore } from 'pinia'
import { ref } from 'vue'
import { decryptData } from '@/utils/encryption'
import type { Module, Role, SystemData, Tokens, User } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
    const tokens = ref<Tokens | null>(null)
    const systemData = ref<SystemData | null>(null)
    const user = ref<User | null>(null)
    const isAuthenticated = ref(false)

    async function initializeFromParams(encryptedParams: string) {
        console.log(encryptedParams)
        try {
            // Desencriptar datos
            const decryptedData = await decryptData(encryptedParams)
            if (!decryptedData || typeof decryptedData !== 'object') {
                throw new Error('Los datos desencriptados no son válidos')
            }
            // Almacenar datos
            tokens.value = decryptedData.tokens
            systemData.value = decryptedData.systemData
            user.value = decryptedData.user
            isAuthenticated.value = true

            // Persistir estado
            persistState()
        } catch (error) {
            console.error('Error al inicializar autenticación:', error)
            clearState()
            throw error
        }
    }

    function persistState() {
        localStorage.setItem('authState', JSON.stringify({
            tokens: tokens.value,
            systemData: systemData.value,
            user: user.value,
            isAuthenticated: true
        }))
    }

    function clearState() {
        tokens.value = null
        systemData.value = null
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('authState')
    }

    // Getters útiles
    function getModules(): Module[] {
        return systemData.value?.modules || []
    }

    function getRoles(): Role[] {
        return systemData.value?.roles || []
    }

    function hasPermission(actionKey: string): boolean {
        return systemData.value?.roles.some(role => 
            role.roleModuleActions.some(action => 
                action.moduleAction.actions.act_key_name === actionKey
            )
        ) || false
    }

    function getAccessToken(): string | null {
        return tokens.value?.access_token || null
    }

    function getRefreshToken(): string | null {
        return tokens.value?.refresh_token || null
    }

    // Restaurar estado
    const restoreState = () => {
        const savedState = localStorage.getItem('authState')
        if (savedState) {
            const state = JSON.parse(savedState);
            tokens.value = state.tokens;
            systemData.value = state.systemData;
            user.value = state.user;
            isAuthenticated.value = true;
        } else {
            console.log('No hay estado guardado en localStorage.');
        }
    }

    // Restaurar estado al iniciar
    restoreState()

    return {
        tokens,
        systemData,
        user,
        isAuthenticated,
        initializeFromParams,
        clearState,
        getModules,
        getRoles,
        hasPermission,
        getAccessToken,
        getRefreshToken
    }
})