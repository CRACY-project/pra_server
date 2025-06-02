<template>
    <div class="mt-3 flex justify-between px-6 text-sm text-black dark:text-gray-300">
        <p>
            Showing {{ props.size > 0 ? props.skip + 1 : 0 }} -
            {{ props.take + props.skip > props.size ? props.size : props.take + props.skip }}
            out of {{ props.size }} items
        </p>
        <div class="flex">
            <button
                type="button"
                :disabled="props.take >= props.take + props.skip"
                class="mr-5 flex items-center disabled:text-gray-400"
                @click="previousPage"
            >
                <ChevronLeftIcon class="h-5 w-5" /> Previous
            </button>
            <button
                type="button"
                :disabled="props.take + props.skip >= props.size"
                class="flex items-center disabled:text-gray-400"
                @click="nextPage"
            >
                Next <ChevronRightIcon class="h-5 w-5" />
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

    interface IProps {
        size: number;
        skip: number;
        take: number;
        filtered: number;
    }

    const props = withDefaults(defineProps<IProps>(), {
        size: 0,
        skip: 0,
        take: 50,
    });

    const emit = defineEmits(['update:next', 'update:previous']);

    const nextPage = () => {
        if (props.skip + props.take > props.size) {
            return;
        }
        emit('update:next');
    };

    const previousPage = () => {
        emit('update:previous');
    };
</script>
<style scoped></style>
