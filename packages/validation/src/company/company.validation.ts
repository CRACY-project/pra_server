export const CompanyValidation = {
    name: {
        maxLength: 50,
    },
    displayName: {
        maxLength: 50,
    },
    userDeviceInactivityCleanupThresholdDays: {
        min: 1,
        max: 365,
    },
    maxDevices: {
        min: 1,
        max: 5,
    },
};
