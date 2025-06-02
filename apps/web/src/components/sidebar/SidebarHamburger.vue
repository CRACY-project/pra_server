<template>
    <button
        type="button"
        class="h-full px-4 text-gray-500 focus:outline-none dark:text-gray-300 md:hidden"
        :class="{
            'border  ': !securityPanel,
        }"
        @click="sidebarStore.setIsCollapsed()"
    >
        <span class="sr-only">Open sidebar</span>
        <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
    </button>
</template>
<script setup lang="ts">
    import { Bars3BottomLeftIcon } from '@heroicons/vue/24/outline';

    export interface IProps {
        securityPanel?: boolean;
    }
    withDefaults(defineProps<IProps>(), {
        securityPanel: false,
    });

    import { useSidebarStore } from '@/stores/sidebar.store';

    const sidebarStore = useSidebarStore();
</script>
