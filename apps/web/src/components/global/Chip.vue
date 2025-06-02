<template>
    <button
        :class="`max-w-fit items-center truncate rounded-full px-3 py-1 ${customStyle}`"
        :disabled="!click"
        @click="click"
    >
        <slot />
    </button>
</template>

<script lang="ts" setup>
    interface IProps {
        click?: () => void;
        customStyle?: string;
    }

    withDefaults(defineProps<IProps>(), {
        click: undefined,
        customStyle: 'bg-gray-200 dark:bg-tertiary-700',
    });
</script>

<style scoped></style>
