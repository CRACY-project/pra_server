<template>
    <TransitionRoot as="template" :show="!sidebarStore.isCollapsed">
        <Dialog as="div" class="relative z-40" @close="sidebarStore.setIsCollapsed()">
            <TransitionChild
                as="template"
                enter="transition-opacity ease-linear duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="bg-opacity-75 fixed inset-0 bg-gray-600" />
            </TransitionChild>

            <div class="fixed inset-0 z-40 flex h-full">
                <TransitionChild
                    as="template"
                    enter="transition ease-in-out duration-300 transform"
                    enter-from="-translate-x-full"
                    enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leave-from="translate-x-0"
                    leave-to="-translate-x-full"
                >
                    <DialogPanel
                        class="dark:bg-dark-400 relative flex h-full w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4"
                    >
                        <TransitionChild
                            as="template"
                            enter="ease-in-out duration-300"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="ease-in-out duration-300"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <div class="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    type="button"
                                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none"
                                    @click="sidebarStore.setIsCollapsed()"
                                >
                                    <span class="sr-only">Close sidebar</span>
                                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <SidebarContent
                            :routes="routes"
                            :sections="sections"
                            :company="company"
                            :security-panel="securityPanel"
                        />
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script setup lang="ts">
    import { type CompanyDto } from '@cracy/typescript-client';
    import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
    import { XMarkIcon } from '@heroicons/vue/24/outline';

    import type { IRoute, ISection } from '@/components/sidebar';
    import { useSidebarStore } from '@/stores/sidebar.store';

    import SidebarContent from './SidebarContent.vue';
    withDefaults(
        defineProps<{
            routes?: IRoute[];
            sections?: ISection[];
            company: CompanyDto;
            securityPanel?: boolean;
        }>(),
        {
            routes: undefined,
            sections: undefined,
            securityPanel: false,
        }
    );
    const sidebarStore = useSidebarStore();
</script>
