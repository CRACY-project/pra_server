<template>
    <SwitchGroup as="div" class="flex w-full items-center justify-between p-1">
        <span v-if="context.label" class="flex flex-grow flex-col">
            <SwitchLabel as="span" class="text-sm font-medium text-gray-900 dark:text-gray-300" passive>
                {{ context.label }}
            </SwitchLabel>
        </span>
        <Toggle :enabled="context._value" @clicked="context.node.input(!context._value)"></Toggle>
    </SwitchGroup>
</template>

<script lang="ts" setup>
    import { SwitchGroup, SwitchLabel } from '@headlessui/vue';

    import Toggle from '../Toggle.vue';

    interface IProps {
        context: any;
    }

    defineProps<IProps>();
</script>
