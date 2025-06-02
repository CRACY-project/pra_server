<template>
    <CrudButton bg-color="bg-amber-500 dark:bg-amber-600" bg-color-hover="hover:bg-amber-600 dark:hover:bg-amber-700">
        <CogIcon
            class="text-primary-500 accent-fill-layer:fill-primary-500 dark:text-tertiary-700 dark:accent-fill-layer:fill-tertiary-700 h-6 w-6 hover:opacity-75"
            aria-hidden="true"
        />
    </CrudButton>
</template>
<script setup lang="ts">
    import { CogIcon } from '@heroicons/vue/24/outline';
</script>
