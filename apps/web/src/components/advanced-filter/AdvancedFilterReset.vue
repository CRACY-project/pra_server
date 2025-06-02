<template>
    <Chip
        class="flex cursor-pointer border bg-gray-50 text-sm font-normal hover:bg-gray-100 dark:!bg-dark-400 dark:hover:!bg-dark-500"
        :click="resetFilter"
    >
        <span class="text-gray-500 dark:text-gray-300"><slot>Reset Filters</slot></span>
    </Chip>
</template>
<script lang="ts" setup>
    const emit = defineEmits(['resetFilter']);

    const resetFilter = () => {
        emit('resetFilter');
    };
</script>
