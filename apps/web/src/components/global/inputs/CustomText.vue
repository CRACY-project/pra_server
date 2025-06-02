<template>
    <div class="relative mt-1 w-full rounded-md shadow-sm">
        <input
            type="text"
            :value="props.context._value"
            :disabled="props.context.disabled"
            class="block w-full rounded-md border px-2 py-2 shadow-sm blur-[3px] hover:filter-none focus:outline-none dark:bg-dark-500 dark:text-gray-300 sm:text-sm"
            :class="{
                'opacity-65': props.context.disabled,
            }"
            @input="handleInput"
        />
        <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button
                v-if="!copied"
                type="button"
                class="inline-flex items-center rounded border bg-white p-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-dark-300 dark:hover:bg-dark-400"
                @click="copy(props.context._value)"
            >
                <ClipboardDocumentIcon class="h-4 w-4 text-gray-500 dark:text-gray-300" aria-hidden="true" />
            </button>
            <span v-else class="pt-0.5 text-sm text-gray-500">Copied!</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline';
    import { useClipboard } from '@vueuse/core';

    const { copy, copied } = useClipboard();

    interface IProps {
        context: any;
    }

    const props = defineProps<IProps>();

    function handleInput(e: any) {
        props.context.node.input(e.target.value);
    }
</script>
