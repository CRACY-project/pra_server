<template>
    <TransitionRoot as="template" :show="showAlert">
        <Dialog as="div" class="fixed inset-0 z-50 overflow-y-auto" @close="close">
            <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center md:block md:p-0">
                <TransitionChild
                    as="template"
                    enter="ease-out duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <span class="hidden md:inline-block md:h-screen md:align-middle" aria-hidden="true">&#8203;</span>
                <TransitionChild
                    as="template"
                    enter="ease-out duration-300"
                    enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                    enter-to="opacity-100 translate-y-0 md:scale-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100 translate-y-0 md:scale-100"
                    leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                >
                    <div
                        class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all md:my-8 md:w-full md:max-w-lg md:align-middle"
                        :class="darkModeSupport ? 'dark:bg-dark-500' : ''"
                    >
                        <div
                            class="bg-white px-4 pb-4 pt-5 md:p-6 md:pb-4"
                            :class="darkModeSupport ? 'dark:bg-dark-500' : ''"
                        >
                            <div class="md:flex md:items-start">
                                <div
                                    :class="{
                                        'bg-red-100 dark:bg-red-600': type == 'warning',
                                        'bg-amber-100 dark:bg-amber-600': type == 'caution',
                                        'bg-green-100 dark:bg-green-600': type == 'success',
                                        'bg-primary-500 dark:bg-tertiary-700': type == 'info',
                                    }"
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full md:mx-0 md:h-10 md:w-10"
                                >
                                    <exclamation-triangle-icon
                                        v-if="type == 'warning'"
                                        class="h-6 w-6 text-red-600"
                                        :class="darkModeSupport ? 'dark:text-gray-300' : 'text-white'"
                                        aria-hidden="true"
                                    />
                                    <exclamation-circle-icon
                                        v-if="type == 'caution'"
                                        class="h-6 w-6 text-amber-600"
                                        :class="darkModeSupport ? 'dark:text-gray-300' : 'text-white'"
                                        aria-hidden="true"
                                    />
                                    <information-circle-icon
                                        v-else-if="type == 'info'"
                                        class="h-6 w-6 text-white"
                                        :class="darkModeSupport ? 'dark:text-gray-300' : 'text-white'"
                                        aria-hidden="true"
                                    />
                                    <check-circle-icon
                                        v-else-if="type == 'success'"
                                        class="h-6 w-6 text-green-600"
                                        :class="darkModeSupport ? 'dark:text-gray-300' : 'text-white'"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div class="mt-3 truncate text-center md:ml-4 md:mt-0 md:text-left">
                                    <DialogTitle
                                        as="h3"
                                        class="mb-3 truncate text-lg font-medium leading-6 text-gray-900"
                                        :class="darkModeSupport ? 'dark:text-gray-300' : ''"
                                    >
                                        <slot name="title" />
                                    </DialogTitle>
                                    <div
                                        class="whitespace-normal break-words text-sm text-gray-500"
                                        :class="darkModeSupport ? 'dark:text-gray-100' : ''"
                                    >
                                        <slot name="content" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex flex-col gap-x-2 space-y-3 bg-gray-50 px-4 py-3 text-center md:flex-row-reverse md:space-y-0 md:px-6"
                            :class="darkModeSupport ? 'dark:border-t  dark:bg-dark-500' : ''"
                        >
                            <slot name="actions" />
                        </div>
                    </div>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
    import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
    import {
        CheckCircleIcon,
        ExclamationCircleIcon,
        ExclamationTriangleIcon,
        InformationCircleIcon,
    } from '@heroicons/vue/24/outline';
    import { onBeforeMount, onBeforeUnmount } from 'vue';

    import { AlertType } from './Alert';

    interface IProps {
        showAlert: boolean;
        type?: AlertType;
        confirmAction?: () => void;
        cancelAction?: () => void;
        darkModeSupport?: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        showAlert: false,
        type: AlertType.WARNING,
        confirmAction: () => {},
        cancelAction: () => {},
        darkModeSupport: true,
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
