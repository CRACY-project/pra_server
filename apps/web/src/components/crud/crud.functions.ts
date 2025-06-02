import { CrudActionType, type CrudExceptionHandler, type IEntityExceptions } from '@/types/crud-components';
import type { IError } from '@/types/exceptions';

export function crudActionToHrf(crudAction: CrudActionType): string {
    switch (crudAction) {
        case CrudActionType.create:
            return 'Create';
        case CrudActionType.update:
            return 'Edit';
        case CrudActionType.add:
            return 'Add';
        case CrudActionType.copy:
            return 'Duplicate';
        default:
            return crudAction;
    }
}

export const exceptionHandlers: { [key: string]: CrudExceptionHandler } = {
    409: ({ entityExceptions, message }) => {
        if (!entityExceptions.conflict) return [message.field];
        return [entityExceptions.conflict[message.field]];
    },
};

export const mapGenericError = (error: IError, exceptions: IEntityExceptions) => {
    const { statusCode, message } = error;
    const crudExceptionHandler = exceptionHandlers[statusCode.toString()];
    if (crudExceptionHandler) {
        return crudExceptionHandler({
            entityExceptions: exceptions,
            message: message as any,
        });
    }
    return message as string[];
};
