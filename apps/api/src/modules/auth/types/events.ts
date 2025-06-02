export const AuthEvent = {
    TOKENREQUEST_FOR_UNKNOWN_EMAIL: 'tokenRequestForUnknownEmail',
} as const;

export interface TokenRequestForUnknownEmailEvent {
    email: string;
}
