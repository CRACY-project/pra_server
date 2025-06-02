export enum ErrorCode {
    GENERAL_INTERNAL_ENTRAID_ERROR = 'GIE001',
    GENERAL_EXTERNAL_ENTRAID_ERROR = 'GEE001',
}

export class CodedError extends Error {
    code: string;

    constructor(message: string, code: ErrorCode) {
        super(message);
        this.code = code;
    }
}
