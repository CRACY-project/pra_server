<template>
    <div class="z-[2] flex h-[69px] w-full items-center justify-between border-b dark:bg-dark-500 md:px-6">
        <div class="mr-2 flex h-full md:hidden"><SidebarHamburger /></div>
        <div class="flex h-full min-w-0 flex-1 items-center">
            <div v-if="$slots.backButton" class="h-full py-4">
                <slot name="backButton"></slot>
            </div>
            <div :class="[$slots.backButton ? 'ml-4' : 'ml-0', $slots.sectionTitle ? 'space-y-1' : 'space-y-0']">
                <h3
                    class="!overflow-visible truncate text-sm font-bold uppercase tracking-[.15em] text-tertiary-500 dark:text-tertiary-700"
                >
                    <slot name="sectionTitle"></slot>
                </h3>
                <h2
                    class="relative mt-0 flex items-center !overflow-visible truncate text-lg font-bold text-primary-500 dark:text-gray-300"
                >
                    <slot name="title"></slot>
                </h2>
            </div>
            <div
                v-if="$slots.detailParameters"
                class="mt-0 flex flex-col flex-wrap space-y-1 sm:flex-row sm:space-x-6 sm:space-y-0"
            >
                <slot name="detailParameters"></slot>
            </div>
        </div>
        <div v-if="$slots.actions" class="flex items-center">
            <slot name="actions"></slot>
        </div>
        <CracyLogo />
    </div>
</template>

<script lang="ts" setup>
    import { useSlots } from 'vue';
    useSlots();
    import CracyLogo from '@/components/CracyLogo.vue';
    import SidebarHamburger from '@/components/sidebar/SidebarHamburger.vue';
</script>

<style scoped></style>
