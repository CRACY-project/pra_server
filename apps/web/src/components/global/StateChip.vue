<template>
    <Chip :custom-style="`flex ${value ? enabledStyles.chip : disabledStyles.chip}`" class="space-x-1">
        <component
            :is="value ? CheckIcon : XMarkIcon"
            class="stroke-2"
            :class="`h-4 w-4 ${value ? enabledStyles.icon : disabledStyles.icon}`"
            aria-hidden="true"
        />
        <span :class="`${value ? enabledStyles.text : disabledStyles.text}`">
            <slot>
                <p>
                    {{ value ? 'Enabled' : 'Disabled' }}
                </p>
            </slot>
        </span>
    </Chip>
</template>
<script setup lang="ts">
    import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

    interface IProps {
        value: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        value: false,
    });

    const enabledStyles = {
        chip: 'bg-[#D1FAE5] dark:bg-tertiary-700',
        icon: 'text-[#34D399] dark:text-gray-300',
        text: 'text-[#065F46] dark:text-gray-300',
    };

    const disabledStyles = {
        chip: 'bg-[#FEF3C7] dark:bg-gray-400',
        icon: 'text-[#FBBF24] dark:text-black',
        text: 'text-[#92400E] dark:text-black',
    };
</script>
