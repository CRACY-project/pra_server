import {
    type CreatePDEV1Request,
    type DeletePDEV1Request,
    type GetManyPDEV1Request,
    type GetPDEInfoV1Request,
    type GetPDEV1Request,
    PDEApi,
    type UpdatePDEV1Request,
} from '@cracy/typescript-client';

import { ApiClientFactory } from './api.middlewares';

export function usePDEService() {
    const apiClient = ApiClientFactory.createApiClient(PDEApi);

    function getPDEs(params: GetManyPDEV1Request) {
        return apiClient.getManyPDEV1(params);
    }

    function getPDE(request: GetPDEV1Request) {
        return apiClient.getPDEV1(request);
    }

    function deletePDE(params: DeletePDEV1Request) {
        return apiClient.deletePDEV1(params);
    }

    function createPDE(params: CreatePDEV1Request) {
        return apiClient.createPDEV1(params);
    }

    function updatePDE(params: UpdatePDEV1Request) {
        return apiClient.updatePDEV1(params);
    }

    function getPDEInfo(params: GetPDEInfoV1Request) {
        return apiClient.getPDEInfoV1(params);
    }

    return { deletePDE, getPDE, createPDE, updatePDE, getPDEs, getPDEInfo };
}
