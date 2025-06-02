<template>
    <div class="rounded-lg border border-gray-500 p-2">
        <component
            :is="icon"
            class="h-6 w-6 text-primary-500 accent-layer:text-tertiary-500 accent-fill-layer:fill-tertiary-500 dark:text-gray-300 dark:accent-layer:text-tertiary-700 dark:accent-fill-layer:fill-tertiary-700"
            aria-hidden="true"
        />
    </div>
</template>
<script setup lang="ts">
    defineProps<{ icon: any }>();
</script>
