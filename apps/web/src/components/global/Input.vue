<template>
    <input
        :type="type"
        :className="`rounded-[4px] py-[4.3px] px-2.5 focus:ring-1 transition focus:outline-none focus:shadow-outline w-full ${
            type !== 'submit'
                ? 'border bg-white  ring-primary-500'
                : 'bg-primary-500 hover:bg-primary-600 text-white hover:cursor-pointer'
        } ${classes} ${error && 'border-red-500'}`"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        :minlength="minLength"
        :maxlength="maxLength"
        :min="min"
        :disabled="disabled"
        @input="updateValue"
        @change="updateValue"
    />
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
</template>

<script lang="ts" setup>
    interface IProps {
        placeholder?: string;
        type?: string;
        modelValue?: string | boolean | number;
        classes?: string;
        required?: boolean;
        disabled?: boolean;
        minLength?: number;
        maxLength?: number;
        error?: string;
        min?: number;
    }

    withDefaults(defineProps<IProps>(), {
        placeholder: '...',
        type: 'text',
        required: false,
        disabled: false,
        modelValue: '',
        classes: '',
        minLength: 0,
        maxLength: 50,
        error: '',
        min: 10,
    });

    const emit = defineEmits(['update:modelValue']);

    const updateValue = (event: Event) => {
        emit('update:modelValue', (event.target as HTMLInputElement).value);
    };
</script>

<style scoped></style>
