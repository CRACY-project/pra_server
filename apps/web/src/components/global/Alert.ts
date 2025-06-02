export const AlertType = {
    WARNING: 'warning',
    CAUTION: 'caution',
    INFO: 'info',
    SUCCESS: 'success',
};

export type AlertType = (typeof AlertType)[keyof typeof AlertType];
