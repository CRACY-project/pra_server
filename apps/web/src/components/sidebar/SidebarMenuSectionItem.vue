<template>
    <PopoverTooltip>
        <template #trigger>
            <component
                :is="!props.item.to ? 'div' : isExternal ? 'a' : RouterLink"
                :href="props.item.to"
                :to="props.item.to"
                :target="isExternal ? '_blank' : undefined"
                @click="emit('itemClick')"
            >
                <div
                    :class="[
                        isActive
                            ? 'border-l-2 border-l-primary-500 bg-secondary-500 dark:border-l-tertiary-700 dark:bg-dark-900'
                            : 'text-gray-700 hover:bg-secondary-300 hover:text-primary-400 dark:text-gray-300 dark:hover:bg-dark-600 dark:hover:text-gray-100',
                    ]"
                    class="group flex w-full cursor-pointer justify-center py-4"
                    :data-testid="`sidebar-menu-section-item-${props.item.name.toLowerCase()}`"
                >
                    <component
                        :is="props.item.icon"
                        :class="[
                            'h-6 w-6 flex-shrink-0',
                            isActive
                                ? 'text-primary-500 accent-layer:text-tertiary-500 accent-fill-layer:fill-tertiary-500 dark:text-gray-300 dark:accent-layer:text-tertiary-700 dark:accent-fill-layer:fill-tertiary-700'
                                : 'text-gray-700 group-hover:text-primary-400 accent-layer:text-gray-700 group-hover:accent-layer:text-primary-400 accent-fill-layer:fill-gray-700 group-hover:accent-fill-layer:fill-primary-400 dark:text-gray-300 dark:group-hover:text-gray-100 dark:accent-layer:text-gray-300 dark:group-hover:accent-layer:text-gray-100 dark:accent-fill-layer:fill-gray-400 dark:group-hover:accent-fill-layer:fill-gray-100',
                        ]"
                        aria-hidden="true"
                    />
                </div>
            </component>
        </template>
        <template #content>
            {{ props.item.name }}
            {{ props.item.isBeta ? '(beta)' : '' }}
        </template>
    </PopoverTooltip>
</template>
<script setup lang="ts">
    import { computed } from 'vue';
    import { RouterLink } from 'vue-router';

    import PopoverTooltip from '@/components/global/PopoverTooltip.vue';
    import { useSidebarStore } from '@/stores/sidebar.store';

    interface IProps {
        item: { name: string; icon?: any; to?: string; isBeta?: boolean };
        sectionIndex?: number;
    }

    const sidebarStore = useSidebarStore();

    const isActive = computed(() => {
        return props.item.name === sidebarStore.selectedSection;
    });

    const isExternal = computed(() => {
        return props.item.to?.startsWith('http');
    });

    const emit = defineEmits(['itemClick']);
    const props = defineProps<IProps>();
</script>
