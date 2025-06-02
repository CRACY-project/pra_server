<template>
    <Sidebar v-if="company" :sections="sections" :company="company"> </Sidebar>
</template>

<script setup lang="ts">
    import {
        type AuthUser,
        type CompanyDto,
        CompanyType,
        PlatformUserRoleValue,
        UserCompanyRoleValue,
    } from '@cracy/typescript-client';
    import {
        BuildingOffice2Icon,
        BuildingOfficeIcon,
        RectangleGroupIcon,
        ServerIcon,
        UserIcon,
    } from '@heroicons/vue/24/outline';
    import { ref, watch } from 'vue';
    import { onBeforeMount } from 'vue';
    import { useRouter } from 'vue-router';

    import { type IRoute, type ISection, showRouteForCompany, showRouteForUser } from '@/components/sidebar';
    import Sidebar from '@/components/sidebar/Sidebar.vue';
    import { useCompanyService } from '@/services/company.service';
    import { useAuthStore } from '@/stores/auth.store';
    import { useSidebarStore } from '@/stores/sidebar.store';
    import { CustomException } from '@/types/exceptions';

    const router = useRouter();
    const sidebarStore = useSidebarStore();
    const sections = ref<ISection[]>([]);

    const company = ref<CompanyDto>();
    const props = defineProps<{ companyName: string }>();

    watch(
        () => sidebarStore.isCollapsed,
        () => {
            sidebarStore.showDropdown = false;
        }
    );
    const generateRoutes = (company: CompanyDto, user: AuthUser): ISection[] => {
        if (!user) return [];
        const allSections = [];
        const dashboardSection: ISection = {
            name: 'Dashboard',
            icon: RectangleGroupIcon,
            routes: [],
            to: `/${company.name}/dashboard`,
        };
        allSections.push(dashboardSection);

        const generalSection: ISection = {
            name: 'Company',
            icon: BuildingOffice2Icon,
            routes: [],
        };
        allSections.push(generalSection);
        for (const r of generalRoutes) {
            if (showRouteForCompany(r, company) && showRouteForUser(r, user, company)) {
                generalSection.routes.push(r);
            }
        }

        return allSections;
    };

    onBeforeMount(async () => {
        const authStore = useAuthStore();
        await authStore.refreshUserInfo();
        const user = authStore.user;
        if (!user) return;

        const { getCompany } = useCompanyService();
        if (typeof props.companyName !== 'string') {
            return;
        }
        try {
            company.value = await getCompany({ companyName: props.companyName });
            sections.value = generateRoutes(company.value, user);
        } catch (error) {
            console.warn(error);
            const msg = error as CustomException;
            if (msg.statusCode === 404) {
                router.push({ name: '404' });
            }
        }
    });

    const generalRoutes: IRoute[] = [
        {
            name: 'Customers',
            icon: BuildingOfficeIcon,
            to: `/${props.companyName}/customers`,
            companyTypeRequirements: [CompanyType.SUPERCOMPANY],
            allowedPlatformUserRoles: [PlatformUserRoleValue.SUPERADMIN],
        },
        {
            name: 'Users',
            icon: UserIcon,
            to: `/${props.companyName}/users`,
            allowedUserCompanyRoles: [UserCompanyRoleValue.COMPANYADMIN, UserCompanyRoleValue.SECURITYCONSULTANT],
        },
        {
            name: 'PDEs',
            icon: ServerIcon,
            to: `/${props.companyName}/PDEs`,
            allowedUserCompanyRoles: [UserCompanyRoleValue.COMPANYADMIN, UserCompanyRoleValue.SECURITYCONSULTANT],
        },
    ];
</script>
