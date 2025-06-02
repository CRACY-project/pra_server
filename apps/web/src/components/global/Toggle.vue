<template>
    <Switch
        v-model="enabledValue"
        :class="[
            enabledValue ? 'bg-primary-500 dark:bg-tertiary-700' : 'bg-gray-300 dark:bg-dark-500',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent text-red-600 transition-colors duration-200 ease-in-out',
        ]"
        @click.stop="changeEnabledValue"
        @dblclick.stop
    >
        <span
            aria-hidden="true"
            :class="[
                enabledValue ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            ]"
        ></span>
    </Switch>
</template>

<script lang="ts" setup>
    import { Switch } from '@headlessui/vue';
    import { ref } from 'vue';

    interface IProps {
        enabled: boolean;
        inverse?: boolean;
    }

    const props = withDefaults(defineProps<IProps>(), {
        enabled: false,
    });

    const emit = defineEmits(['update:enabled', 'clicked']);

    const enabledValue = ref<boolean>(props.enabled);
    if (props.inverse) {
        enabledValue.value = !enabledValue.value;
    }

    const changeEnabledValue = () => {
        emit('update:enabled', enabledValue.value);
        emit('clicked', enabledValue.value);
    };
</script>

<style scoped></style>
