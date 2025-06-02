<template>
    <div class="flex items-center justify-between border-b px-4 py-4">
        <div class="flex items-center truncate">
            <div class="rounded-md border bg-gray-50 p-1 dark:border-transparent dark:bg-tertiary-700">
                <component
                    :is="stat.icon"
                    class="h-6 w-6 text-primary-500 accent-layer:text-primary-500 accent-fill-layer:fill-primary-500 dark:text-gray-300 dark:accent-layer:text-white dark:accent-fill-layer:fill-white"
                    aria-hidden="true"
                />
            </div>
            <p class="ml-3 truncate text-sm font-bold uppercase tracking-[.15em] text-gray-600 dark:text-gray-100">
                {{ stat.name }}
            </p>
        </div>
        <slot name="buttons"> </slot>
    </div>
</template>
<script lang="ts" setup>
    interface IProps {
        stat: any;
    }

    defineProps<IProps>();
</script>
