import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { markRaw } from 'vue';
import type { Router } from 'vue-router';

import router from '@/router';

declare module 'pinia' {
    export interface PiniaCustomProperties {
        router: Router;
    }
}

export const installPinia = (app: any) => {
    const pinia = createPinia();
    pinia.use(({ store }) => {
        store.router = markRaw(router);
    });
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
};
