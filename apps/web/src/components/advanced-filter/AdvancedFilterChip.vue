<template>
    <Chip class="flex border bg-gray-50 text-sm font-normal dark:!bg-dark-400">
        <span class="text-gray-500 dark:text-gray-100"> <slot name="field"></slot>:&nbsp;</span>
        <span class="text-secondary-800 dark:text-tertiary-700"><slot name="matchType"></slot>&nbsp;</span>
        <span class="text-primary-600 dark:text-gray-300">"<slot name="value"></slot>"</span>

        <XMarkIcon
            class="ml-1 h-5 w-5 cursor-pointer font-bold text-gray-700 dark:text-gray-300"
            @click="removeFilter"
        />
    </Chip>
</template>
<script lang="ts" setup>
    import { XMarkIcon } from '@heroicons/vue/24/outline';

    const emit = defineEmits(['removeFilter']);

    const removeFilter = () => {
        emit('removeFilter');
    };
</script>
