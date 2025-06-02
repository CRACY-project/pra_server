<script setup lang="ts">
    import Button from '@/components/global/Button.vue';
</script>

<template>
    <Button
        bg-color="bg-white dark:bg-dark-200"
        text-color="text-gray-900 dark:text-gray-300"
        border="border"
        bg-color-hover="hover:bg-gray-50 dark:hover:bg-dark-100"
        class="h-min whitespace-nowrap"
    >
        <slot>Cancel</slot>
    </Button>
</template>
