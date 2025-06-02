<template>
    <IconButton bg-color="bg-transparent" bg-color-hover="bg-transparent" shadow="shadow-none">
        <AdjustmentsHorizontalIcon
            class="h-7 w-7 font-bold text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300"
            aria-hidden="true"
        />
    </IconButton>
</template>
<script lang="ts" setup>
    import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';

    import IconButton from '@/components/global/IconButton.vue';
</script>
