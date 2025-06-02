<template>
    <div class="h-4 w-4" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
        <div class="relative">
            <QuestionMarkCircleIcon class="h-4 w-4 cursor-pointer transition hover:opacity-75" />
            <Transition>
                <p
                    v-if="showTooltip"
                    class="absolute -top-1 left-5 z-40 whitespace-nowrap rounded border bg-white px-2 py-1 text-sm font-normal text-black shadow dark:bg-dark-800 dark:text-gray-300"
                >
                    <slot></slot><slot name="content" />
                </p>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { QuestionMarkCircleIcon } from '@heroicons/vue/24/solid';
    import { ref } from 'vue';

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
