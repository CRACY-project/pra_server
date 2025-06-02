<template>
    <div title="Reload">
        <ArrowPathIcon
            v-if="!isReloaded"
            class="rotating h-7 w-7 text-primary-500 hover:cursor-pointer hover:text-primary-600 dark:text-tertiary-700 dark:hover:text-tertiary-600"
            :class="{ 'animate-spin': isReloading }"
            aria-hidden="true"
            @click="emit('reload')"
        />
        <div v-else-if="isReloaded" class="flex items-center">
            <CheckIcon class="h-5 w-5 text-primary-500 dark:text-tertiary-700" aria-hidden="true" />
            <span class="text-primary-500 dark:text-tertiary-700">Refreshed</span>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ArrowPathIcon, CheckIcon } from '@heroicons/vue/24/outline';

    defineProps<{ isReloading: boolean; isReloaded: boolean }>();
    const emit = defineEmits(['reload']);
</script>
