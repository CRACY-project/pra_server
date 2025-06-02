<template>
    <div
        class="relative h-full w-full overflow-hidden pl-28 pt-16 text-primary-500 dark:bg-dark-500 dark:text-gray-300"
    >
        <CracyLogo />

        <h1 class="pb-4 pt-7 text-4xl font-bold">PRA Platform</h1>
        <div class="pl-2">
            <div class="flex h-20 flex-col">
                <h2 class="pr-1 font-medium">Welcome,</h2>
                <span class="break-words text-sm">{{ user?.email }}</span>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    import CracyLogo from '@/components/CracyLogo.vue';
    import { useAuthStore } from '@/stores/auth.store';

    const user = ref(useAuthStore().user);
</script>
