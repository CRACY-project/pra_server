<template>
    <div class="relative flex h-full flex-1 flex-col overflow-hidden">
        <img v-if="withPattern" class="absolute bottom-[-200px] right-0 w-auto" :src="multipleLogoBg" alt="figure" />
        <div class="z-[1] flex max-h-[69px]">
            <TopBar>
                <template v-if="$slots.back" #backButton><slot name="back" /></template>
                <template #sectionTitle><slot name="sectionTitle"></slot></template>
                <template #title><slot name="pageTitle"></slot></template>
            </TopBar>
        </div>
        <main class="flex h-full w-full flex-col overflow-auto bg-white px-4 py-4 dark:bg-dark-500 md:px-6">
            <slot name="content"></slot>
            <slot></slot>
        </main>
    </div>
</template>
<script setup lang="ts">
    import multipleLogoBg from '@/assets/final-cracy-no-bg.png';
    import TopBar from '@/components/global/TopBar.vue';
    defineProps<{
        withPattern?: boolean;
    }>();
</script>
