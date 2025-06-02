<template>
    <span class="inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium" :class="[textColor, bgColor]">
        <slot />
    </span>
</template>

<script lang="ts" setup>
    interface IProps {
        textColor: string;
        bgColor: string;
    }

    const { textColor = 'bg-red-100', bgColor = 'text-red-800' } = defineProps<IProps>();
</script>

<style scoped></style>
