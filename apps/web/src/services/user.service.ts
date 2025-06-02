import {
    type CreateUserV1Request,
    type DeleteUserV1Request,
    type GetUsersV1Request,
    type GetUserV1Request,
    type UpdateUserV1Request,
    UsersApi,
} from '@cracy/typescript-client';

import { ApiClientFactory } from './api.middlewares';

export function useUserService() {
    const apiClient = ApiClientFactory.createApiClient(UsersApi);

    async function getUsers(params: GetUsersV1Request) {
        return apiClient.getUsersV1(params);
    }

    function getUser(props: GetUserV1Request) {
        return apiClient.getUserV1(props);
    }

    function createUser(params: CreateUserV1Request) {
        return apiClient.createUserV1(params);
    }

    function updateUser(params: UpdateUserV1Request) {
        return apiClient.updateUserV1(params);
    }

    function deleteUser(params: DeleteUserV1Request) {
        return apiClient.deleteUserV1(params);
    }

    return {
        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
    };
}
