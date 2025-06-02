<template>
    <button
        type="button"
        class="inline-flex items-center rounded-md text-sm font-medium"
        :class="[props.disabled ? 'cursor-not-allowed opacity-50' : '']"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<script lang="ts" setup>
    interface IProps {
        disabled?: boolean;
    }
    const props = withDefaults(defineProps<IProps>(), {
        disabled: false,
    });
</script>

<style scoped></style>
