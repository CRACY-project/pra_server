<template>
    <teleport :to="'body'">
        <Transition>
            <div v-if="show" class="absolute left-0 top-0 z-[500] h-screen w-screen bg-gray-500 opacity-75"></div>
        </Transition>
        <Transition name="slide-fade">
            <div
                v-if="show"
                class="absolute left-0 top-0 z-[500] h-screen w-screen drop-shadow-2xl"
                :style="isDark ? `color-scheme: dark;` : ''"
                @click="emit('close')"
            >
                <div
                    class="flex h-screen w-full flex-col bg-white dark:bg-dark-400 md:w-1/2"
                    :class="props.left ? 'mr-auto' : 'ml-auto'"
                    @click.stop
                >
                    <div
                        class="flex max-h-28 items-center justify-between border-b bg-gray-50 px-4 py-5 dark:bg-dark-400 md:px-6"
                        :class="props.left ? 'flex-row-reverse' : ''"
                    >
                        <h2
                            class="relative flex items-center !overflow-visible truncate text-xl font-medium leading-7 tracking-tight text-gray-900 dark:text-gray-300"
                        >
                            <slot name="pageTitle"></slot>
                        </h2>
                        <div class="flex gap-2">
                            <slot name="button"></slot>
                            <IconButton bg-color="bg-transparent" bg-color-hover="bg-transparent" shadow="shadow-none">
                                <XMarkIcon
                                    class="h-7 w-7 font-bold text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300"
                                    aria-hidden="true"
                                    @click="emit('close')"
                                />
                            </IconButton>
                        </div>
                    </div>
                    <slot></slot>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
    import { XMarkIcon } from '@heroicons/vue/24/solid';
    import { useDark } from '@vueuse/core';

    import IconButton from '@/components/global/IconButton.vue';

    interface IProps {
        title?: string;
        left?: boolean;
        buttonLabel?: string;
        show: boolean;
    }
    const props = withDefaults(defineProps<IProps>(), {
        title: 'No title provided',
        left: false,
        buttonLabel: 'Details',
        show: false,
    });
    const emit = defineEmits(['close']);

    const isDark = useDark();
</script>

<style scoped>
    .slide-fade-enter-active {
        transition: all 0.2s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.2s ease-out;
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateX(500px);
        opacity: 0;
    }
</style>
