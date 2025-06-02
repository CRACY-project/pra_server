import { notify } from '@kyvg/vue3-notification';
import { reactive } from 'vue';

import { mapGenericError } from '@/components/crud/crud.functions';
import type { IEntityExceptions } from '@/types/crud-components';
import type { IError } from '@/types/exceptions';

export default function useForm(data: any, exceptions?: IEntityExceptions) {
    return reactive({
        data,
        errors: [] as string[],
        isProcessing: false,
        async submit(apiCall: any) {
            try {
                this.isProcessing = true;
                await apiCall();
            } catch (error: any) {
                const message = (error as IError).message;
                if (typeof message === 'string') {
                    this.errors = [message];
                } else if (Array.isArray(message)) {
                    this.errors = message;
                } else if (typeof error === 'object' && exceptions) {
                    this.errors = mapGenericError(error, exceptions);
                } else {
                    notify({
                        text: message ? message : `If this issue persists, please contact your administrator.`,
                        type: 'error',
                    });
                }
            } finally {
                this.isProcessing = false;
            }
        },
    });
}
