<template>
    <FormKit
        type="text"
        name="name"
        label="Name"
        :validation="[
            [PDEValidation.serialNumber.required ? 'required' : ''],
            ['length', PDEValidation.name.minLength, PDEValidation.name.maxLength],
        ]"
    />
    <FormKit
        type="text"
        name="serialNumber"
        label="Serial Number"
        :validation="[
            [PDEValidation.serialNumber.required ? 'required' : ''],
            ['length', PDEValidation.serialNumber.minLength, PDEValidation.serialNumber.maxLength],
        ]"
    />
    <FormKit type="textClip" name="token" label="Token" disabled />
</template>
<script setup lang="ts">
    import { PDEValidation } from '@cracy/validation';
    import { FormKit } from '@formkit/vue';

    import { generateToken } from '@/utils';
    import type { PDEFormData } from '@/views/company/pde/pde.types';

    const form = defineModel<PDEFormData>('form', {
        required: true,
    });

    if (form.value.token == undefined) {
        form.value.token = generateToken(32);
    }
</script>
