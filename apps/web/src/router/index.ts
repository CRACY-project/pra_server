import { CompanyType, PlatformUserRoleValue, UserCompanyRoleValue } from '@cracy/typescript-client';
import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/auth.store';

import { companyExistsGuard, companyTypeAllowed, multipleGuards, userRoleAllowed } from './guards';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: () => {
                const authStore = useAuthStore();
                const user = authStore.user;
                if (!user) {
                    return { path: '/login' };
                }
                return { name: 'dashboard', params: { companyName: user.company.name } };
            },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/Login.vue'),
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('@/views/Logout.vue'),
        },
        {
            path: '/:companyName',
            beforeEnter: companyExistsGuard,
            component: () => import('@/layouts/CompanyLayout/CompanyLayoutRouterComponent.vue'),
            props: route => ({ companyName: route.params.companyName }),
            redirect: { name: 'dashboard' },
            children: [
                {
                    path: '/:companyName/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/dashboards/GenericDashboard.vue'),
                    meta: {
                        subHeader: true,
                        requiresAuth: true,
                    },
                    props: route => ({ companyName: route.params.companyName }),
                },
                {
                    path: '/:companyName/customers',
                    name: 'customers',
                    component: () => import('@/views/company/customers/Customers.vue'),
                    beforeEnter: multipleGuards([companyTypeAllowed, userRoleAllowed]),
                    meta: {
                        requiresAuth: true,
                        platformRoles: [PlatformUserRoleValue.SUPERADMIN],
                        companyTypes: [CompanyType.SUPERCOMPANY],
                    },
                    props: route => ({ companyName: route.params.companyName }),
                },
                {
                    path: '/:companyName/users',
                    name: 'users',
                    component: () => import('@/views/users/Users.vue'),
                    beforeEnter: multipleGuards([companyTypeAllowed, userRoleAllowed]),
                    meta: {
                        requiresAuth: true,
                    },
                    props: route => ({ companyName: route.params.companyName }),
                },
                {
                    path: '/:companyName/PDEs',
                    name: 'PDEs',
                    component: () => import('@/views/company/pde/PDE.vue'),
                    beforeEnter: multipleGuards([companyTypeAllowed, userRoleAllowed]),
                    meta: {
                        requiresAuth: true,
                    },
                    props: route => ({ companyName: route.params.companyName }),
                },
            ],
        },
    ],
});

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();

    // Fixes Microsoft login https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/5091
    if (from.hash.includes('code=') || to.hash.includes('code=')) {
        return false;
    }

    // instead of having to check every route record with
    // to.matched.some(record => record.meta.requiresAuth)
    if (to.meta.requiresAuth && !authStore.user) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        return {
            path: '/login',
            // save the location we were at to come back later
            query: { redirect: to.fullPath },
        };
    }

    if (!authStore.user) {
        return;
    }

    if (to.fullPath === '/' && authStore.user && authStore.user.platformRole === PlatformUserRoleValue.USER) {
        return { path: `/${authStore.user.company.name}/dashboard` };
    }

    const companyRoles = to.meta.companyRoles as UserCompanyRoleValue[];
    if (companyRoles) {
        if (authStore.user.platformRole === PlatformUserRoleValue.SUPERADMIN) {
            return;
        }

        const userRolesForThisCompany = authStore.user.userRoles; // todo: implement filter for only roles for current company
        if (
            !userRolesForThisCompany ||
            !userRolesForThisCompany?.some(userRole => {
                return companyRoles.includes(userRole.value);
            })
        ) {
            return {
                path: '/404',
            };
        }
    }

    const platformRoles = to.meta.platformRoles as PlatformUserRoleValue[];

    if (platformRoles && authStore.user && !platformRoles.includes(authStore.user.platformRole)) {
        return {
            path: '/404',
        };
    }
});

export default router;
