import {
    CompaniesApi,
    type CreateCompanyV1Request,
    type DeleteCompanyV1Request,
    type GetCompanyByNameV1Request,
    type GetCustomersV1Request,
    type UpdateCompanyV1Request,
} from '@cracy/typescript-client';

import { ApiClientFactory } from './api.middlewares';

export function useCompanyService() {
    const companyApiClient = ApiClientFactory.createApiClient(CompaniesApi);

    async function getCompany(params: GetCompanyByNameV1Request) {
        return companyApiClient.getCompanyByNameV1(params);
    }

    async function createCompany(params: CreateCompanyV1Request) {
        return companyApiClient.createCompanyV1(params);
    }

    async function updateCompany(params: UpdateCompanyV1Request) {
        return companyApiClient.updateCompanyV1(params);
    }

    async function deleteCompany(params: DeleteCompanyV1Request) {
        return companyApiClient.deleteCompanyV1(params);
    }

    async function getCustomers(params: GetCustomersV1Request) {
        return companyApiClient.getCustomersV1(params);
    }

    return {
        getCompany,
        createCompany,
        updateCompany,
        deleteCompany,
        getCustomers,
    };
}
