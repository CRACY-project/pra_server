import {
    AuthenticationApi,
    type SendUserTokenCodeV1Request,
    type VerifyGoogleIdV1Request,
    type VerifyMicrosoftIdV1Request,
    type VerifyTokenV1Request,
} from '@cracy/typescript-client';

import { ApiClientFactory } from './api.middlewares';

export function useAuthService() {
    const authApiClient = ApiClientFactory.createApiClient(AuthenticationApi);

    function sendUserTokenCode(params: SendUserTokenCodeV1Request) {
        return authApiClient.sendUserTokenCodeV1(params);
    }
    function verifyToken(params: VerifyTokenV1Request) {
        return authApiClient.verifyTokenV1(params);
    }

    function verifyGoogleLogin(params: VerifyGoogleIdV1Request) {
        return authApiClient.verifyGoogleIdV1(params);
    }

    function verifyMicrosoftLogin(params: VerifyMicrosoftIdV1Request) {
        return authApiClient.verifyMicrosoftIdV1(params);
    }

    async function logout() {
        return authApiClient.logoutV1();
    }

    async function getMe() {
        return await authApiClient.getProfileV1();
    }

    return {
        verifyGoogleLogin,
        verifyMicrosoftLogin,
        logout,
        getMe,
        sendUserTokenCode,
        verifyToken,
    };
}
