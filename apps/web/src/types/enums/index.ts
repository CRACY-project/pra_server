export const DateConstraint = {
    BEFORE: 'before',
    AFTER: 'after',
    ON: 'on',
    BETWEEN: 'between',
};

export type DateConstraint = (typeof DateConstraint)[keyof typeof DateConstraint];

export const LoginProvider = {
    NONE: 'None',
    GOOGLE: 'Google',
    MICROSOFT: 'Microsoft',
    EMAIL: 'Email',
};
export type LoginProvider = (typeof LoginProvider)[keyof typeof LoginProvider];
