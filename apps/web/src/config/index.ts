import { type Configuration, type PopupRequest, PublicClientApplication } from '@azure/msal-browser';

export const api = '/api/v1';

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_AUTH_AUDIENCE,
        redirectUri: `${window.location.origin}/login`,
    },
    cache: {
        cacheLocation: 'localStorage',
    },
};
export const msalInstance = new PublicClientApplication(msalConfig);

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ['User.Read'],
    prompt: 'select_account',
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
