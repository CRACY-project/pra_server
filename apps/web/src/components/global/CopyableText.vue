<template>
    <div
        class="h-full hover:cursor-pointer hover:text-blue-400 hover:underline"
        @click.stop="copyToClipboard(value)"
        @dblclick.stop
        @click.prevent
    >
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
    import { copyToClipboard } from '@/utils';

    defineProps<{ value: { subject: string; text: string } }>();
</script>
