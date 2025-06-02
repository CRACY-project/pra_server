import { type EventMessage, EventType } from '@azure/msal-browser';

export const loginCallback = async (event: EventMessage) => {
    if (
        event.eventType === EventType.LOGIN_FAILURE ||
        event.eventType === EventType.ACQUIRE_TOKEN_FAILURE ||
        event.eventType === EventType.SSO_SILENT_FAILURE ||
        event.eventType === EventType.ACQUIRE_TOKEN_BY_CODE_FAILURE
    ) {
        console.warn('Login failed', event);
    }
    return event;
};
