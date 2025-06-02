<template>
    <CompanyLayout>
        <template #sectionTitle>Company</template>
        <template #pageTitle> Customers </template>
        <template #content>
            <CrudTable
                open-with-single-click
                :entity-provider="customersProvider"
                :headers="headers"
                :entity-options="entityOptions"
                :empty-message="`No customers found`"
                :search-options="searchOptions"
                :backend-pagination-sorting="true"
                :pagination="{ itemsPerPage: 400 }"
                @open-entity="
                    (company: CompanyDto) => {
                        selectCompany(company);
                    }
                "
            >
                <template #createFields>
                    <CustomerCreateFields :crud-action-type="CrudActionType.create" />
                </template>
                <template #updateFields>
                    <CustomerCreateFields :crud-action-type="CrudActionType.update" />
                </template>
            </CrudTable>
        </template>
    </CompanyLayout>
</template>

<script lang="ts" setup>
    import {
        type CompanyDto,
        CompanyType,
        type CreateCompanyDto,
        type GetCustomersV1Request,
        type UpdateCompanyDto,
    } from '@cracy/typescript-client';
    import { notify } from '@kyvg/vue3-notification';
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';

    import CrudTable from '@/components/crud/CrudTable.vue';
    import CompanyLayout from '@/layouts/CompanyLayout/CompanyLayout.vue';
    import { useCompanyService } from '@/services/company.service';
    import {
        CrudActionType,
        type IEntityOptions,
        type IEntityProvider,
        type SearchOptions,
    } from '@/types/crud-components';
    import CustomerCreateFields from '@/views/company/customers/CustomerCreateFields.vue';

    import { headers } from './customers';

    const router = useRouter();

    const { getCustomers } = useCompanyService();

    const searchOptions = ref<SearchOptions>({
        enableSearch: true,
        options: ['all'],
        whitelistedOptions: ['name', 'displayName', 'apiKey'],
    });

    const entityOptions = computed<IEntityOptions<CompanyDto>>(() => ({
        displayName: 'Customer',
        displayKey: 'displayName',
        actions: {
            create: {
                submitHandler: createCompany,
            },
            update: {
                submitHandler: updateCompany,
            },
            delete: {
                submitHandler: deleteCompany,
                deletes: ['users', 'admins'],
            },
        },
    }));

    const createCompany = async (company: CreateCompanyDto) => {
        const { createCompany } = useCompanyService();
        const companyBody: CreateCompanyDto = {
            name: company.name,
            displayName: company.displayName,
            companyType: CompanyType.CUSTOMER,
            websiteUrl: company.websiteUrl,
        };
        return createCompany({ createCompanyDto: companyBody });
    };

    const updateCompany = async (company: CreateCompanyDto, oldCompany: CompanyDto) => {
        const { updateCompany } = useCompanyService();
        const companyBody: UpdateCompanyDto = {
            displayName: company.displayName,
            websiteUrl: company.websiteUrl,
        };
        return updateCompany({ updateCompanyDto: companyBody, companyName: oldCompany.name });
    };

    const deleteCompany = async (company: CompanyDto) => {
        const { deleteCompany } = useCompanyService();
        return deleteCompany({ companyName: company.name });
    };

    const customersProvider: IEntityProvider<CompanyDto> = {
        getEntities: async ({ pagination, filters, orderBy, advancedFilters }) => {
            try {
                const companyQueryParams: GetCustomersV1Request = {
                    skip: pagination?.skip,
                    take: pagination?.take,
                    orderBy,
                    filters: advancedFilters,
                    search: filters?.searchString,
                };
                return await getCustomers(companyQueryParams);
            } catch {
                notify({
                    type: 'error',
                    text: "Couldn't fetch users",
                });
            }
            return { size: 0, data: [] };
        },
    };

    const selectCompany = (company: CompanyDto) => {
        router.push(`/${company.name}/dashboard`);
    };
</script>

<style scoped></style>
