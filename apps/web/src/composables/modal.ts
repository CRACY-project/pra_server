import { createEventHook, type EventHook } from '@vueuse/core';
import { reactive } from 'vue';

export function useModal() {
    const beforeOpenHook: EventHook = createEventHook();
    return reactive({
        isOpen: false,
        open() {
            beforeOpenHook.trigger(null);
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
        },
        beforeOpen: beforeOpenHook.on,
    });
}
