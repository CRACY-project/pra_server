<template>
    <div class="flex h-full flex-col items-center justify-center text-center">
        <img class="h-32 w-auto text-white sm:h-64" :src="isDark ? emptyImageDark : emptyImage" alt="Company logo" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No {{ getPlural() }}</h3>
        <template v-if="allowCreation">
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-100">Get started by creating a new {{ subject }}.</p>
            <div class="mt-6">
                <Button :class="allowMobileAction ? 'inline-flex' : 'hidden md:inline-flex'" @click="$emit('create')">
                    <PlusIcon class="mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
                    Create {{ subject }}
                </Button>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
    import { PlusIcon } from '@heroicons/vue/24/outline';
    const props = withDefaults(
        defineProps<{
            subject: string;
            subjectPlural?: string;
            allowCreation?: boolean;
            allowMobileAction?: boolean;
        }>(),
        {
            subjectPlural: undefined,
            allowCreation: true,
            allowMobileAction: false,
        }
    );
    defineEmits<{ create: [] }>();
    import { useDark } from '@vueuse/core';

    import emptyImage from '@/assets/empty.svg';
    import emptyImageDark from '@/assets/empty-dark-mode.svg';
    import Button from '@/components/global/Button.vue';

    const isDark = useDark();
    const getPlural = () => {
        if (props.subjectPlural) {
            return props.subjectPlural;
        }

        return `${props.subject}s`;
    };
</script>
