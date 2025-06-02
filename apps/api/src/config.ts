import { AuthenticationType } from '@cracy/database';
import * as dotenv from 'dotenv';
dotenv.config();

export const googleAuthConfig = {
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
};

export const JWTConfig = {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
};

export const JWTRefreshConfig = {
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
};

export const azureAuthConfig = {
    jwksUri: process.env.AZURE_AUTH_JWKS_URI ?? '',
    audience: process.env.AZURE_AUTH_AUDIENCE ?? '',
};

// Need to have more SuperAdmins?
// Add a value to the environment variable LOCAL_ADMIN
export const localAdmin = process.env.LOCAL_ADMIN;
const superAdmins = ['jonas.delrue@jimber.io'];
export const admins = (() => {
    if (localAdmin && !superAdmins.includes(localAdmin)) {
        return [...superAdmins, localAdmin];
    }
    return superAdmins;
})();

export const ALLOWED_LOGIN_METHODS = [AuthenticationType.GOOGLE, AuthenticationType.AZUREAD, AuthenticationType.EMAIL];

export let baseUrl = '';

if (process.env.ENVIRONMENT === 'production') {
    baseUrl = 'https://pra.jimber.io';
} else if (process.env.ENVIRONMENT === 'staging') {
    baseUrl = 'https://pra.staging.jimber.io';
} else if (process.env.ENVIRONMENT === 'testing') {
    baseUrl = 'https://pra.testing.jimber.io';
} else {
    baseUrl = 'http://localhost:4000';
}

export const mailFrom = process.env.MAIL_FROM ?? 'invalid';

export default () => ({
    googleAuthConfig,
    JWTConfig,
    JWTRefreshConfig,
    azureAuthConfig,
    admins,
    ALLOWED_LOGIN_METHODS,
});
