<template>
    <ul v-if="form.errors.length > 0" class="mt-2 px-6 text-sm text-red-500">
        <li v-for="(error, idx) in form.errors" :key="idx">{{ error }}</li>
    </ul>
    <FormKit v-model="formData" type="form" :actions="false" form-class="h-full flex flex-col" @submit="doSubmit">
        <div class="space-y-3 px-6 py-4">
            <template v-if="entityFields">
                <CrudModalField v-for="(field, fieldIdx) in entityFields" :key="fieldIdx" :field="field" />
            </template>
            <slot v-else :form-data="formData" :entity="entity"></slot>
        </div>
        <template #actions>
            <div
                class="mt-auto flex w-full flex-row justify-end rounded-b-md bg-gray-50 px-6 py-4 dark:border-t dark:bg-dark-400"
            >
                <slot name="actions"></slot>
                <Button
                    bg-color="bg-white dark:bg-dark-200"
                    text-color="text-gray-900 dark:text-gray-100"
                    border="border"
                    bg-color-hover="hover:bg-gray-50 dark:hover:bg-dark-100"
                    class="mr-2 h-min"
                    @click="doCancel"
                >
                    Cancel
                </Button>
                <FormKit
                    type="submit"
                    data-testid="form-submit"
                    :disabled="form.isProcessing"
                    :label="`${crudActionToHrf(crudAction)} ${entityType}`"
                />
            </div>
        </template>
    </FormKit>
</template>

<script lang="ts" setup>
    import { FormKit } from '@formkit/vue';
    import { notify } from '@kyvg/vue3-notification';
    import { onBeforeMount, ref } from 'vue';

    import Button from '@/components/global/Button.vue';
    import CrudModalField from '@/components/global/inputs/CrudModalField.vue';
    import { CrudActionType, type IEntityExceptions } from '@/types/crud-components';
    import type { CrudField } from '@/types/input/crudModal';

    import useForm from '../global/crudtable/form';
    import { crudActionToHrf } from './crud.functions';

    const props = defineProps<{
        entitySubmitFunction: (_entity: any, _oldEntity: any) => Promise<any>;
        entityType: string;
        entityDisplayKey: any;
        entity?: any;
        crudAction: CrudActionType;
        entityFields?: CrudField[];
        entityExceptions?: IEntityExceptions;
        entityToFormMapper?: (_entity: any) => any;
    }>();

    const formData = ref<any>({});
    const form = useForm(formData, props.entityExceptions);

    const emit = defineEmits(['close', 'success']);

    const doSubmit = async () => {
        const data = { ...formData.value };

        form.submit(async () => {
            const entity = await props.entitySubmitFunction(data, props.entity);
            if (entity) {
                let actionVerb = crudActionToHrf(props.crudAction).toLowerCase();
                if (actionVerb.slice(-1) === 'e') {
                    actionVerb += 'd';
                } else if (actionVerb.slice(-1) === 'y') {
                    actionVerb = actionVerb.slice(0, -1) + 'ied';
                } else {
                    actionVerb += 'ed';
                }

                notify({
                    text: `${props.entityType} ${entity[props.entityDisplayKey]} successfully ${actionVerb}.`,
                    type: 'success',
                });
                emit('success', entity);
            } else {
                notify({
                    text: `An error occurred while trying to ${crudActionToHrf(props.crudAction)} the ${props.entityType}.`,
                    type: 'error',
                });
            }
            emit('close');
        });
    };

    const doCancel = () => {
        emit('close');
    };

    onBeforeMount(() => {
        if (props.entityFields) {
            if (props.crudAction === CrudActionType.create) {
                for (const field of props.entityFields) {
                    if (!field.defaultValue) continue;
                    formData.value[field.name] = field.defaultValue();
                }
            } else if (props.crudAction === CrudActionType.update && props.entity) {
                if (props.entity.id) {
                    formData.value.id = props.entity.id;
                }
                for (const field of props.entityFields) {
                    formData.value[field.name] = props.entity[field.name];
                    if (field.valueMapper) {
                        formData.value[field.name] = field.valueMapper(props.entity);
                    }
                }
            }

            return;
        }

        if (!props.entity) return;

        if (props.entityToFormMapper) {
            formData.value = props.entityToFormMapper(props.entity);
            return;
        }

        formData.value = { ...props.entity };
    });
</script>

<style>
    .dark .dark-input::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }
</style>
