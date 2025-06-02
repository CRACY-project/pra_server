<template>
    <div class="text-slate-800 dark:text-gray-100" :style="isDark ? `color-scheme: dark;` : ''">
        <RouterView />

        <notifications position="top right" :pause-on-hover="true" classes="app-notification" />
    </div>
</template>
<script setup lang="ts">
    import { useDark } from '@vueuse/core';
    import { RouterView } from 'vue-router';

    const isDark = useDark();
</script>
