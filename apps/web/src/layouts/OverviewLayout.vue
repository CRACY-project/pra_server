<template>
    <div class="relative flex h-screen bg-white dark:bg-dark-500">
        <!-- <Sidebar :routes="routes" /> -->
        <div class="flex h-full flex-1 flex-col overflow-hidden">
            <div class="flex max-h-20 border-b bg-white dark:bg-dark-700">
                <TopBar>
                    <template v-if="$slots.back" #backButton><slot name="back" /></template>
                    <template #sectionTitle><slot name="sectionTitle"></slot></template>
                    <template #title><slot name="title"></slot></template>
                </TopBar>
            </div>
            <main
                class="flex h-full w-full flex-col overflow-auto bg-white dark:bg-dark-500"
                :class="props.inset ? 'px-4 py-4' : ''"
            >
                <slot name="content"></slot>
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { UserCompanyRoleValue } from '@cracy/typescript-client';
    import { ArrowDownTrayIcon, BuildingLibraryIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';
    import { watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import TopBar from '@/components/global/TopBar.vue';
    import { useAuthStore } from '@/stores/auth.store';
    import { useSidebarStore } from '@/stores/sidebar.store';

    const sidebarStore = useSidebarStore();
    const user = useAuthStore().user;
    const userCompanyRoles: UserCompanyRoleValue[] = user?.userRoles?.map(role => role.value) || [];

    watch(
        () => sidebarStore.isCollapsed,
        () => {
            sidebarStore.showDropdown = false;
        }
    );

    interface Props {
        inset?: boolean;
    }
    const props = withDefaults(defineProps<Props>(), {
        inset: true,
    });

    interface IRoute {
        name: string;
        icon: any;
        to: string;
        show: boolean;
    }

    const routes: IRoute[] = [];

    if (user && userCompanyRoles.includes(UserCompanyRoleValue.COMPANYADMIN)) {
        const page = 'dashboard';
        routes.push({
            name: user.company.displayName,
            icon: BuildingLibraryIcon,
            to: `${user.company.name}/${page}`,
            show: true,
        });
    }

    const router = useRouter();
    const route = useRoute();
    const showOnThisPage = () => {
        return router.currentRoute.value.fullPath.startsWith(`/${route.params.companyName}`);
    };

    routes.push({ name: 'Documentation', icon: DocumentTextIcon, to: `/documentation`, show: showOnThisPage() });
    routes.push({ name: 'Downloads', icon: ArrowDownTrayIcon, to: `/downloads`, show: showOnThisPage() });
</script>

<style scoped></style>
