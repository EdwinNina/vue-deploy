import type { SystemData, SystemLogin } from '@/types/auth.types';
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const access_token = ref<string|null>(null);
    const refresh_token = ref<string|null>(null);
    const user = ref();
    const systemData = ref<SystemData | null>(null);

    const isAuthenticated = computed(() => {
        return !!access_token.value && !!user.value && !!systemData.value;
    });

    const navigationMenu = computed(() => {
        return systemData.value?.modules.sort((a, b) => a.mod_order - b.mod_order) || [];
    });

    const userRoles = computed(() => systemData.value?.roles || []);

    const hasPermission = computed(() => {
        return (actionKey: string) => {
        return systemData.value?.roles.some(role => 
            role.actions.some(action => action.act_key_name === actionKey)
        ) || false;
        };
    });

    const getSystemId = computed(() => systemData.value?.systemId || null)

    function initializeAuth(authData: SystemLogin) {
        access_token.value = authData.access_token;
        user.value = authData.userData;
        systemData.value = authData.systemData;

        persistAuthData(authData);
    }
    
    function persistAuthData(authData: SystemLogin) {
        sessionStorage.setItem('access_token', authData.access_token);
        document.cookie = `refresh_token=${authData.refresh_token}; path=/; secure; samesite=strict; max-age=604800`; // 7 días
    
        // Guardar datos no sensibles en localStorage
        localStorage.setItem('user', JSON.stringify(authData.userData));
        localStorage.setItem('systemData', JSON.stringify(authData.systemData));
        localStorage.setItem('lastLogin', new Date().toISOString());
    }

    function loadPersistedData() {
        try {
            const persistedUser = localStorage.getItem('user');
            const persistedSystemData = localStorage.getItem('systemData');
            const accessToken = sessionStorage.getItem('access_token');
            
            if (persistedUser && persistedSystemData && accessToken) {
                user.value = JSON.parse(persistedUser);
                systemData.value = JSON.parse(persistedSystemData);
                access_token.value = accessToken
                refresh_token.value = getRefreshTokenFromCookie()
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading persisted data:', error);
            clearAuth();
            return false;
        }
    }

    function getRefreshTokenFromCookie(): string {
        const cookies = document.cookie.split(';');
        const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refresh_token='));
        return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : '';
    }

    function clearAuth() {
        access_token.value = null;
        refresh_token.value = null;
        user.value = null;
        systemData.value = null;
        
        localStorage.removeItem('user');
        localStorage.removeItem('systemData');
        localStorage.removeItem('lastLogin');
        sessionStorage.removeItem('access_token');

        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    return {
        access_token,
        refresh_token,
        user,
        systemData,
        isAuthenticated,
        navigationMenu,
        userRoles,
        hasPermission,
        getSystemId,
        initializeAuth,
        loadPersistedData,
        clearAuth
    };
})