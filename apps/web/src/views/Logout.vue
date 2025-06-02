<template>Logging out...</template>

<script lang="ts" setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    import { useAuthService } from '@/services/auth.service';

    import { useAuthStore } from '../stores/auth.store';

    const authStore = useAuthStore();
    const authService = useAuthService();
    const router = useRouter();

    const logout = async () => {
        authStore.logout();
        try {
            await authService.logout();
        } finally {
            router.push({ name: 'login' });
        }
    };

    onMounted(async () => {
        await logout();
    });
</script>

<style scoped></style>
