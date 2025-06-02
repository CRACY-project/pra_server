<template>
    <button
        type="button"
        class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
        :class="[
            `${bgColor} ${textColor} ${border} ${bgColorHover} ${shadow}`,
            disabled ? 'cursor-not-allowed opacity-50' : '',
        ]"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<script lang="ts" setup>
    interface IProps {
        bgColor?: string;
        textColor?: string;
        border?: string;
        disabled?: boolean;
        bgColorHover?: string;
        shadow?: string;
    }
    withDefaults(defineProps<IProps>(), {
        bgColor: 'bg-primary-500 dark:bg-tertiary-700',
        textColor: 'text-white',
        bgColorHover: 'hover:bg-primary-600 dark:hover:bg-tertiary-600',
        border: 'border border-transparent',
        disabled: false,
        shadow: 'shadow-sm',
    });
</script>

<style scoped></style>
