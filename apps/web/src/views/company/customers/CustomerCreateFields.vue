<template>
    <FormKit v-bind="nameField" :disabled="crudActionType === CrudActionType.update" data-testid="name" />
    <FormKit v-bind="displayNameField" data-testid="display-name" />
</template>
<script setup lang="ts">
    import { CrudActionType } from '@/types/crud-components';

    import { displayNameField, nameField } from './customers';

    interface IProps {
        crudActionType: CrudActionType;
    }
    defineProps<IProps>();
</script>

<style scoped></style>
