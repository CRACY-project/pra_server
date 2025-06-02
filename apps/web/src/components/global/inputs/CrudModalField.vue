<template>
    <FormKit
        v-if="['taglist', 'dropdown', 'autocomplete', 'select'].includes(field.type)"
        :key="field.options"
        :label="field.label"
        :name="field.name"
        :type="field.type"
        :validation="field.validation"
        :validation-messages="field.validationMessages"
        :options="computedOptions"
        :disabled="field.disabled ? !!field.disabled : false"
        :help="field.help ? field.help : ''"
        :placeholder="field.placeholder"
        :empty-message="field.emptyMessage ? field.emptyMessage : null"
        :validation-visibility="field.validationVisibility ? field.validationVisibility : 'blur'"
        :tooltip="field.tooltip ?? ''"
        popover
        open-on-click
        :allow-new-values="field.allowNewValues"
        :sections-schema="field.sectionsSchema"
    >
        <template v-if="field.warning" #label>
            {{ field.label }}
            <p class="mb-1 align-text-bottom text-xs text-orange-500">
                {{ field.warning }}
            </p>
        </template>
    </FormKit>
    <SecureModeToggle v-else-if="field.name === 'secureMode'" />
    <FormKit
        v-else
        :key="field.name"
        :label="field.label"
        :name="field.name"
        :type="field.type"
        :validation="field.validation"
        :validation-messages="field.validationMessages"
        :disabled="field.disabled ? !!field.disabled : false"
        :help="field.help ? field.help : ''"
        :placeholder="field.placeholder"
        :empty-message="field.emptyMessage ? field.emptyMessage : undefined"
        :sections-schema="field.sectionsSchema"
        :validation-visibility="field.validationVisibility ? field.validationVisibility : 'blur'"
        :tooltip="field.tooltip ?? ''"
        open-on-click
    />
</template>
<script setup lang="ts">
    import { computed } from 'vue';

    import { type CrudField } from '@/types/input/crudModal';
    const props = defineProps<{ field: CrudField }>();

    const computedOptions = computed(() => {
        const options = props.field.options;

        if (!options) {
            return [];
        }
        if (options.value) {
            return options.value;
        }
        return options;
    });
</script>
