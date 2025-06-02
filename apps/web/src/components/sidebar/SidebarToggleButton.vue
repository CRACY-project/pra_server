<template>
    <button
        type="button"
        class="dark:bg-dark-400 dark:hover:bg-dark-500 absolute z-10 hidden items-center rounded-full border bg-white p-0.5 text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none md:inline-flex dark:text-gray-300"
        style="top: max(calc(100% - 170px - 10vh), 70px)"
        @click="sidebarStore.setIsCollapsed()"
    >
        <ChevronRightIcon class="h-5 w-5" :class="[sidebarStore.isCollapsed ? '' : 'rotate-180']" aria-hidden="true" />
    </button>
</template>
<script setup lang="ts">
    import { ChevronRightIcon } from '@heroicons/vue/20/solid';
    import { useEventListener } from '@vueuse/core';

    import { useSidebarStore } from '@/stores/sidebar.store';

    const sidebarStore = useSidebarStore();

    useEventListener(document, 'keydown', event => {
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault();
            sidebarStore.setIsCollapsed();
        }
    });
</script>
