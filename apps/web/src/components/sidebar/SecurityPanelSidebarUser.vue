<template>
    <div v-if="showOnThisPage()" class="mt-2 flex" :class="sidebarStore.isCollapsed ? 'flex-col' : 'flex-row'">
        <div v-for="item in routes" :key="item.name" class="w-full px-2">
            <SidebarMenuItem :item="item" :is-collapsed="sidebarStore.isCollapsed" />
        </div>
    </div>
    <div class="mt-2 flex flex-shrink-0 flex-col border-t border-gray-200 px-2 dark:border-dark-200">
        <div
            class="pt-5r mt-4 flex w-full items-center p-4 pl-7 text-center md:pt-2"
            :class="[sidebarStore.isCollapsed ? 'justify-center' : 'justify-start']"
        >
            <div class="inset-y-0 flex h-full w-[59px] flex-col">
                <div
                    class="mr-3 inline-block h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 statsxxl:h-10 statsxxl:w-10"
                    :class="[sidebarStore.isCollapsed ? 'cursor-pointer' : '']"
                    title="Settings"
                    @click="handleSettings"
                >
                    <img
                        v-if="authStore.user?.profilePicture"
                        :src="authStore.user.profilePicture"
                        referrerpolicy="no-referrer"
                        class="h-full cursor-pointer object-cover object-center"
                    />
                    <svg v-else class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                </div>
            </div>

            <div class="break-all" :class="[sidebarStore.isCollapsed ? 'hidden' : '']">
                <p v-if="showUserName" class="text-sm font-medium text-gray-900 dark:text-dark-300">
                    {{ authStore.user?.email.split('@')[0] }}
                </p>
                <div
                    :class="[showUserName ? 'text-xs' : 'text-sm']"
                    class="cursor-pointer font-medium text-red-500"
                    @click="logout"
                >
                    Sign out
                </div>
            </div>

            <Cog6ToothIcon
                v-if="!sidebarStore.isCollapsed"
                class="group ml-auto h-8 w-8 cursor-pointer rounded-md px-1 py-1 text-gray-700 hover:bg-gray-200 hover:text-primary-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                @click="handleSettings"
            />
        </div>

        <SidebarMenuItem
            v-if="sidebarStore.isCollapsed"
            :item="{ icon: ArrowLeftStartOnRectangleIcon, name: 'Logout', to: '/logout' }"
            :is-collapsed="sidebarStore.isCollapsed"
        >
            <template #icon>
                <ArrowLeftStartOnRectangleIcon
                    class="h-6 w-6 flex-shrink-0 text-red-500 group-hover:text-red-600"
                    aria-hidden="true"
                />
            </template>
        </SidebarMenuItem>
    </div>
</template>
<script setup lang="ts">
    import { ArrowDownTrayIcon, ArrowLeftStartOnRectangleIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
    import { ref } from 'vue';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';

    import { useAuthStore } from '@/stores/auth.store';
    import { useSidebarStore } from '@/stores/sidebar.store';

    import SidebarMenuItem from './SidebarMenuItem.vue';

    const { securityPanel = false } = defineProps<{
        securityPanel?: boolean;
    }>();

    const router = useRouter();

    const routes: { name: string; icon: any; to: string }[] = [];

    routes.push({ name: 'Downloads', icon: ArrowDownTrayIcon, to: `/downloads` });

    const sidebarStore = useSidebarStore();
    const authStore = useAuthStore();
    const showUserName = ref<boolean>(false);
    const windowWidth = ref(window.innerWidth);
    const isMobile = computed(() => windowWidth.value < 768);

    const logout = () => {
        router.push({ name: 'logout' });
    };
    const showOnThisPage = () => {
        return router.currentRoute.value.fullPath.startsWith(`/security-panel`);
    };
    const handleSettings = () => {
        if (isMobile.value) {
            sidebarStore.setIsCollapsed();
        }

        router.push({ name: securityPanel ? 'security-panel-user-settings' : 'user-settings' });
    };
</script>
