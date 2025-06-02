<template>
    <div
        class="inset-y-0 flex h-full flex-col transition-all"
        :class="[sidebarStore.isCollapsed ? 'w-[4.5rem]' : 'w-full md:w-64']"
    >
        <div
            class="flex flex-grow flex-col overflow-y-auto dark:bg-dark-400 md:pt-5"
            :class="{
                'border-r bg-white': !securityPanel,
                'border-none bg-secondary-500': securityPanel,
            }"
        >
            <div class="flex flex-shrink-0 items-center" :class="sidebarStore.isCollapsed ? 'px-6' : 'px-4'">
                <router-link v-if="company.websiteUrl" :to="{ path: '/' }" class="flex gap-3 focus:outline-none">
                    <img
                        v-if="company.websiteUrl"
                        class="h-6 w-6"
                        :src="getFavIconOfSite(company.websiteUrl)"
                        alt="Favicon"
                        onerror="this.style.display='none'"
                    />
                    <h1
                        v-if="!sidebarStore.isCollapsed"
                        class="truncate text-xl font-medium text-gray-900 dark:text-gray-300"
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
            <div class="fader mt-5 flex flex-grow flex-col overflow-auto">
                <nav
                    class="w-full space-y-2 px-2 align-middle dark:bg-dark-400"
                    :class="{
                        'md:self-center': sidebarStore.isCollapsed,
                        'bg-white': !securityPanel,
                        'bg-secondary-500': securityPanel,
                    }"
                    aria-label="Sidebar"
                >
                    <template v-if="props.routes">
                        <div v-for="item in props.routes" :key="item.name">
                            <SidebarMenuItem
                                :item="item"
                                :is-collapsed="sidebarStore.isCollapsed"
                                :security-panel="props.securityPanel"
                                @click="closeSidebar"
                            />
                        </div>
                    </template>
                    <template v-if="props.sections">
                        <div
                            v-for="section in props.sections"
                            :key="section.name"
                            class="pb-1 dark:text-gray-300 [&:not(:last-child)]:mb-4 [&:not(:last-child)]:border-b"
                        >
                            <div
                                v-show="!sidebarStore.isCollapsed"
                                class="sticky top-0 flex cursor-pointer items-center bg-white pb-3 pl-1 dark:bg-dark-400"
                                @click="toggleSection(section)"
                            >
                                {{ section.name }} {{ section.isBeta ? '(beta)' : '' }}
                                <ChevronDownIcon
                                    v-if="!section.to"
                                    class="ml-2 w-5 transition-all"
                                    :style="{
                                        transform: isSectionVisible(section) ? 'rotate(0deg)' : 'rotate(-90deg)',
                                    }"
                                />
                            </div>
                            <Transition name="slidedown">
                                <div
                                    v-show="sidebarStore.isCollapsed || isSectionVisible(section)"
                                    :class="{ 'pl-2': !sidebarStore.isCollapsed }"
                                >
                                    <SidebarMenuItem
                                        v-for="item in section.routes"
                                        :key="item.name"
                                        :class="[sidebarStore.isCollapsed ? '' : 'space-y-10']"
                                        :item="item"
                                        :is-collapsed="sidebarStore.isCollapsed"
                                        @click="closeSidebar"
                                    />
                                </div>
                            </Transition>
                        </div>
                    </template>
                </nav>
            </div>
            <SecurityPanelSidebarUser :security-panel="securityPanel" />
        </div>
        <SidebarToggleButton :class="[sidebarStore.isCollapsed ? 'left-[60px]' : 'left-[243px]']" />
    </div>
</template>

<script setup lang="ts">
    import { type CompanyDto, PlatformUserRoleValue } from '@cracy/typescript-client';
    import { ArrowPathRoundedSquareIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';

    import type { IRoute, ISection } from '@/components/sidebar';
    import { useAuthStore } from '@/stores/auth.store';
    import { useSidebarStore } from '@/stores/sidebar.store';
    import { getFavIconOfSite } from '@/utils';

    import SecurityPanelSidebarUser from './SecurityPanelSidebarUser.vue';
    import SidebarMenuItem from './SidebarMenuItem.vue';
    import SidebarToggleButton from './SidebarToggleButton.vue';

    const props = withDefaults(
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

    const authStore = useAuthStore();
    const windowWidth = ref(window.innerWidth);
    const isMobile = computed(() => windowWidth.value < 768);

    const router = useRouter();

    const closeSidebar = () => {
        if (isMobile.value) {
            sidebarStore.setIsCollapsed();
        }
    };

    const toggleSection = (section: ISection) => {
        if (section.to) {
            router.push(section.to);
            closeSidebar();
        }
        sidebarStore.toggleSectionVisibility(section);
    };

    const isSectionVisible = (section: ISection) => {
        return !sidebarStore.sectionVisibility[section.name];
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
<style scoped>
    .fader {
        --mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.5) 100%) 100% 50% /
            100% 100% repeat-x;
        -webkit-mask: var(--mask);
        mask: var(--mask);
    }
</style>
