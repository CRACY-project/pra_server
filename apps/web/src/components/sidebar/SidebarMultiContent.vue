<template>
    <div
        v-if="props.sections"
        class="flex h-full flex-col transition-all dark:bg-dark-400"
        :class="[sidebarStore.isCollapsed || isRoutesEmpty ? 'w-[59px]' : 'w-[21rem]']"
    >
        <div
            class="flex items-center border-b border-r px-3.5 py-5"
            :class="[sidebarStore.isCollapsed || isRoutesEmpty ? 'flex-col gap-3 space-x-0' : 'space-x-2']"
        >
            <router-link
                :to="{ path: `/${company.name}` }"
                class="flex gap-3 truncate"
                :class="{ 'mr-2': !sidebarStore.isCollapsed && !isRoutesEmpty }"
            >
                <img class="h-7 w-7" :src="CracyLogoSmall" alt="Favicon" />
                <h1
                    v-if="!sidebarStore.isCollapsed && !isRoutesEmpty"
                    class="truncate text-xl font-medium text-primary-500 dark:text-white"
                >
                    {{ company.displayName }}
                </h1>
            </router-link>
            <template v-if="showCustomerSwitch">
                <router-link title="Manage other company" :to="{ path: '/' }" class="ml-auto focus:outline-none">
                    <ArrowPathRoundedSquareIcon class="w-7" />
                </router-link>
            </template>
        </div>
        <div
            class="flex min-h-0 flex-1 border-r"
            :class="[sidebarStore.isCollapsed || isRoutesEmpty ? 'w-[59px]' : 'w-[21rem]']"
        >
            <div
                class="flex h-full w-[59px] flex-col"
                :class="{
                    'border-r': !sidebarStore.isCollapsed && !isRoutesEmpty,
                }"
            >
                <div class="flex flex-grow flex-col overflow-y-auto">
                    <template v-if="props.sections">
                        <div v-for="(item, index) in props.sections" :key="item.name">
                            <SidebarMenuSectionItem
                                class="border-b"
                                :item="item"
                                :section-index="index"
                                @item-click="setSelectedSection(item.name)"
                            />
                        </div>
                    </template>
                </div>
                <SidebarUser />
            </div>
            <template v-if="!sidebarStore.isCollapsed && !isRoutesEmpty">
                <div class="flex h-full w-[17.5rem] flex-col transition-all">
                    <div class="flex flex-grow flex-col overflow-y-auto bg-white dark:bg-dark-400">
                        <h3
                            class="truncate px-4 pb-2 pt-4 text-sm font-bold uppercase tracking-[.15em] text-dark-950 dark:text-tertiary-700"
                        >
                            {{ selectedSection?.name }}
                            <Chip
                                v-if="isBetaSection"
                                custom-style="bg-gray-200 text-xs text-gray-700 font-normal uppercase !px-2 dark:bg-tertiary-700 dark:text-gray-300 tracking-[.1em]"
                            >
                                Beta
                            </Chip>
                        </h3>
                        <div class="flex flex-grow flex-col overflow-auto">
                            <nav
                                class="w-full bg-white px-2 align-middle dark:bg-dark-400"
                                :class="{
                                    'md:self-center': sidebarStore.isCollapsed,
                                }"
                                aria-label="Sidebar"
                            >
                                <div v-for="item in selectedSection?.routes" :key="item.name">
                                    <SidebarMenuItem :item="item" :is-collapsed="sidebarStore.isCollapsed" />
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <SidebarToggleButton v-if="!isRoutesEmpty" :class="[sidebarStore.isCollapsed ? 'left-[46px]' : 'left-[322px]']" />
</template>

<script setup lang="ts">
    import { type CompanyDto, PlatformUserRoleValue } from '@cracy/typescript-client';
    import { ArrowPathRoundedSquareIcon } from '@heroicons/vue/24/outline';
    import { computed } from 'vue';

    import CracyLogoSmall from '@/assets/cracy-small.svg';
    import Chip from '@/components/global/Chip.vue';
    import type { ISection } from '@/components/sidebar';
    import SidebarMenuSectionItem from '@/components/sidebar/SidebarMenuSectionItem.vue';
    import { useAuthStore } from '@/stores/auth.store';
    import { useSidebarStore } from '@/stores/sidebar.store';

    import SidebarMenuItem from './SidebarMenuItem.vue';
    import SidebarToggleButton from './SidebarToggleButton.vue';
    import SidebarUser from './SidebarUser.vue';

    const props = withDefaults(
        defineProps<{
            sections?: ISection[];
            company: CompanyDto;
            securityPanel?: boolean;
        }>(),
        {
            sections: undefined,
            securityPanel: false,
        }
    );
    const sidebarStore = useSidebarStore();

    const authStore = useAuthStore();

    const isRoutesEmpty = computed(() => {
        const section = props.sections?.find(item => item.name === sidebarStore?.selectedSection);
        return !section?.routes?.length;
    });

    const isBetaSection = computed(() => {
        return selectedSection.value?.isBeta ?? false;
    });

    const selectedSection = computed(() => {
        const section = sidebarStore.selectedSection;

        return props.sections?.find(item => item.name === section);
    });

    const setSelectedSection = (section: string) => {
        sidebarStore.setSelectedSection(section);

        const { isCollapsed, prevSelectedSection } = sidebarStore;

        if (
            (section === 'Dashboard' && !isCollapsed) ||
            (section === 'Settings' && !isCollapsed) ||
            (section !== 'Dashboard' &&
                ((prevSelectedSection !== section && isCollapsed) || prevSelectedSection === section))
        ) {
            sidebarStore.setIsCollapsed();
        }
        sidebarStore.setPrevSelectedSection(section);
    };

    const showCustomerSwitch = computed(() => {
        if (!authStore.user) {
            return false;
        }
        if (authStore.user.platformRole !== PlatformUserRoleValue.SUPERADMIN) {
            return false;
        }

        if (authStore.user.companyId === props.company.id) {
            return false;
        }

        return true;
    });
</script>
<style scoped></style>
