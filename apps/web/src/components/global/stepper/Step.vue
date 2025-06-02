<template>
    <div
        :class="`flex w-full flex-1 cursor-default select-none items-center border-t-4 pt-4 sm:flex-col sm:items-start ${
            isActive ? activeStyles.border : inactiveStyles.border
        }`"
    >
        <p :class="`pr-2 text-sm font-bold sm:pr-0 ${isActive ? activeStyles.text : inactiveStyles.text}`">
            STEP {{ stepNumber + 1 }}
        </p>
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
    interface IProps {
        stepNumber: number;
        isActive: boolean;
    }

    defineProps<IProps>();

    const activeStyles = {
        border: 'border-primary-500 dark:border-tertiary-700',
        text: 'text-primary-500 dark:text-tertiary-700',
    };

    const inactiveStyles = {
        border: 'border-gray-300 dark:border-dark-100',
        text: 'text-gray-500 dark:text-gray-300',
    };
</script>
