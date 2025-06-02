<template>
    <CheckIcon v-if="value" class="h-6 w-6" aria-hidden="true" />
    <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
</template>

<script lang="ts" setup>
    import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

    interface IProps {
        value: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        value: false,
    });
</script>

<style scoped></style>
