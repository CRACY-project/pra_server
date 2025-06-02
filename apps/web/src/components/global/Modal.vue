<template>
    <TransitionRoot
        :show="show"
        as="template"
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
    >
        <Dialog
            as="div"
            class="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center"
            :style="isDark ? `color-scheme: dark;` : ''"
        >
            <TransitionChild
                as="template"
                enter="duration-200 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-100 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="close()">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
            </TransitionChild>
            <TransitionChild
                as="template"
                enter="duration-100 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-100 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
                <div
                    class="flex h-full w-full transform flex-col bg-white text-left shadow-xl transition-all dark:bg-dark-400 md:max-h-[90vh] md:max-w-[40rem] md:rounded-md"
                    role="dialog"
                    :class="[
                        fullWidth ? 'md:max-w-full' : 'md:max-w-[40rem]',
                        fullHeight ? 'md:max-h-full' : 'md:h-min',
                    ]"
                    aria-modal="true"
                >
                    <div
                        v-if="$slots['header']"
                        class="border-b px-4 py-4 sm:px-6"
                        :class="[
                            securityPanel
                                ? 'rounded-t-md border-tertiary-500 bg-secondary-500 dark:border-dark-200 dark:bg-inherit'
                                : '',
                        ]"
                    >
                        <h3
                            class="text-base font-bold uppercase leading-6 tracking-[.15em] text-gray-900 dark:text-gray-300"
                        >
                            <slot name="header" />
                        </h3>
                    </div>
                    <div v-if="$slots.default" class="flex flex-col overflow-auto">
                        <slot />
                    </div>
                    <slot name="content" />
                    <div
                        v-if="$slots.actions"
                        class="mt-auto flex flex-row-reverse rounded-b-md border-t bg-gray-50 px-4 py-3 dark:bg-dark-400 sm:px-6"
                    >
                        <slot name="actions" />
                    </div>
                </div>
            </TransitionChild>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
    import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue';
    import { useDark } from '@vueuse/core';
    import { onBeforeMount, onBeforeUnmount } from 'vue';
    interface IProps {
        show: boolean;
        securityPanel?: boolean;
        fullWidth?: boolean;
        fullHeight?: boolean;
    }

    const isDark = useDark();
    withDefaults(defineProps<IProps>(), {
        show: false,
        fullWidth: false,
        fullHeight: false,
    });
    const emit = defineEmits(['close']);
    let escListener: any = null;
    const close = () => {
        emit('close');
    };
    onBeforeMount(() => {
        escListener = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') {
                return;
            }
            emit('close');
        };
        document.addEventListener('keyup', escListener);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('keyup', escListener);
    });
</script>

<style scoped></style>
