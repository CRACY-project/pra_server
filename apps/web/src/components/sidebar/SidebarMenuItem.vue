<template>
    <router-link v-slot="{ isExactActive }" :to="props.item.to">
        <div
            :title="props.isCollapsed ? props.item.name : ''"
            :class="[
                isExactActive
                    ? 'bg-secondary-500 text-primary-500 accent-layer:text-tertiary-500 accent-fill-layer:fill-tertiary-500 dark:bg-dark-900 dark:text-gray-300 dark:accent-layer:text-tertiary-700 dark:accent-fill-layer:fill-tertiary-700'
                    : 'text-gray-700 hover:bg-secondary-300 hover:text-primary-400 dark:text-gray-300 dark:hover:bg-dark-600 dark:hover:text-gray-100',
                isCollapsed ? 'justify-center' : '',
                'group my-1 flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium',
                securityPanel ? 'hover:bg-white' : '',
                securityPanel && isExactActive
                    ? 'bg-white text-primary-600 hover:text-primary-500 dark:bg-secondary-900'
                    : '',
                securityPanel && !isExactActive ? 'text-secondary-900 hover:text-secondary-900' : '',
            ]"
        >
            <slot name="icon">
                <component
                    :is="props.item.icon"
                    :class="[
                        isExactActive
                            ? 'text-primary-500 accent-layer:text-tertiary-500 accent-fill-layer:fill-tertiary-500 dark:text-gray-300 dark:accent-layer:text-tertiary-700 dark:accent-fill-layer:fill-tertiary-700'
                            : 'text-gray-700 group-hover:text-primary-400 accent-layer:text-gray-700 group-hover:accent-layer:text-primary-400 accent-fill-layer:fill-gray-700 group-hover:accent-fill-layer:fill-primary-400 dark:text-gray-300 dark:group-hover:text-gray-100 dark:accent-layer:text-gray-300 dark:group-hover:accent-layer:text-gray-300 dark:accent-fill-layer:fill-gray-300 dark:group-hover:accent-fill-layer:fill-gray-300',
                        'h-6 w-6 flex-shrink-0',
                        securityPanel ? 'text-secondary-900' : '',
                    ]"
                    aria-hidden="true"
                />
            </slot>
            {{ props.isCollapsed ? null : props.item.name }}
        </div>
    </router-link>
</template>
<script setup lang="ts">
    interface IProps {
        item: { name: string; icon: any; to: string };
        isCollapsed: boolean;
        securityPanel?: boolean;
    }
    const props = defineProps<IProps>();
</script>
