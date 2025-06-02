<template>
    <button
        type="button"
        class="fixed bottom-5 right-0 z-10 inline-flex -translate-x-1/2 transform items-center rounded-full border border-transparent bg-primary-600 p-2 text-white shadow-sm hover:bg-primary-700 focus:outline-none dark:bg-tertiary-700 md:hidden"
        @click="handleClick"
    >
        <PlusIcon class="h-6 w-6 text-white" aria-hidden="true" />
    </button>
</template>

<script lang="ts" setup>
    import { PlusIcon } from '@heroicons/vue/24/outline';

    const emit = defineEmits(['on-create-new']);
    const handleClick = () => {
        emit('on-create-new');
    };
</script>
