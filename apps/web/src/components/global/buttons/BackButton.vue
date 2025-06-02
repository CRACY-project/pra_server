<template>
    <div class="flex h-full w-fit cursor-pointer items-center border-r py-4 pr-4" @click="emit('goBack')">
        <slot>
            <ArrowLongLeftIcon class="mr-1.5 h-7 w-7 text-primary-500 dark:text-gray-300" aria-hidden="true" />
        </slot>
    </div>
</template>
<script setup lang="ts">
    import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline';

    const emit = defineEmits(['goBack']);
</script>
