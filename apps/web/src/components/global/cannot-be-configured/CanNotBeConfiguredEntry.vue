<template>
    <div
        class="flex flex-row items-center justify-between select-none"
        :class="!dependency.done && 'cursor-pointer'"
        @click="!dependency.done && $router.push({ name: dependency.path })"
    >
        <div class="flex flex-row items-center gap-3">
            <DependencyIcon :icon="dependency.icon" />
            <p>Configure {{ dependency.name }}</p>
        </div>
        <CheckIcon v-if="dependency.done" class="h-6 w-6 text-green-500" aria-hidden="true" />
        <ChevronRightIcon v-else class="h-6 w-6" aria-hidden="true" />
    </div>
</template>
<script lang="ts" setup>
    import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

    import type { Dependency } from './cannot-be-configured.types';
    import DependencyIcon from './DependencyIcon.vue';

    defineProps<{ dependency: Dependency }>();
</script>
