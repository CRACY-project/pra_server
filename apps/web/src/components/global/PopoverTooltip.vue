<template>
    <div @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
        <div ref="reference">
            <slot name="trigger">
                <div class="h-4 w-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="cursor-pointer transition hover:opacity-75"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </slot>
        </div>
        <div ref="floating" :style="floatingStyles" class="z-[500]">
            <p
                v-if="showTooltip"
                class="whitespace-nowrap rounded border bg-white px-2 py-1 text-sm shadow dark:bg-dark-800"
            >
                <slot name="content" />
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
    import { ref } from 'vue';

    const reference = ref(null);
    const floating = ref(null);

    const { floatingStyles } = useFloating(reference, floating, {
        placement: 'right',
        middleware: [
            offset(() => ({
                mainAxis: 5,
                crossAxis: -15,
            })),
            flip(),
            shift(),
        ],
        whileElementsMounted: autoUpdate,
    });

    const showTooltip = ref(false);
</script>

<style scoped>
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>
