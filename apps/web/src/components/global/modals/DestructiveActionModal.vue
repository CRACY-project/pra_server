<template>
    <Alert :show-alert="show" type="warning" @close="$emit('update:show', false)">
        <template #title><slot name="title"></slot></template>
        <template #content>
            <div>
                <slot name="message"></slot>
                <p class="mb-2 mt-3 font-bold"><slot name="confirm"></slot></p>
                <FormKit id="confirm-form" type="form" :actions="false" @submit="confirm">
                    <FormKit name="Value" type="text" :validation="`required|sameValueValidation:${value}`" />
                </FormKit>
            </div>
        </template>
        <template #actions>
            <Button
                bg-color="bg-red-500"
                text-color="text-white"
                bg-color-hover="hover:bg-red-600"
                @click="submitForm('confirm-form')"
            >
                <slot name="confirm-text">Delete</slot>
            </Button>
            <CancelButton @click="$emit('update:show', false)" />
        </template>
    </Alert>
</template>

<script lang="ts" setup>
    import { submitForm } from '@formkit/vue';

    const emit = defineEmits(['update:show', 'submit']);

    interface IProps {
        show: boolean;
        value: string;
    }

    withDefaults(defineProps<IProps>(), {
        show: false,
    });

    const confirm = () => {
        emit('submit');
    };
</script>

<style scoped></style>
