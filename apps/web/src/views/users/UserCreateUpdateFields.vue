<template>
    <FormKit type="text" name="email" validation="required|emailValidation" outer-class="flex-1" label="Email" />
    <FormKit type="toggle" label="Admin" :name="UserCompanyRoleValue.COMPANYADMIN" data-testid="admin" />
</template>
<script setup lang="ts">
    import { UserCompanyRoleValue, type UserDto } from '@cracy/typescript-client';

    import { type CrudFormUser } from './crud.types';

    interface IProps {
        formData: CrudFormUser;
        user?: UserDto;
    }

    withDefaults(defineProps<IProps>(), {
        user: undefined,
    });
</script>

<style scoped></style>
