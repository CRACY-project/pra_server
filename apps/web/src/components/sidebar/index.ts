import {
    type CompanyDto,
    CompanyType,
    PlatformUserRoleValue,
    UserCompanyRoleValue,
    type UserDto,
} from '@cracy/typescript-client';
import type { Component } from 'vue';

export interface IRoute {
    name: string;
    icon: Component;
    to: string;
    allowedUserCompanyRoles?: UserCompanyRoleValue[];
    allowedPlatformUserRoles?: PlatformUserRoleValue[];
    companyTypeRequirements?: CompanyType[];
    featureName?: string;
}

export interface ISection {
    name: string;
    routes: IRoute[];
    icon?: Component;
    to?: string;
    isBeta?: boolean;
}

export const showRouteForCompany = (route: IRoute, company: CompanyDto): boolean => {
    if (!route.companyTypeRequirements) {
        return true;
    }
    return route.companyTypeRequirements.includes(company.companyType);
};

export const showRouteForUser = (route: IRoute, user: UserDto, company: CompanyDto): boolean => {
    if (user.platformRole === PlatformUserRoleValue.SUPERADMIN) return true;

    let correctPlatformRoles = !route.allowedPlatformUserRoles;
    if (route.allowedPlatformUserRoles)
        correctPlatformRoles = route.allowedPlatformUserRoles?.includes(user.platformRole);

    let correctCompanyRoles = !route.allowedUserCompanyRoles;
    if (route.allowedUserCompanyRoles) {
        const userRolesForThisCompany = user.userRoles?.filter(userRole => company.id === userRole.companyId);
        correctCompanyRoles =
            userRolesForThisCompany?.some(userRole => {
                return route.allowedUserCompanyRoles?.includes(userRole.value);
            }) || false;
    }

    return correctPlatformRoles && correctCompanyRoles;
};
