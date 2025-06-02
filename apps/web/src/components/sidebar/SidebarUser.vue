<template>
    <div v-if="showOnThisPage()" class="mt-2">
        <PopoverTooltip>
            <template #trigger>
                <div
                    class="group flex w-full cursor-pointer justify-center border-t py-4 hover:bg-secondary-300 dark:hover:bg-dark-600"
                    @click="userSettingsModal.open()"
                >
                    <Cog6ToothIcon
                        class="h-6 w-6 flex-shrink-0 text-gray-700 group-hover:text-primary-400 dark:text-gray-300 dark:group-hover:text-gray-100"
                        aria-hidden="true"
                    />
                </div>
            </template>
            <template #content> Settings </template>
        </PopoverTooltip>
        <PopoverTooltip>
            <template #trigger>
                <div
                    class="group flex w-full cursor-pointer justify-center border-t py-4 hover:bg-secondary-300 dark:hover:bg-dark-600"
                    @click="logout"
                >
                    <ArrowLeftStartOnRectangleIcon
                        class="h-6 w-6 flex-shrink-0 text-red-500 group-hover:text-red-600"
                        aria-hidden="true"
                    />
                </div>
            </template>
            <template #content> Logout </template>
        </PopoverTooltip>
    </div>

    <Modal :show="userSettingsModal.isOpen" @close="userSettingsModal.close()">
        <template #header> User Settings </template>
        <template #content>
            <div class="space-y-3 px-4 py-4 sm:px-6">
                <UserSettings />
            </div>
        </template>
        <template #actions>
            <Button
                bg-color="bg-white dark:bg-dark-300"
                text-color="text-gray-900 dark:text-gray-300"
                bg-color-hover="hover:bg-gray-50 dark:hover:bg-dark-400"
                class="mr-2 h-min"
                @click="userSettingsModal.close()"
            >
                Close
            </Button>
        </template>
    </Modal>
</template>
<script setup lang="ts">
    import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
    import { useRoute, useRouter } from 'vue-router';

    import Button from '@/components/global/Button.vue';
    import Modal from '@/components/global/Modal.vue';
    import PopoverTooltip from '@/components/global/PopoverTooltip.vue';
    import UserSettings from '@/components/UserSettings.vue';
    import { useModal } from '@/composables/modal';

    const userSettingsModal = useModal();
    const router = useRouter();

    const logout = () => {
        router.push({ name: 'logout' });
    };
    const route = useRoute();
    const showOnThisPage = () => {
        return router.currentRoute.value.fullPath.startsWith(`/${route.params.companyName}`);
    };
</script>
