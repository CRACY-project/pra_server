<template>
    <div v-if="typeof value === 'object' && Object.keys(value).length" class="flex flex-col">
        <div class="flex flex-row items-center gap-1">
            <p
                class="cursor-pointer select-none text-sm font-medium text-gray-700 dark:text-gray-300"
                @click="openChildren = !openChildren"
            >
                {{ formatName(name) }}
            </p>
            <component
                :is="openChildren ? ChevronDownIcon : ChevronRightIcon"
                v-if="typeof value === 'object' && Object.keys(value).length"
                class="h-6 w-6 cursor-pointer"
                aria-hidden="true"
                @click="openChildren = !openChildren"
            />
        </div>
        <div v-if="openChildren">
            <PDEInfo
                v-for="[key, newValue] in Object.entries(value)"
                :key="key"
                :name="key"
                :value="newValue"
                class="ml-3"
            />
        </div>
    </div>
    <div v-else>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatName(name) }}: {{ value }}</p>
    </div>
</template>

<script lang="ts" setup>
    import { formatCamelCaseToTitleCase, formatSnakeCaseToTitleCase } from '@/utils';
    import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
    import { ref } from 'vue';

    interface IProps {
        name: string;
        value: any;
    }

    defineProps<IProps>();

    const openChildren = ref<boolean>(true);

    const formatName = (value: any) => {
        if (typeof value !== 'string') {
            return value;
        }

        value = formatCamelCaseToTitleCase(value);
        value = formatSnakeCaseToTitleCase(value);

        return value;
    };
</script>

<style></style>
