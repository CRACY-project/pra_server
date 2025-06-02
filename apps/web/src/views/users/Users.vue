<template>
    <CompanyLayout>
        <template #sectionTitle>Company</template>
        <template #pageTitle>
            Users
            <Tooltip class="ml-1">
                <template #content>
                    A user is a user on the platform. They can have roles and be linked to properties of different
                    products
                </template>
            </Tooltip>
        </template>
        <CrudTable
            ref="crudTable"
            :headers="tableHeaders"
            :entity-provider="userProvider"
            :entity-options="entityOptions"
            :show-reload-button="true"
            :search-options="searchOptions"
            empty-message="No users found"
            :backend-pagination-sorting="true"
            :pagination="{ itemsPerPage: 25 }"
        >
            <template #createFields="{ formData }">
                <UserCreateUpdateFields :form-data="formData" />
            </template>
            <template #updateFields="{ formData, entity }">
                <UserCreateUpdateFields :form-data="formData" :user="entity" />
            </template>
        </CrudTable>
    </CompanyLayout>
</template>
<script setup lang="ts">
    import {
        type CreateUserDto,
        type GetUsersV1Request,
        PlatformUserRoleValue,
        type UpdateUserDto,
        UserCompanyRoleValue,
        type UserDto,
    } from '@cracy/typescript-client';
    import { notify } from '@kyvg/vue3-notification';
    import { type ComputedRef, ref } from 'vue';
    import { computed } from 'vue';

    import CrudTable from '@/components/crud/CrudTable.vue';
    import Tooltip from '@/components/global/Tooltip.vue';
    import CompanyLayout from '@/layouts/CompanyLayout/CompanyLayout.vue';
    import { useUserService } from '@/services/user.service';
    import { useAuthStore } from '@/stores/auth.store';
    import { type IEntityOptions, type IEntityProvider, type IHeader } from '@/types/crud-components';

    import { type CrudFormUser } from './crud.types';
    import { userRoles } from './roles';
    import { getRolesStringForUser } from './user.functions';
    import UserCreateUpdateFields from './UserCreateUpdateFields.vue';

    const searchOptions = ref({
        enableSearch: true,
        options: ['all'],
    });
    const crudTable = ref<typeof CrudTable>();

    const props = defineProps<{ companyName: string }>();
    const currentUser = useAuthStore().user;
    const tableHeaders: IHeader<any>[] = [
        {
            key: 'email',
            displayName: 'email',
            enableSorting: true,
            copyable: true,
        },
        {
            key: 'userRoles',
            displayName: 'Role',
            formatter: getRolesStringForUser,
        },
        {
            key: 'platformRole',
            displayName: 'Platform Role',
            formatter: (row: UserDto) => {
                return userRoles[row.platformRole];
            },
            enableSorting: true,
        },
    ];

    const userFilterFields = [
        {
            label: 'Email',
            value: 'email',
            type: 'string',
        },
        {
            label: 'Role',
            value: 'role',
            type: 'enum',
            path: 'userRoles.some',
            options: [
                {
                    label: 'User',
                    value: 'USER',
                },
                {
                    label: 'Company Admin',
                    value: 'COMPANYADMIN',
                },
            ],
        },
        {
            label: 'Platform Role',
            value: 'platformRole',
            type: 'enum',
            options: [
                {
                    label: 'User',
                    value: 'USER',
                },
                {
                    label: 'Super Admin',
                    value: 'SUPERADMIN',
                },
            ],
        },
        {
            label: 'Enabled',
            value: 'disabled',
            type: 'boolean',
            options: [
                {
                    label: 'True',
                    value: 'true',
                },
                {
                    label: 'False',
                    value: 'false',
                },
            ],
        },
    ];

    const updateUser = async (user: CrudFormUser, oldUser: UserDto) => {
        const platformRole: PlatformUserRoleValue = PlatformUserRoleValue.USER;
        const userRoles: UserCompanyRoleValue[] = getUserCompanyRolesFromCrudFormUser(user);

        const data: UpdateUserDto = {
            platformRole,
            roles: userRoles,
        };

        // We don't setting updating platform role to superadmin, this means that a new platformrole would be set as normal user, we don't want that.
        if (oldUser.platformRole === PlatformUserRoleValue.SUPERADMIN) {
            delete data.platformRole;
        }

        if (user.email !== oldUser.email) {
            data.email = user.email;
        }

        const { updateUser } = useUserService();
        return updateUser({ companyName: props.companyName, updateUserDto: data, userId: oldUser.id });
    };

    const createUser = async (user: CrudFormUser) => {
        const { createUser } = useUserService();

        const data: CreateUserDto = {
            email: user.email,
            platformRole: PlatformUserRoleValue.USER,
            roles: getUserCompanyRolesFromCrudFormUser(user),
        };

        return createUser({ companyName: props.companyName, createUserDto: data });
    };

    const deleteUser = async (user: UserDto) => {
        const { deleteUser } = useUserService();
        return deleteUser({ companyName: props.companyName, userId: user.id });
    };

    const entityOptions: ComputedRef<IEntityOptions<UserDto, CrudFormUser>> = computed(() => ({
        displayName: 'User',
        displayKey: 'email',
        actions: {
            create: {
                submitHandler: user => createUser(user),
            },
            read: async entity => {
                const { getUser } = useUserService();
                return getUser({ companyName: props.companyName, userId: entity.id });
            },
            update: {
                submitHandler: (entity, oldEntity) => {
                    return updateUser(entity, oldEntity);
                },
            },
            delete: {
                disableAction: entity => {
                    if (entity.email !== currentUser?.email) return false;

                    if (currentUser?.platformRole === PlatformUserRoleValue.SUPERADMIN) {
                        if (currentUser.company.name !== props.companyName) {
                            return false;
                        }
                    }

                    return true;
                },
                submitHandler: deleteUser,
            },
        },
        entityToFormMapper: user => {
            const formUser: CrudFormUser = {
                email: user.email,
                roles: [
                    user.platformRole,
                    ...(user.userRoles?.map(role => {
                        return role.value;
                    }) || []),
                ],
                COMPANYADMIN:
                    user.userRoles?.some(role => {
                        return role.value === UserCompanyRoleValue.COMPANYADMIN;
                    }) || false,
            };
            return formUser;
        },
    }));

    const getUserCompanyRolesFromCrudFormUser = (crudFormUser: CrudFormUser) => {
        const userRoles: UserCompanyRoleValue[] = [UserCompanyRoleValue.USER];
        if (crudFormUser.COMPANYADMIN) userRoles.push(UserCompanyRoleValue.COMPANYADMIN);
        return userRoles;
    };

    const userProvider: IEntityProvider<UserDto> = {
        getEntities: async ({ pagination, filters, orderBy, advancedFilters }) => {
            const advancedFilterCopy = JSON.parse(JSON.stringify(advancedFilters));

            if (advancedFilterCopy?.length) {
                let hasRoleFilter = false;
                advancedFilterCopy.forEach((filter: any) => {
                    if (filter.field === 'role') {
                        filter.field = 'value';
                        hasRoleFilter = true;
                    }
                });

                if (hasRoleFilter) {
                    advancedFilterCopy.push({
                        field: 'name',
                        matchType: 'EQUALS',
                        path: 'userRoles.some.company',
                        value: props.companyName,
                    });
                }
            }

            const { getUsers } = useUserService();
            try {
                const requestBody: GetUsersV1Request = {
                    companyName: props.companyName,
                    roles: ['COMPANYADMIN', 'USER'],
                    search: filters?.searchString,
                    // skip: pagination?.skip,
                    // take: pagination?.take,
                    orderBy,
                    filters: advancedFilterCopy,
                    includeExternalUsers: true,
                };
                const data = await getUsers(requestBody);
                return { size: data.size, data: data.users };
            } catch {
                notify({
                    type: 'error',
                    text: "Couldn't fetch users",
                });
                return { size: 0, data: [] };
            }
        },
    };

    const reloadTable = () => {
        //@ts-ignore Vue does not seem to expose defineExpose functions, sometimes.
        crudTable.value?.doReload();
    };
</script>
