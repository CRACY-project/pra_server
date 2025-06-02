import { defineStore } from 'pinia';

interface IState {
    errors: any[];
}

export const useErrorStore = defineStore('errorStore', {
    state: (): IState => {
        return {
            errors: [],
        };
    },
    actions: {
        addError(error: any) {
            this.errors.push(error);
            if (this.errors.length > 10) {
                this.errors.shift();
            }
        },
    },
});
