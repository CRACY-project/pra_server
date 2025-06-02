import { PlatformUserRoleValue, UserCompanyRoleValue } from '@cracy/typescript-client';
import type { NavigationGuard, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { useCompanyService } from '@/services/company.service';
import { useAuthStore } from '@/stores/auth.store';

export const companyExistsGuard: NavigationGuard = async (to, _from, next) => {
    const { getCompany } = useCompanyService();
    const companyName = to.params.companyName;

    try {
        await getCompany({ companyName: companyName.toString() });

        next();
    } catch (error: any) {
        // If company does not exist, redirect to the 404 company page
        if (error?.message?.statusCode === 404) {
            next({ name: 'companyNotFound' });
        } else if (error.statusCode === 502 || error.statusCode === 500) {
            next({ path: '/502' });
        } else {
            next({ path: '/' });
        }
    }
};

export function multipleGuards(guards: NavigationGuard[]) {
    return (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const runGuard = (index: number) => {
            if (index >= guards.length) {
                next();
                return;
            }
            const guard = guards[index];
            guard(to, from, (nextArg?: any) => {
                if (nextArg === false || nextArg instanceof Error) {
                    next(nextArg);
                } else if (typeof nextArg === 'string' || (nextArg && typeof nextArg === 'object')) {
                    next(nextArg);
                } else {
                    runGuard(index + 1);
                }
            });
        };
        runGuard(0);
    };
}

export const companyTypeAllowed: NavigationGuard = async (to, _from, next) => {
    if (!to.meta.companyTypes) {
        next();
        return;
    }

    const { getCompany } = useCompanyService();
    const companyName = to.params.companyName;

    try {
        const company = await getCompany({ companyName: companyName.toString() });
        if ((to.meta.companyTypes as string[]).includes(company.companyType)) {
            next();
        } else {
            next({ path: '/404' });
        }
    } catch (error: any) {
        // If company does not exist, redirect to the 404 company page
        if (error?.message?.statusCode === 404) {
            next({ name: 'companyNotFound' });
        } else if (error.statusCode === 502 || error.statusCode === 500) {
            next({ path: '/502' });
        } else {
            next({ path: '/' });
        }
    }
};

export const userRoleAllowed: NavigationGuard = async (to, _from, next) => {
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) {
        next({ path: '/login' });
        return;
    }

    if (user.platformRole === PlatformUserRoleValue.SUPERADMIN) {
        next();
        return;
    }

    const routePlatformRoles = to.meta.platformRoles ? (to.meta.platformRoles as PlatformUserRoleValue[]) : [];
    if (routePlatformRoles.length && !routePlatformRoles.includes(user.platformRole)) {
        next({ path: '/404' });
        return;
    }

    const { getCompany } = useCompanyService();
    const routeCompanyRoles = to.meta.companyRoles ? (to.meta.companyRoles as UserCompanyRoleValue[]) : [];
    const companyName = to.params.companyName;
    const company = await getCompany({ companyName: companyName.toString() });
    const userRolesForThisCompany = user.userRoles?.filter(userRole => company.id === userRole.companyId);

    if (
        routeCompanyRoles.length &&
        !userRolesForThisCompany?.some(userRole => routeCompanyRoles.includes(userRole.value))
    ) {
        next({ path: '/404' });
        return;
    }

    next();
};
