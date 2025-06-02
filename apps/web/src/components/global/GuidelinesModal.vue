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
        <Dialog as="div" class="fixed inset-0 z-50 overflow-y-auto">
            <div
                :style="isDark ? `color-scheme: dark;` : ''"
                class="grid h-screen place-items-end pb-10 text-center lg:block lg:place-items-center lg:p-0 lg:px-4"
            >
                <DialogOverlay class="fixed inset-0 transition-opacity" aria-hidden="true" />
                <TransitionChild
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
                    enter="duration-100 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-100 ease-in"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <span class="hidden lg:inline-block lg:h-screen lg:align-middle" aria-hidden="true"></span>
                    <div
                        class="inline-block h-screen w-screen transform bg-white text-left shadow-xl transition-all dark:bg-dark-400 lg:h-max lg:w-[62rem] lg:rounded-md lg:align-middle"
                        :class="{ 'pb-16': $slots.actions }"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div v-if="$slots['header']" class="px-4 py-4 sm:px-6">
                            <h3
                                class="text-base font-bold uppercase leading-6 tracking-[.15em] text-gray-900 dark:text-gray-300"
                            >
                                <slot name="header" />
                            </h3>
                        </div>
                        <div
                            v-if="$slots.default"
                            class="flex h-[calc(100%-65px)] flex-col overflow-hidden rounded-b-md bg-white dark:bg-dark-400"
                        >
                            <slot />
                        </div>
                        <div
                            v-if="$slots.content && $slots.actions"
                            class="flex h-[calc(100%-65px)] flex-col overflow-hidden"
                        >
                            <div class="overflow-auto rounded-b-md bg-white dark:bg-dark-400">
                                <slot name="content" />
                            </div>
                            <div class="flex items-center justify-center">
                                <slot name="actions" />
                            </div>
                        </div>
                    </div>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
    import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue';
    import { useDark } from '@vueuse/core';
    import { onBeforeMount, onBeforeUnmount } from 'vue';
    interface IProps {
        show: boolean;
    }

    const isDark = useDark();
    withDefaults(defineProps<IProps>(), {
        show: false,
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
